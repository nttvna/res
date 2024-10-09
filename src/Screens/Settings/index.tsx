import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../RootStackParams';
import Layout from '../../Layout';
import HeaderGoBack from '../../Components/HeaderGoBack';
import {
  Keyboard,
  Switch,
  Text,
  TextInput,
  ToastAndroid,
  View,
} from 'react-native';
import LoadingComponent from '../../Components/Loading';
import SettingMenu from './SettingMenu';
import IconButton from '../../Components/IconButton';
import {useEffect, useState} from 'react';
import Database from '../../Database';
const db = new Database();

type NavProps = NativeStackScreenProps<RootStackParamList, 'Settings'>;

const Settings = ({route, navigation}: NavProps) => {
  const [isTcp, setTcp] = useState(true);
  const [isShowIpAddress, showIpAddress] = useState(false);
  const [ipAddress, setIpAddress] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [isAutoPrint, setAutoPrint] = useState(false);
  const toggleSwitch = () => {
    const newStatus = !isAutoPrint;
    setAutoPrint(newStatus);
    db.settingRestaurant(newStatus ? 'True' : 'False')
      .then(() => {
        ToastAndroid.show(
          `Setting auto print successfully.`,
          ToastAndroid.SHORT,
        );
      })
      .catch(err => {
        ToastAndroid.show(err, ToastAndroid.SHORT);
      });
  };

  useEffect(() => {
    setLoading(true);
    db.getPrintSettingFromLocalDb()
      .then(response => {
        const {PrintMode, IpAddress} = response;
        setTcp(PrintMode === 'tcp');
        showIpAddress(PrintMode === 'tcp');
        setIpAddress(IpAddress);
      })
      .finally(() => {
        setLoading(false);
      });

    db.getRestaurantSettingFromLocalDb().then(response => {
      const {AutoPrint} = response;
      setAutoPrint(AutoPrint === 'True');
    });
  }, []);

  const changeConnectionType = (isTcp: boolean) => {
    setTcp(isTcp);
  };

  const SaveBlueTooth = () => {
    showIpAddress(false);
    changeConnectionType(false);
    db.settingPrint('bluetooth', ipAddress);
    ToastAndroid.show(`Change print setting successfully.`, ToastAndroid.SHORT);
  };

  const SaveTcp = () => {
    showIpAddress(true);
    if (!ipAddress) {
      ToastAndroid.show(`Please enter IP Address.`, ToastAndroid.SHORT);
      return;
    }

    Keyboard.dismiss();

    changeConnectionType(true);
    db.settingPrint('tcp', ipAddress);
    ToastAndroid.show(`Change print setting successfully.`, ToastAndroid.SHORT);
  };

  return (
    <Layout screenName="Settings">
      <HeaderGoBack name="Settings" showBackButton={true} />
      <View
        style={{
          padding: 15,
          paddingTop: 0,
          flexDirection: 'row',
          flex: 1,
        }}>
        <View
          style={{
            flexGrow: 1,
            backgroundColor: '#fff',
            padding: 10,
            paddingLeft: 20,
            paddingRight: 20,
            borderRadius: 5,
            borderColor: '#e5e5e5',
            borderWidth: 1,
            flexDirection: 'row',
          }}>
          <View
            style={{
              width: 180,
              borderRightColor: '#e5e5e5',
              borderRightWidth: 1,
              paddingRight: 15,
            }}>
            <SettingMenu currentScreen="Print" />
          </View>
          {isLoading ? (
            <LoadingComponent isHorizontal={false} />
          ) : (
            <View style={{flexGrow: 1, padding: 10, paddingLeft: 20}}>
              <View>
                <Text style={{color: '#000', fontSize: 16}}>
                  Choose a print connection type?
                </Text>
              </View>
              <View
                style={{flexDirection: 'row', marginTop: 20, marginBottom: 20}}>
                <View>
                  <IconButton
                    text="Bluetooth   "
                    leftIcon="bluetooth-outline"
                    onPress={SaveBlueTooth}
                    bgColor={!isTcp ? '#22c55e' : '#888'}
                    isLoading={false}
                  />
                </View>
                <View style={{marginLeft: 20}}>
                  <IconButton
                    text="TCP/IP Port   "
                    leftIcon="wifi-outline"
                    onPress={SaveTcp}
                    bgColor={isTcp ? '#22c55e' : '#888'}
                    isLoading={false}
                  />
                </View>
              </View>
              {isShowIpAddress && (
                <View style={{flexDirection: 'row'}}>
                  <TextInput
                    onChangeText={val => setIpAddress(val)}
                    value={ipAddress}
                    placeholder={'Ip Address...'}
                    keyboardType={'numeric'}
                    style={{
                      borderWidth: 1,
                      borderColor: '#e5e5e5',
                      backgroundColor: '#fff',
                      paddingLeft: 15,
                      borderRadius: 5,
                      flexGrow: 1,
                      marginRight: 10,
                    }}
                  />
                  <IconButton
                    text="Save Ip Address"
                    leftIcon="save-outline"
                    onPress={SaveTcp}
                    bgColor={'#3791f3'}
                    isLoading={false}
                  />
                </View>
              )}
              <View style={{marginTop: 40}}>
                <View>
                  <Text style={{color: '#000', fontWeight: 'bold'}}>
                    {' '}
                    AUTO PRINT
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    marginTop: 10,
                  }}>
                  <Switch
                    trackColor={{false: '#767577', true: '#81b0ff'}}
                    thumbColor={isAutoPrint ? '#f5dd4b' : '#f4f3f4'}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={toggleSwitch}
                    value={isAutoPrint}
                  />
                  <Text style={{color: '#333'}}>
                    Alway print a ticket when order accepted.
                  </Text>
                </View>
              </View>
            </View>
          )}
        </View>
      </View>
    </Layout>
  );
};

export default Settings;
