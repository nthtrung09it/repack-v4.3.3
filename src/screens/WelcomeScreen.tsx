// app/screens/AuthScreen.tsx
import React from 'react';
import {SafeAreaView, ViewStyle} from 'react-native';
import {SignOutButton} from '../components/SignOutButton';
import {Lists} from '../components/Lists';

export const WelcomeScreen: React.FC = () => {
  return (
    <SafeAreaView style={$container}>
      <Lists />
      <SignOutButton />
    </SafeAreaView>
  );
};

const $container: ViewStyle = {
  flex: 1,
  backgroundColor: 'white',
  display: 'flex',
  justifyContent: 'flex-start',
  height: '100%',
  flexDirection: 'column',
};
