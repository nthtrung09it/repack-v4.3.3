// app/services/database/supabase.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import {createClient} from '@supabase/supabase-js';
import Config from '../../config/config.base';
import {
  AbstractPowerSyncDatabase,
  CrudEntry,
  PowerSyncBackendConnector,
  PowerSyncCredentials,
  UpdateType,
} from '@powersync/react-native';

export const supabase = createClient(
  Config.supabaseUrl,
  Config.supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      storage: AsyncStorage,
    },
  },
);

// This function fetches the session token from Supabase, it should return null if the user is not signed in, and the session token if they are.
const fetchCredentials = async (): Promise<PowerSyncCredentials | null> => {
  const {
    data: {session},
    error,
  } = await supabase.auth.getSession();

  if (error) {
    throw new Error(`Could not fetch Supabase credentials: ${error}`);
  }

  if (!session) {
    return null;
  }

  return {
    endpoint: Config.powersyncUrl,
    token: session.access_token ?? '',
    expiresAt: session.expires_at
      ? new Date(session.expires_at * 1000)
      : undefined,
  };
};

// Regexes for response codes indicating unrecoverable errors.
const FATAL_RESPONSE_CODES = [
  /^22...$/, // Data Exception
  /^23...$/, // Integrity Constraint Violation
  /^42501$/, // INSUFFICIENT PRIVILEGE
];

// PowerSync will call this function to upload data to the backend
const uploadData: (
  database: AbstractPowerSyncDatabase,
) => Promise<void> = async database => {
  const transaction = await database.getNextCrudTransaction();

  if (!transaction) {
    return;
  }

  let lastOp: CrudEntry | null = null;
  try {
    // Note: If transactional consistency is important, use database functions
    // or edge functions to process the entire transaction in a single call.
    for (const op of transaction.crud) {
      lastOp = op;
      const table = supabase.from(op.table);
      let result: any = null;
      switch (op.op) {
        case UpdateType.PUT:
          const record = {...op.opData, id: op.id};
          result = await table.upsert(record);
          break;
        case UpdateType.PATCH:
          result = await table.update(op.opData).eq('id', op.id);
          break;
        case UpdateType.DELETE:
          result = await table.delete().eq('id', op.id);
          break;
      }

      if (result?.error) {
        throw new Error(
          `Could not ${op.op} data to Supabase error: ${JSON.stringify(
            result,
          )}`,
        );
      }
    }

    await transaction.complete();
  } catch (ex: any) {
    console.debug(ex);
    if (
      typeof ex.code === 'string' &&
      FATAL_RESPONSE_CODES.some(regex => regex.test(ex.code))
    ) {
      /**
       * Instead of blocking the queue with these errors,
       * discard the (rest of the) transaction.
       *
       * Note that these errors typically indicate a bug in the application.
       * If protecting against data loss is important, save the failing records
       * elsewhere instead of discarding, and/or notify the user.
       */
      console.error(`Data upload error - discarding ${lastOp}`, ex);
      await transaction.complete();
    } else {
      // Error may be retryable - e.g. network error or temporary server error.
      // Throwing an error here causes this call to be retried after a delay.
      throw ex;
    }
  }
};

export const supabaseConnector: PowerSyncBackendConnector = {
  fetchCredentials,
  uploadData,
};
