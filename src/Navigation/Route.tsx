import {View, Text} from 'react-native';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AuthStack from './AuthStack';
import HomeStack from './HomeStack';
import {navigationRef} from '../APIS/pushNotification/NavigationService';

const Route = () => {
  return (
    <NavigationContainer ref={navigationRef}>
      <AuthStack />
      {/* <HomeStack /> */}
    </NavigationContainer>
  );
};

export default Route;
