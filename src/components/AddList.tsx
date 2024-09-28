// app/components/AddList.tsx
import React from 'react';
import {
  Button,
  Keyboard,
  Text,
  TextInput,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import {colors, spacing} from '../theme';
import {useLists} from '../services/database/useLists';

/**
 * Display a form to add a new list
 */
export const AddList = () => {
  const [newListName, setNewListName] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);

  // we use the function from  our hook to create a new list
  const {createList} = useLists();

  const handleAddList = React.useCallback(async () => {
    if (!newListName) {
      Keyboard.dismiss();
      return;
    }
    try {
      await createList(newListName);
      setNewListName('');
    } catch (e: any) {
      setError(`Failed to create list: ${e?.message ?? 'unknown error'}`);
    } finally {
      Keyboard.dismiss();
    }
  }, [createList, newListName]);

  return (
    <View style={$container}>
      <Text>Add a List</Text>
      <View style={$form}>
        <TextInput
          placeholder="Enter a list name"
          style={$textField}
          onChangeText={setNewListName}
          value={newListName}
          onSubmitEditing={handleAddList}
        />
        <Button title="Add List" onPress={handleAddList} />
      </View>
      {error && <Text style={$error}>{error}</Text>}
    </View>
  );
};

const $container: ViewStyle = {
  padding: spacing.md,
  backgroundColor: colors.palette.neutral200,
};

const $form: ViewStyle = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
};

const $textField: ViewStyle = {
  flex: 1,
};

const $textInput: ViewStyle = {
  backgroundColor: colors.palette.neutral100,
};

const $button: ViewStyle = {
  marginHorizontal: spacing.xs,
  padding: 0,
  paddingHorizontal: spacing.xs,
  paddingVertical: 0,
  minHeight: 44,
};

const $error: TextStyle = {
  color: colors.error,
  marginTop: spacing.sm,
};
