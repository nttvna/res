import Home from './Screens/Home';
import Login from './Screens/Login';
import OrderDetail from './Screens/OrderDetail';
import Settings from './Screens/Settings';
import RestaurantInfo from './Screens/Settings/RestaurantInfo';
import Restaurant from './Screens/Restaurant';
import AppInfo from './Screens/AppInfo';
import { RootStackParamList } from './RootStackParams';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import CategoryType from './Screens/Settings/CategoryType';

import CreateTrans from './Screens/CreateTrans';
import SelectFoodOptions from './Screens/CreateTrans/SelectFoodOptions';
import { useHandleCrashMutation } from './Apis/restaurant';
import DeviceInfo from 'react-native-device-info';
import ErrorBoundary from 'react-native-error-boundary';
import FallbackError from './Components/FallbackError';
import Categories from './Screens/Settings/Categories';
import Reports from './Screens/Reports';
import ManagerLogin from './Screens/Settings/ManagerLogin';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppRoute() {
  const [handleCrash] = useHandleCrashMutation();

  const errorHandler = async (error: Error, stackTrace: string) => {
    let ipAddress: string = await DeviceInfo.getIpAddress();
    let apiLevel: number = await DeviceInfo.getApiLevel();
    handleCrash({
      Error: error + ' : ' + stackTrace,
      DeviceName: DeviceInfo.getDeviceId(),
      DeviceIp: ipAddress,
      ApiLevel: apiLevel + '',
    });
  };

  const CustomFallback = (props: { resetError: Function }) => (
    <FallbackError resetError={() => props.resetError()} />
  );

  return (
    <ErrorBoundary onError={errorHandler} FallbackComponent={CustomFallback}>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="OrderDetail" component={OrderDetail} />
        <Stack.Screen name="Settings" component={Settings} />
        <Stack.Screen name="RestaurantInfo" component={RestaurantInfo} />
        <Stack.Screen name="Restaurant" component={Restaurant} />
        <Stack.Screen name="AppInfo" component={AppInfo} />
        <Stack.Screen name="CreateTrans" component={CreateTrans} />
        <Stack.Screen name="SelectFoodOptions" component={SelectFoodOptions} />
        <Stack.Screen name="CategoryType" component={CategoryType} />
        <Stack.Screen name="Categories" component={Categories} />
        <Stack.Screen name="Reports" component={Reports} />
        <Stack.Screen name="ManagerLogin" component={ManagerLogin} />
      </Stack.Navigator>
    </ErrorBoundary>
  );
}
