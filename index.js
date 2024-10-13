/**
 * @format
 */
import 'react-native-url-polyfill/auto';
import '@azure/core-asynciterator-polyfill';
import 'react-native-gesture-handler';

import {AppRegistry} from 'react-native';

// App work with metro
// import App from './App';

import App from './App2';

import {name as appName} from './app.json';

// import {ScriptManager, Script} from '@callstack/repack/client';

// ScriptManager.shared.addResolver(async (scriptId, caller) => {
//   // In dev mode, resolve script location to dev server.
//   if (__DEV__) {
//     return {
//       url: Script.getDevServerURL(scriptId),
//       cache: false,
//     };
//   }

//   return {
//     url: Script.getRemoteURL(
//       `http://somewhere-on-the-internet.com/${scriptId}`,
//     ),
//   };
// });

AppRegistry.registerComponent(appName, () => App);
