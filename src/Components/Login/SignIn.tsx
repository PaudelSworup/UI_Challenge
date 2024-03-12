import {View, Text, Image, SafeAreaView} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Button, Divider, TextInput} from 'react-native-paper';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import navigationStrings from '../../Contstants/navigationStrings';
import {ParamListBase, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Path, Svg} from 'react-native-svg';
import {CLIENT_ID} from '../../../config';

const SignIn = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  useEffect(() => {
    GoogleSignin.configure({
      scopes: ['profile'],
      webClientId: CLIENT_ID,
      forceCodeForRefreshToken: true,
    });
  }, []);

  const login = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log('userInfos___', userInfo);
      navigation.replace(navigationStrings.HOME);
    } catch (err: any) {
      console.log(err.message);
      if (err.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('user cancel the login process');
      } else if (err.cde === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('play service not available');
      }
    }
  };

  // const isSignedIn = async () => {
  //   const isSignedIn = await GoogleSignin.isSignedIn();
  //   if (!!isSignedIn) {
  //     getCUrrentUser();
  //   } else console.log('login to get user');
  // };

  // const getCUrrentUser = async () => {
  //   try {
  //     const userInfo = await GoogleSignin.signInSilently();
  //     console.log('current user__', userInfo);
  //   } catch (err: any) {
  //     if (err.code === statusCodes.SIGN_IN_REQUIRED) {
  //       console.log('sign in required');
  //     } else console.log('something went wrong');
  //   }
  // };

  return (
    <SafeAreaView className="bg-white">
      <View className="h-[100vh]">
        <View className="h-16 bg-[#2471A3]">
          <Svg
            height={200}
            // width={Dimensions.get('screen').width}
            viewBox="0 0 1400 320">
            <Path
              opacity="1"
              fill="#2471A3"
              d="M0,32L60,64C120,96,240,160,360,165.3C480,171,600,117,720,101.3C840,85,960,107,1080,149.3C1200,192,1320,256,1380,288L1440,320L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"
            />
          </Svg>
        </View>
        <View className="flex-1 space-y-3 justify-center mx-5">
          <View className="justify-center items-center mt-8">
            <Image
              source={{
                uri: 'https://i.pinimg.com/564x/7b/01/44/7b0144b59c26bf18b525383292201446.jpg',
              }}
              style={{
                width: 80,
                height: 80,
                borderRadius: 50,
              }}
            />
          </View>
          <View className="space-y-3">
            <TextInput
              className="bg-white px-2 rounded-full"
              mode="outlined"
              outlineColor="black"
              activeOutlineColor="black"
              placeholder="email"
              outlineStyle={{borderRadius: 50}}
              textColor="#222"
              label="email"
            />
            <TextInput
              className="bg-white px-2"
              mode="outlined"
              outlineColor="black"
              activeOutlineColor="black"
              placeholder="password"
              outlineStyle={{borderRadius: 50}}
              secureTextEntry
              label="password"
            />
            <Button
              className="bg-cyan-700"
              style={{
                elevation: 6,
                shadowRadius: 15,
                shadowOffset: {width: 1, height: 13},
              }}>
              <Text className="text-white text-base tracking-widest">
                Log in
              </Text>
            </Button>
          </View>

          <Divider />

          <View className="justify-center items-center">
            <GoogleSigninButton
              size={GoogleSigninButton.Size.Standard}
              color={GoogleSigninButton.Color.Dark}
              onPress={login}
            />
          </View>

          <Text className="text-center text-base justify-center items-center">
            Don't have an account?
            <Text className="text-base text-sky-700">Signup</Text>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SignIn;
