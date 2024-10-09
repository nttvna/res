import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../RootStackParams';
import Layout from '../../Layout';
import HeaderGoBack from '../../Components/HeaderGoBack';
import {Text, StyleSheet, View, TouchableOpacity} from 'react-native';
import LoadingComponent from '../../Components/Loading';
import SettingMenu from './SettingMenu';
import {useGetRestaurantInfoQuery} from '../../Apis/restaurant';
import {formatPhoneNumber} from '../../common';
import Badge from '../../Components/Badge';
import {useAppSelector} from '../../Redux/hooks';
import moment from 'moment';
import Icon from 'react-native-vector-icons/Ionicons';

type NavProps = NativeStackScreenProps<RootStackParamList, 'RestaurantInfo'>;

const RestaurantInfo = ({route, navigation}: NavProps) => {
  const {data, isLoading} = useGetRestaurantInfoQuery();
  const {restaurantTime, TimeZone} = useAppSelector(state => state.Account);

  const renderTags = (tags: string) => {
    if (tags) {
      let arrTags: string[] = tags.split(',');
      return arrTags.map((el, index) => {
        return (
          <View style={{marginRight: 5}} key={index}>
            <Badge text={el} color="green" />
          </View>
        );
      });
    } else return <></>;
  };

  const renderRestaurantInfo = () => {
    if (data) {
      const {Data} = data;
      return (
        <>
          <View style={s.wr}>
            <View style={s.wrLeft}>
              <Text>Name:</Text>
            </View>
            <View
              style={[
                s.wrRight,
                {
                  flexDirection: 'row',
                  alignItems: 'center',
                  display: 'flex',
                  flex: 1,
                },
              ]}>
              <View style={{display: 'flex', flexGrow: 1}}>
                <Text style={{color: 'green', fontSize: 18}}>{Data.Name}</Text>
              </View>
              <TouchableOpacity
                onPress={() => navigation.navigate('Restaurant')}>
                <View
                  style={{
                    padding: 5,
                    paddingLeft: 10,
                    paddingRight: 10,
                    borderRadius: 5,
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: '#e5e5e5',
                  }}>
                  <Icon
                    name={'create-outline'}
                    style={{color: '#000', marginRight: 5}}
                    size={20}
                  />
                  <Text style={{color: '#000'}}>Edit</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <View style={s.wr}>
            <View style={s.wrLeft}>
              <Text>Address:</Text>
            </View>
            <View style={s.wrRight}>
              <Text style={{color: '#000'}}>{Data.Street}</Text>
            </View>
          </View>
          <View style={s.wr}>
            <View style={s.wrLeft}>
              <Text>Tags:</Text>
            </View>
            <View style={[s.wrRight, {flexDirection: 'row'}]}>
              {renderTags(Data.Tags)}
            </View>
          </View>
          <View style={s.wr}>
            <View style={s.wrLeft}>
              <Text>Email:</Text>
            </View>
            <View style={s.wrRight}>
              <Text style={{color: '#000'}}>{Data.Email}</Text>
            </View>
          </View>
          <View style={s.wr}>
            <View style={s.wrLeft}>
              <Text>Phone:</Text>
            </View>
            <View style={s.wrRight}>
              <Text style={{color: '#000'}}>
                {formatPhoneNumber(Data.Phone)}
              </Text>
            </View>
          </View>
          <View style={s.wr}>
            <View style={s.wrLeft}>
              <Text>Fax:</Text>
            </View>
            <View style={s.wrRight}>
              <Text style={{color: '#000'}}>{formatPhoneNumber(Data.Fax)}</Text>
            </View>
          </View>
          <View style={s.wr}>
            <View style={s.wrLeft}>
              <Text>Time Zone:</Text>
            </View>
            <View style={s.wrRight}>
              <Text style={{color: '#000'}}>
                {moment(restaurantTime).format('MM/DD/YYYY HH:mm')}
                {'  '}|{'  '}
                {Data.TimeZone}
              </Text>
            </View>
          </View>
        </>
      );
    }
    return <></>;
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
            <SettingMenu currentScreen="Info" />
          </View>

          <View
            style={{
              paddingLeft: 15,
              paddingRight: 15,
              paddingTop: 5,
              flex: 1,
            }}>
            {isLoading ? (
              <LoadingComponent isHorizontal={false} />
            ) : (
              renderRestaurantInfo()
            )}
          </View>
        </View>
      </View>
    </Layout>
  );
};

export default RestaurantInfo;

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
