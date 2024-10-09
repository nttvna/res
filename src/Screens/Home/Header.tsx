import {FC, useEffect, useState} from 'react';
import {
  Switch,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import {useAppSelector} from '../../Redux/hooks';
//import database from '@react-native-firebase/database';
import {
  useGetRestaurantInfoQuery,
  useLazyOpenRestaurantQuery,
} from '../../Apis/restaurant';
import Icon from 'react-native-vector-icons/Ionicons';

interface Props {
  selectedTab: string;
  changeTab: (selectedTab: string) => void;
}

const HeaderScreen: FC<Props> = ({changeTab, selectedTab}) => {
  const {RestaurantName, Email} = useAppSelector(state => state.Account);
  const [isOpen, setOpen] = useState(false);
  // const [isAutoAccept, setAutoAccept] = useState(false);
  // const toggleAccept = () => setAutoAccept(previousState => !previousState);

  const {data: restaurantInfo} = useGetRestaurantInfoQuery();
  const [openRestaurant] = useLazyOpenRestaurantQuery();

  const toggleOpen = () => {
    setOpen(previousState => !previousState);
    setTimeout(() => {
      //wait for state update completed.
      openRestaurant({isClose: !isOpen})
        .then(response => {
          if (response.data) {
            if (response.data.Message === 'Success') {
              ToastAndroid.show(
                !isOpen
                  ? 'This restaurant was opened'
                  : 'This restaurant was closed',
                ToastAndroid.SHORT,
              );
            } else {
              ToastAndroid.show(response.data.Message, ToastAndroid.SHORT);
            }
          }
        })
        .catch(err => {
          ToastAndroid.show('Email is required!', ToastAndroid.SHORT);
        });
    }, 200);
  };

  // useEffect(() => {
  //   if (RestaurantId > 0) {
  //     const restaurantRef = database().ref(`/restaurants/${RestaurantId}`);
  //     restaurantRef.on('value', function (snapshot) {
  //       setAutoAccept(snapshot.val().allowAccept === 'True');
  //     });
  //   }
  // }, [RestaurantId]);

  useEffect(() => {
    if (restaurantInfo) {
      setOpen(restaurantInfo.Data.IsOpen);
    }
  }, [restaurantInfo?.Data.IsOpen]);

  const renderOrderType = () => {
    return (
      <View
        style={{
          alignItems: 'center',
          flexDirection: 'row',
          height: 30,
          width: 300,
          borderWidth: 1,
          borderColor: 'green',
          borderRadius: 5,
          overflow: 'hidden',
        }}>
        <View style={{flex: 1 / 2}}>
          <TouchableOpacity onPress={() => changeTab('UPCOMMING')}>
            <View
              style={[
                s.tab,
                {
                  backgroundColor:
                    selectedTab === 'UPCOMMING' ? 'green' : 'white',
                },
              ]}>
              <Icon
                name={'megaphone-outline'}
                style={{
                  color: selectedTab === 'UPCOMMING' ? '#fff' : '#000',
                  fontSize: 15,
                  marginRight: 8,
                }}
              />
              <Text
                style={{
                  color: selectedTab === 'UPCOMMING' ? '#fff' : '#000',
                  fontSize: 13,
                }}>
                UPCOMMING
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={{flex: 1 / 2}}>
          <TouchableOpacity onPress={() => changeTab('PASTORDERS')}>
            <View
              style={[
                s.tab,
                {
                  backgroundColor:
                    selectedTab === 'PASTORDERS' ? 'green' : 'white',
                },
              ]}>
              <Icon
                name={'receipt-outline'}
                style={{
                  color: selectedTab === 'PASTORDERS' ? '#fff' : '#000',
                  fontSize: 15,
                  marginRight: 8,
                }}
              />
              <Text
                style={{
                  color: selectedTab === 'PASTORDERS' ? '#fff' : '#000',
                  fontSize: 13,
                }}>
                PAST ORDERS
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View
      style={{
        padding: 5,
        paddingLeft: 10,
        paddingRight: 10,
        flexDirection: 'row',
        paddingTop: 10,
      }}>
      <View style={{paddingLeft: 5}}>
        <Text style={{fontWeight: '500', fontSize: 20, color: 'green'}}>
          {RestaurantName}
        </Text>
        <Text style={{color: '#333'}}>{Email}</Text>
      </View>
      <View
        style={{
          flexGrow: 1,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {renderOrderType()}
      </View>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingRight: 10,
          }}>
          <Switch
            trackColor={{false: '#767577', true: 'green'}}
            thumbColor={isOpen ? '#f5dd4b' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleOpen}
            value={isOpen}
          />
          <Text style={{fontWeight: 'bold', color: 'green'}}>
            {'  '}OPEN RESTAURANT
          </Text>
        </View>
        {/* <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingRight: 5,
          }}>
          <Switch
            trackColor={{false: '#767577', true: '#81b0ff'}}
            thumbColor={isAutoAccept ? '#f5dd4b' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleAccept}
            value={isAutoAccept}
          />
          <Text>Auto Accept</Text>
        </View> */}
      </View>
    </View>
  );
};
export default HeaderScreen;

const s = StyleSheet.create({
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    height: '100%',
  },
});
