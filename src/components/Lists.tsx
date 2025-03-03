// app/components/Lists.tsx
import {NavigationProp, useNavigation} from '@react-navigation/native';
import React, {useCallback} from 'react';
import {
  Button,
  FlatList,
  RefreshControl,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {colors, spacing} from '../theme';
import {ListItemRecord, useLists} from '../services/database/useLists';
import {AddList} from './AddList';

export const Lists = () => {
  // use our hook to fetch the lists
  const {isFetching, isLoading, lists, deleteList, refresh} = useLists();

  // This function tells FlatList how to render each item
  const renderItem = useCallback(
    ({item}: {item: ListItemRecord}) => {
      return (
        <TouchableOpacity key={item.id} onPress={() => {}}>
          <View>
            <Text>{item.name}</Text>
            <Button title="Delete" onPress={() => deleteList(item.id)} />
          </View>
        </TouchableOpacity>
      );
    },
    [deleteList],
  );

  return (
    <View style={$container}>
      <Text>Lists</Text>
      <Text>isFetching: {isFetching ? 'fetching' : ''}</Text>
      <Text>isLoading: {isLoading}</Text>
      <View style={$card}>
        <AddList />
      </View>
      <View style={[$list, $card]}>
        <Text>Your Lists</Text>
        <FlatList
          refreshControl={
            <RefreshControl refreshing={isFetching} onRefresh={refresh} />
          }
          style={$listContainer}
          // pass in our lists
          data={lists}
          // pass in our renderItem function
          renderItem={renderItem}
          keyExtractor={item => item.id}
          ItemSeparatorComponent={() => <View style={$separator} />}
          // show a message if the list is empty
          ListEmptyComponent={<Text style={$emptyList}>No lists found</Text>}
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
const $listItemText: TextStyle = {
  height: 44,
  width: 44,
};
const $deleteListIcon: ViewStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: 44,
  marginVertical: spacing.xxs,
};
