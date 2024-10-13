/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {View} from 'react-native';
import {supabase} from './src/services/database/supabase';

const App2 = (): React.JSX.Element => {
  const tmp = supabase;

  return <View style={{flex: 1, backgroundColor: 'red'}}></View>;
};

export default App2;
