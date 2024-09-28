// app/components/SignOutButton.tsx
import * as React from 'react';
import {Button, StyleProp, View, ViewStyle} from 'react-native';
// import {observer} from 'mobx-react-lite';
import {useAuth} from '../services/database/use-auth';
import {useDatabase} from '../services/database/database';

export interface SignOutButtonProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>;
}

/**
 * Describe your component here
 */
export const SignOutButton = (props: SignOutButtonProps) => {
  const {style} = props;
  const $styles = [$container, style];

  const {signOut} = useAuth();
  const {powersync} = useDatabase();

  const handleSignOut = async () => {
    await powersync.disconnectAndClear();
    await signOut();
  };

  return (
    <View style={$styles}>
      <Button
        title="Signout"
        onPress={() => {
          handleSignOut();
        }}
      />
    </View>
  );
};

const $container: ViewStyle = {
  padding: 16,
};
