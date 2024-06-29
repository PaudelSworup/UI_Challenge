import {View, Text} from 'react-native';
import React, {useEffect} from 'react';
import Route from './src/Navigation/Route';
import {QueryClient, QueryClientProvider} from 'react-query';
import {
  requestUserPermission,
  notificationListner,
} from './src/APIS/pushNotification/notification';

const queryClient = new QueryClient();
const App = () => {
  useEffect(() => {
    requestUserPermission();
    notificationListner();
  }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <Route />
    </QueryClientProvider>
  );
};

export default App;
