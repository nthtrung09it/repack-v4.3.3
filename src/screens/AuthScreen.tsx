// app/screens/AuthScreen.tsx
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Button,
  Modal,
  Text,
  TextInput,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import {useAuth} from '../services/database/use-auth';
import {useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../NavigationTypes';

export const AuthScreen: React.FC = () => {
  const {signUp, signIn, loading, error, user} = useAuth();
  const [email, setEmail] = useState('admin@chibi.vn');
  const [password, setPassword] = useState('123123123123');

  const navigation = useNavigation();

  const handleSignIn = async () => {
    signIn(email, password);
  };

  const handleSignUp = async () => {
    signUp(email, password);
  };

  useEffect(() => {
    if (user) {
      navigation.navigate('WelcomeScreen',);
    }
  }, [navigation, user]);

  return (
    <View style={$container}>
      <Text>PowerSync + Supabase</Text>
      <Text>Sign in or Create Account</Text>
      <TextInput
        placeholder="Email"
        style={{
          height: 48,
          borderColor: '#000',
          borderWidth: 0.5,
          marginBottom: 16,
        }}
        value={email}
        inputMode={'email'}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize={'none'}
      />
      <TextInput
        style={{
          height: 48,
          borderColor: '#000',
          borderWidth: 0.5,
          marginBottom: 16,
        }}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <View style={$buttonContainer}>
        <Button disabled={loading} title={'Sign In'} onPress={handleSignIn} />

        <Button
          disabled={loading}
          title={'Register New Account'}
          onPress={handleSignUp}
        />
      </View>
      {error && <Text style={$error}>{error}</Text>}
      <Modal transparent visible={loading}>
        <View style={$modalBackground}>
          <ActivityIndicator size="large" />
        </View>
      </Modal>
    </View>
  );
};

const $container: ViewStyle = {
  backgroundColor: 'white',
  flex: 1,
  justifyContent: 'center',
  paddingHorizontal: 24,
};

const $modalBackground: ViewStyle = {
  alignItems: 'center',
  backgroundColor: '#00000040',
  flex: 1,
  flexDirection: 'column',
  justifyContent: 'space-around',
};

const $error: TextStyle = {
  color: 'red',
  marginVertical: 12,
  textAlign: 'center',
  width: '100%',
  fontSize: 20,
};

const $buttonContainer: ViewStyle = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  marginVertical: 12,
};
