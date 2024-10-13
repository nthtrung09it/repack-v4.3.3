// app/components/Lists.tsx
import React, {useCallback} from 'react';
import {
  FlatList,
  RefreshControl,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {colors, spacing} from '../theme';
import {useMiniApps} from '../services/database/useMiniApps';
import {MiniAppRecord} from '../services/database/schema';

export const MiniApps = () => {
  // use our hook to fetch the lists
  const {isFetching, miniApps, refresh} = useMiniApps();

  // This function tells FlatList how to render each item
  const renderItem = useCallback(({item}: {item: MiniAppRecord}) => {
    return (
      <TouchableOpacity key={item.id} onPress={() => {}}>
        <View>
          <Text>{item.name}</Text>
        </View>
      </TouchableOpacity>
    );
  }, []);

  return (
    <View style={$container}>
      <Text>Mini Apps</Text>
      <View style={[$list, $card]}>
        <FlatList
          refreshControl={
            <RefreshControl refreshing={isFetching} onRefresh={refresh} />
          }
          style={$listContainer}
          // pass in our lists
          data={miniApps}
          // pass in our renderItem function
          renderItem={renderItem}
          keyExtractor={item => item.id}
          ItemSeparatorComponent={() => <View style={$separator} />}
          // show a message if the list is empty
          ListEmptyComponent={<Text style={$emptyList}>No mini apps</Text>}
        />
      </View>
    </View>
  );
};

// STYLES
const $separator: ViewStyle = {height: 1, backgroundColor: colors.border};
const $emptyList: TextStyle = {
  textAlign: 'center',
  color: colors.textDim,
  opacity: 0.5,
  padding: spacing.lg,
};
const $card: ViewStyle = {
  shadowColor: colors.palette.neutral800,
  shadowOffset: {width: 0, height: 1},
  shadowRadius: 2,
  shadowOpacity: 0.35,
  borderRadius: 8,
};
const $listContainer: ViewStyle = {
  backgroundColor: colors.palette.neutral100,
  paddingHorizontal: spacing.md,
  height: '100%',
  borderColor: colors.border,
  borderWidth: 1,
};
const $list: ViewStyle = {
  flex: 1,
  marginVertical: spacing.md,
  backgroundColor: colors.palette.neutral200,
  padding: spacing.md,
};
const $container: ViewStyle = {
  flex: 1,
  display: 'flex',
  flexGrow: 1,
  padding: spacing.md,
};
