import {View, Text, SafeAreaView} from 'react-native';
import React, {useEffect} from 'react';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {Button} from 'react-native-paper';
import {ParamListBase, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import navigationStrings from '../../Contstants/navigationStrings';

const Home = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  useEffect(() => {
    const getCUrrentUser = async () => {
      try {
        const userInfo = await GoogleSignin.signInSilently();
        console.log('current user__', userInfo);
      } catch (err: any) {
        if (err.code === statusCodes.SIGN_IN_REQUIRED) {
          console.log('sign in required');
        } else console.log('something went wrong');
      }
    };

    getCUrrentUser();
  }, []);

  const signOut = async () => {
    console.log('ehllo');
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      navigation.replace(navigationStrings.LOGIN);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <SafeAreaView className="h-screen">
      <View className="justify-center flex-1  items-center">
        <Button className="bg-cyan-700 " onPress={signOut}>
          <Text className="text-white text-base tracking-widest">Log out</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default Home;
