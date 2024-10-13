import {useQuery} from '@powersync/react-native';
import {MINI_APPS_TABLE, MiniAppRecord} from './schema';

// Extend the base type with the calculated fields from our query
export const useMiniApps = () => {
  const {
    isFetching,
    isLoading,
    data: miniApps,
    refresh,
  } = useQuery<MiniAppRecord>(
    `
      SELECT ${MINI_APPS_TABLE}.*
      FROM ${MINI_APPS_TABLE}
  `,
    [],
    {},
  );

  return {miniApps, isFetching, isLoading, refresh};
};
