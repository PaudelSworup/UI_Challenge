import {View, Text} from 'react-native';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AuthStack from './AuthStack';
import HomeStack from './HomeStack';

const Route = () => {
  return (
    <NavigationContainer>
      <AuthStack />
      {/* <HomeStack /> */}
    </NavigationContainer>
  );
};

export default Route;
