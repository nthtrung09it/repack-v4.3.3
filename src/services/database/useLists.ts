import {useQuery} from '@powersync/react-native';
import {useCallback} from 'react';
import {useAuth} from './use-auth';
import {useDatabase} from './database';
import {ListRecord, LISTS_TABLE, TODOS_TABLE} from './schema';

// Extend the base type with the calculated fields from our query
export type ListItemRecord = ListRecord & {
  total_tasks: number;
  completed_tasks: number;
};

export const useLists = () => {
  // Get the current user from the auth context
  const {user} = useAuth();
  // Get the database instance from the context
  const {powersync} = useDatabase();

  // List fetching logic here. You can modify it as per your needs.
  const {data: lists} = useQuery<ListItemRecord>(`
      SELECT ${LISTS_TABLE}.*,
             COUNT(${TODOS_TABLE}.id) AS total_tasks,
             SUM(CASE WHEN ${TODOS_TABLE}.completed = true THEN 1 ELSE 0 END) as completed_tasks
      FROM ${LISTS_TABLE}
               LEFT JOIN ${TODOS_TABLE} ON ${LISTS_TABLE}.id = ${TODOS_TABLE}.list_id
      GROUP BY ${LISTS_TABLE}.id
  `);

  const createList = useCallback(
    async (name: string) => {
      if (!user) {
        throw new Error("Can't add list -- user is undefined");
      }

      return powersync.execute(
        `
          INSERT INTO ${LISTS_TABLE}
              (id, name, created_at, owner_id)
          VALUES (uuid(), ?, ?, ?)`,
        [name, new Date().toISOString(), user?.id],
      );
    },
    [user, powersync],
  );

  const deleteList = useCallback(
    async (id: string) => {
      console.log('Deleting list', id);
      return powersync.execute(
        `DELETE
                             FROM ${LISTS_TABLE}
                             WHERE id = ?`,
        [id],
      );
    },
    [powersync],
  );

  return {lists, createList, deleteList};
};
