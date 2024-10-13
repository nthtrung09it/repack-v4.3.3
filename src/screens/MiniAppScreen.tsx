// app/screens/AuthScreen.tsx
import React from 'react';
import {SafeAreaView, ViewStyle} from 'react-native';
import {SignOutButton} from '../components/SignOutButton';
// import { MiniApps } from '../components/MiniApps';

export const MiniAppScreen: React.FC = () => {
  return (
    <SafeAreaView style={$container}>
      {/* <MiniApps /> */}
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
