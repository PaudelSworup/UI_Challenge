import React from 'react';
import {Register, Login, Home} from '../Screens/index';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import navigationStrings from '../Contstants/navigationStrings';
import LaunchScreen from '../Screens/Launch/LaunchScreen';
import Main from '../Screens/Main/Main';
import Movies from '../Screens/Movies/Movies';
import MovieDetail from '../Screens/Movies/MovieDetail';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator
      initialRouteName={navigationStrings.MOVIE}
      screenOptions={{headerShown: false}}>
      <Stack.Screen name={navigationStrings.REGISTER} component={Register} />
      <Stack.Screen name={navigationStrings.LOGIN} component={Login} />
      <Stack.Screen name={navigationStrings.HOME} component={Home} />
      <Stack.Screen name={navigationStrings.Launch} component={LaunchScreen} />
      <Stack.Screen name={navigationStrings.MAIN} component={Main} />
      <Stack.Screen name={navigationStrings.MOVIE} component={Movies} />
      <Stack.Screen name={navigationStrings.DETAIL} component={MovieDetail} />
    </Stack.Navigator>
  );
};

export default AuthStack;
