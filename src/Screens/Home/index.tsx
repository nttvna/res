import {FlatList, ToastAndroid, View, TouchableOpacity} from 'react-native';
import {RootStackParamList} from '../../RootStackParams';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import Layout from '../../Layout';
import HeaderScreen from './Header';
import OrderItem from './OrderItem';
import {useLazyGetLastOrderQuery} from '../../Apis/orders';
import LoadingComponent from '../../Components/Loading';
import {useEffect, useState} from 'react';
import {useAppSelector, useAppDispatch} from '../../Redux/hooks';
import moment from 'moment';
import EmptyBasket from './EmptyBasket';
import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {initBasket} from '../../Redux/orderSlice';

type NavProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

const Home = ({route, navigation}: NavProps) => {
  const dispatch = useAppDispatch();
  const [selectedTab, changeTab] = useState<string>('UPCOMMING');
  const {restaurantTime, TimeZone, RestaurantId} = useAppSelector(
    state => state.Account,
  );
  const [getLastOrder, {isFetching, data}] = useLazyGetLastOrderQuery();

  useEffect(() => {
    LoadOrder(selectedTab);
  }, [route.params?.rand, selectedTab]);

  const LoadOrder = (selectedTab: string) => {
    getLastOrder({
      selectedDate: moment(restaurantTime).format('MM-DD-YYYY'),
      orderType: selectedTab,
    })
      .unwrap()
      .then(({Message}) => {
        if (Message !== 'Success')
          ToastAndroid.show(Message, ToastAndroid.SHORT);
      });
  };

  const renderCreateButton = () => {
    if (!isFetching) {
      return (
        <TouchableOpacity
          onPress={() => {
            dispatch(
              initBasket({
                RestaurantId,
                RestaurantTime: moment(restaurantTime).format('MM-DD-YYYY'),
              }),
            );
            navigation.navigate('CreateTrans', {rand: Math.random()});
          }}>
          <View
            style={{
              backgroundColor: 'green',
              position: 'absolute',
              right: 10,
              bottom: 10,
              padding: 10,
              borderRadius: 30,
            }}>
            <Icon name={'add-outline'} style={{color: '#fff'}} size={40} />
          </View>
        </TouchableOpacity>
      );
    } else return <></>;
  };

  return (
    <Layout screenName="Home">
      <HeaderScreen
        selectedTab={selectedTab}
        changeTab={val => {
          changeTab(val);
          LoadOrder(val);
        }}
      />
      <View
        style={{
          padding: 10,
          flex: 1,
          position: 'relative',
        }}>
        {isFetching ? (
          <LoadingComponent isHorizontal={true} />
        ) : (
          <FlatList
            data={data?.Data}
            renderItem={({item}) => (
              <View style={{flex: 1 / 5}} key={item.Id}>
                <OrderItem data={item} currentOrderId={route.params?.OrderId} />
              </View>
            )}
            keyExtractor={item => item.Id.toString()}
            numColumns={5}
            ListFooterComponent={<View style={{height: 80}} />}
            ListEmptyComponent={
              <EmptyBasket
                restaurantTime={restaurantTime}
                timeZone={TimeZone}
              />
            }
            onRefresh={() => {
              LoadOrder(selectedTab);
            }}
            refreshing={isFetching}
          />
        )}
        {renderCreateButton()}
      </View>
    </Layout>
  );
};

export default Home;
