import { Text, View, Image, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LeftMenu from './Components/LeftMenu';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from './Redux/hooks';
import { userLogOut } from './Redux/accountSlice';
import { useEffect } from 'react';
import * as Keychain from 'react-native-keychain';
import DialogNewOrder from './Components/DialogNewOrder';

const Layout = ({
  children,
  screenName,
}: {
  children: React.ReactNode;
  screenName: string;
}) => {
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();

  const { UserId } = useAppSelector(state => state.Account);

  useEffect(() => {
    if (UserId === 0) navigation.navigate('Login');
  }, [UserId]);

  const renderSignOutConfirmDialog = () =>
    Alert.alert('Confirmation', 'Are you sure you want to logout', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () => {
          dispatch(userLogOut());
          Keychain.resetGenericPassword();
          navigation.navigate('Login', { rand: Math.random() });
        },
      },
    ]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flexDirection: 'row', flex: 1 }}>
        <View
          style={{
            width: 70,
            backgroundColor: '#fff',
            padding: 5,
            borderRightWidth: 1,
            borderRightColor: '#e5e5e5',
          }}>
          <View style={{ paddingBottom: 20, alignItems: 'center' }}>
            <TouchableOpacity onPress={() => navigation.navigate('AppInfo')}>
              <Image
                source={require('./Assets/res_logo.png')}
                style={{ width: 55, height: 55 }}
              />
            </TouchableOpacity>
          </View>
          <View style={{ flexGrow: 1 }}>
            <LeftMenu />
          </View>
          <View style={{ paddingBottom: 10 }}>
            <TouchableOpacity onPress={renderSignOutConfirmDialog}>
              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Icon
                  name={'log-out-outline'}
                  style={{ color: 'red' }}
                  size={23}
                />
                <Text numberOfLines={1} style={{ color: 'red', fontSize: 12 }}>
                  Sign Out
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ flexGrow: 1 }}>{children}</View>
      </View>
      <DialogNewOrder screenName={screenName} />
    </SafeAreaView>
  );
};
export default Layout;
