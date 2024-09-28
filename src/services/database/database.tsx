import {SupabaseClient} from '@supabase/supabase-js';
import {useAuth} from './use-auth';
import React, {PropsWithChildren, useEffect} from 'react';
import {
  AbstractPowerSyncDatabase,
  PowerSyncContext,
  PowerSyncDatabase,
} from '@powersync/react-native';
import {supabase, supabaseConnector} from './supabase'; // Adjust the path as needed
import {AppSchema} from './schema'; // Adjust the path as needed

export class Database {
  // We expose the PowerSync and Supabase instances for easy access elsewhere in the app
  powersync: AbstractPowerSyncDatabase;
  supabase: SupabaseClient = supabase;

  /**
   * Initialize the Database class with a new PowerSync instance
   */
  constructor() {
    console.log('--> 1.1 database initialized');
    try {
      this.powersync = new PowerSyncDatabase({
        database: {
          dbFilename: 'sqlite.db',
        },
        schema: AppSchema,
      });
    } catch (e) {
      console.log('--> 1.3.1 database initialized errrrrrr');
      console.error(e);
      console.log('--> 1.3.2 database initialized errrrrrr');
      throw e;
    }
    console.log('--> 1.2 database initialized');
  }

  /**
   * Initialize the PowerSync instance and connect it to the Supabase backend.
   * This will call `fetchCredentials` on the Supabase connector to get the session token.
   * So if your database requires authentication, the user will need to be signed in before this is
   * called.
   */
  async init() {
    await this.powersync.init();
    await this.powersync.connect(supabaseConnector);
  }

  async disconnect() {
    await this.powersync.disconnectAndClear();
  }
}

console.log('--> 1 database initialized');
const database = new Database();
console.log('--> 2 database initialized');

// A context to provide our singleton to the rest of the app
const DatabaseContext = React.createContext<Database | null>(null);

export const useDatabase = () => {
  const context: Database | null = React.useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }

  return context;
};

// Finally, we create a provider component that initializes the database and provides it to the app
export function DatabaseProvider<T>({children}: PropsWithChildren<T>) {
  const {user} = useAuth();
  useEffect(() => {
    if (user) {
      database.init().catch(console.error);
    }
  }, [user]);

  return (
    <DatabaseContext.Provider value={database}>
      <PowerSyncContext.Provider value={database.powersync}>
        {children}
      </PowerSyncContext.Provider>
    </DatabaseContext.Provider>
  );
}
