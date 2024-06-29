/**
 * @format
 */
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
import {navigate} from './src/APIS/pushNotification/NavigationService';
import navigationStrings from './src/Contstants/navigationStrings';

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
});
messaging()
  .getInitialNotification()
  .then(remoteMessage => {
    if (remoteMessage) {
      console.log('inside app quit state', remoteMessage.notification);
      console.log('hello');
      navigate(navigationStrings.LOGIN);
    }
  });
AppRegistry.registerComponent(appName, () => App);
