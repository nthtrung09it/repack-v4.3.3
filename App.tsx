/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {RootStackParamList} from './src/NavigationTypes';
import {createStackNavigator} from '@react-navigation/stack';
import {AuthProvider, useAuth} from './src/services/database/use-auth';
import {AuthScreen} from './src/screens/AuthScreen';
import {WelcomeScreen} from './src/screens/WelcomeScreen';

const RootStack = createStackNavigator<RootStackParamList>();

function App(): React.JSX.Element {
  const {signedIn} = useAuth();

  return (
    <NavigationContainer>
      <RootStack.Navigator initialRouteName="AuthScreen">
        {signedIn ? (
          <RootStack.Screen name="WelcomeScreen" component={WelcomeScreen} />
        ) : (
          <RootStack.Screen name="AuthScreen" component={AuthScreen} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
const Root = () => {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
};

export default Root;
