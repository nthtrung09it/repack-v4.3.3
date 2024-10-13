// app/services/database/schema.ts
import {column, Schema, Table} from '@powersync/react-native';

export const LISTS_TABLE = 'lists';
export const TODOS_TABLE = 'todos';
export const PACK_A_TABLE = 'pack_a';
export const PACK_B_TABLE = 'pack_b';

const todos = new Table(
  {
    list_id: column.text,
    created_at: column.text,
    completed_at: column.text,
    description: column.text,
    created_by: column.text,
    completed_by: column.text,
    completed: column.integer,
  },
  {indexes: {list: ['list_id']}},
);

const lists = new Table({
  created_at: column.text,
  name: column.text,
  owner_id: column.text,
});

const pack_a = new Table({
  name: column.text,
});

const pack_b = new Table({
  name: column.text,
});

export const AppSchema = new Schema({
  todos,
  lists,
  pack_a,
  pack_b,
});

export type Database = (typeof AppSchema)['types'];
export type TodoRecord = Database['todos'];
// OR:
// export type Todo = RowType<typeof todos>;

export type ListRecord = Database['lists'];
export type PackARecord = Database['pack_a'];
export type PackBRecord = Database['pack_b'];
