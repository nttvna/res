import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppRoute from './src/AppRoute';
import { Provider } from 'react-redux';
import store from './src/Redux/store';
import Database from './src/Database';
import SignalrProvider from './src/SignalrProvider';
import Toast from 'react-native-toast-message';

function App() {
  React.useEffect(() => {
    new Database().initAppDatabase();
  }, []);

  return (
    <Provider store={store}>
      <NavigationContainer>
        <SignalrProvider>
          <AppRoute />
        </SignalrProvider>
      </NavigationContainer>
      <Toast />
    </Provider>
  );
}

export default App;
