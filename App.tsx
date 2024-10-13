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
import {DatabaseProvider} from './src/services/database/database';
import Logger from 'js-logger';
import {MiniAppScreen} from './src/screens/MiniAppScreen';

const RootStack = createStackNavigator<RootStackParamList>();

function App(): React.JSX.Element {
  const {signedIn} = useAuth();

  return (
    <NavigationContainer>
      <RootStack.Navigator>
        {signedIn ? (
          <>
            <RootStack.Screen name="WelcomeScreen" component={WelcomeScreen} />
            <RootStack.Screen name="MiniAppScreen" component={MiniAppScreen} />
          </>
        ) : (
          <RootStack.Screen name="AuthScreen" component={AuthScreen} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
const Root = () => {
  // Log messages will be written to the window's console.
  Logger.useDefaults();
  Logger.setLevel(Logger.DEBUG);

  return (
    <AuthProvider>
      <DatabaseProvider>
        <App />
      </DatabaseProvider>
    </AuthProvider>
  );
};

export default Root;
