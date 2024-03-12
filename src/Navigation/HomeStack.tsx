import {View, Text} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import navigationStrings from '../Contstants/navigationStrings';
import {Home} from '../Screens';

const Stack = createNativeStackNavigator();
const HomeStack = () => {
  return (
    <Stack.Navigator
      initialRouteName={navigationStrings.HOME}
      screenOptions={{headerShown: false}}>
      <Stack.Screen name={navigationStrings.HOME} component={Home} />
    </Stack.Navigator>
  );
};

export default HomeStack;
