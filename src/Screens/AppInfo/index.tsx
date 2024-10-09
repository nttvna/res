import Layout from '../../Layout';
import HeaderGoBack from '../../Components/HeaderGoBack';
import {
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import {useEffect, useState} from 'react';
import {RootStackParamList} from '../../RootStackParams';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import DeviceInfo from 'react-native-device-info';
import Badge from '../../Components/Badge';
import {baseUrl} from '../../const';
import Notifee from '@notifee/react-native';
import Icon from 'react-native-vector-icons/Ionicons';

type NavProps = NativeStackScreenProps<RootStackParamList, 'AppInfo'>;

const AppInfo = ({route, navigation}: NavProps) => {
  const [deviceIpAddress, setDeviceIpAddress] = useState<string>('');
  const [apiLevel, setApiLevel] = useState<number>(0);
  const [deviceId, setDeviceId] = useState<string>('');
  const [isOptimize, setOptimize] = useState<boolean>(false);

  useEffect(() => {
    DeviceInfo.getIpAddress().then(val => {
      setDeviceIpAddress(val);
    });
    DeviceInfo.getApiLevel().then(val => {
      setApiLevel(val);
    });
    DeviceInfo.getAndroidId().then(val => {
      setDeviceId(val);
    });
  }, []);

  useEffect(() => {
    Notifee.isBatteryOptimizationEnabled().then(response => {
      setOptimize(response);
    });
  }, []);

  const renderAppInfo = () => {
    return (
      <>
        <View style={s.wr}>
          <View style={s.wrLeft}>
            <Text>Device Info:</Text>
          </View>
          <View style={s.wrRight}>
            <Text style={{color: '#000'}}>
              {DeviceInfo.getBrand()} - {DeviceInfo.getDeviceId()}
            </Text>
          </View>
        </View>
        <View style={s.wr}>
          <View style={s.wrLeft}>
            <Text>Ip Address:</Text>
          </View>
          <View style={s.wrRight}>
            <Text style={{color: '#000'}}>{deviceIpAddress}</Text>
          </View>
        </View>
        <View style={s.wr}>
          <View style={s.wrLeft}>
            <Text>Device ID:</Text>
          </View>
          <View style={s.wrRight}>
            <Text style={{color: '#000'}}>{deviceId}</Text>
          </View>
        </View>
        <View style={s.wr}>
          <View style={s.wrLeft}>
            <Text>Api Level:</Text>
          </View>
          <View style={s.wrRight}>
            <Text style={{color: '#000'}}>{apiLevel}</Text>
          </View>
        </View>
        <View style={s.wr}>
          <View style={s.wrLeft}>
            <Text>Api Version:</Text>
          </View>
          <View style={[s.wrRight, {flexDirection: 'row'}]}>
            <Text style={{color: '#000'}}>
              {DeviceInfo.getVersion()}
              {'  '}
            </Text>
            {baseUrl === 'https://res.ringameal.com' ? (
              <Badge text="Production" color="green" />
            ) : (
              <Badge text="Development" color="#f60" />
            )}
          </View>
        </View>
      </>
    );
  };

  const renderSetting = () => {
    return (
      <View style={{marginTop: 20}}>
        <View>
          <Text style={{color: '#333'}}>
            Battery optimization settings "ON" can affect apps behave in the
            background, including not receive new order notifications.
          </Text>
        </View>
        <View style={{marginTop: 30, alignItems: 'flex-end'}}>
          <TouchableOpacity onPress={openBatteryOptimization}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Icon
                name={'arrow-forward-outline'}
                style={{color: '#000', fontSize: 25, marginRight: 8}}
              />
              <Text style={{color: '#000'}}>GO SETTING</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const openBatteryOptimization = async () => {
    try {
      await Notifee.openBatteryOptimizationSettings();
    } catch (error) {
      ToastAndroid.show(
        'Failed to open battery optimization settings!',
        ToastAndroid.SHORT,
      );
    }
  };

  return (
    <Layout screenName="AppInfo">
      <HeaderGoBack name="Blue Jay Restaurant" showBackButton={true} />
      <View
        style={{
          padding: 15,
          paddingTop: 0,
          flexDirection: 'row',
        }}>
        <View
          style={{
            backgroundColor: '#fff',
            padding: 10,
            paddingLeft: 20,
            paddingRight: 20,
            borderRadius: 5,
            borderColor: '#e5e5e5',
            borderWidth: 1,
            flex: 3 / 5,
          }}>
          {renderAppInfo()}
        </View>
        <View
          style={{
            backgroundColor: '#fff',
            padding: 10,
            paddingLeft: 20,
            paddingRight: 20,
            borderRadius: 5,
            borderColor: '#e5e5e5',
            borderWidth: 1,
            flex: 2 / 5,
            marginLeft: 20,
          }}>
          <View style={s.wr}>
            <View style={s.wrLeft}>
              <Text>Battery Optimization:</Text>
            </View>
            <View style={s.wrRight}>
              <View style={{flexDirection: 'row'}}>
                {isOptimize ? (
                  <Text style={{color: 'green', fontWeight: 'bold'}}>ON</Text>
                ) : (
                  <Text style={{color: '#51b3e0', fontWeight: 'bold'}}>
                    OFF
                  </Text>
                )}
              </View>
            </View>
          </View>
          {renderSetting()}
        </View>
      </View>
    </Layout>
  );
};

export default AppInfo;

const s = StyleSheet.create({
  wr: {
    flexDirection: 'row',
    borderBottomColor: '#f8f8f8',
    borderBottomWidth: 1,
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
  },
  wrLeft: {
    width: 150,
  },
  wrRight: {
    flexGrow: 1,
  },
});
