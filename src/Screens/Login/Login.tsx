import React, {useEffect, useState} from 'react';

import SignIn from '../../Components/Login/SignIn';
import {BASE_URL} from '../../../config';
import NetInfo from '@react-native-community/netinfo';
import {Alert} from 'react-native';
import LaunchScreen from '../Launch/LaunchScreen';

const Login = () => {
  const [isConnected, setConnected] = useState<any>(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setConnected(state.isConnected);
      if (!state.isConnected) {
        showAlert();
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const showAlert = () => {
    Alert.alert(
      'Internet Connection',
      'You are offline. Some features may not be available.',
    );
  };
  return isConnected ? <SignIn /> : <LaunchScreen />;
};

export default Login;
