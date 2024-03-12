import {View, Text, Image} from 'react-native';

const LaunchScreen = () => {
  return (
    <View className="flex-1 justify-center items-center">
      <Image
        source={require('../../../asset/offline.png')}
        style={{width: 50, height: 50, borderRadius: 50}}
      />
      <Text>You're offline</Text>
    </View>
  );
};

export default LaunchScreen;
