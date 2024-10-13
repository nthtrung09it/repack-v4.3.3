// app/screens/AuthScreen.tsx
import React from 'react';
import {Button, SafeAreaView, ViewStyle} from 'react-native';
import {SignOutButton} from '../components/SignOutButton';
import {Lists} from '../components/Lists';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../NavigationTypes';

export const WelcomeScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  return (
    <SafeAreaView style={$container}>
      <Button
        title="Navigate to mini apps"
        onPress={() => navigation.navigate('MiniAppScreen')}
      />
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
