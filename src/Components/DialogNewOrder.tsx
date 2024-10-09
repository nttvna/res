import {useEffect, useState} from 'react';
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
  ScrollView,
} from 'react-native';
import IconButton from './IconButton';
import database from '@react-native-firebase/database';
import {useAppSelector} from '../Redux/hooks';
import Icon from 'react-native-vector-icons/Ionicons';
import {formatPhoneNumber} from '../common';
import {
  useLazyGetOrderItemsQuery,
  useLazyGetOrderDetailByCodeQuery,
  useLazyChangeOrderStatusQuery,
} from '../Apis/orders';

import Sound from 'react-native-sound';
import {Extra} from '../Models/order';
import {useNavigation} from '@react-navigation/native';
import {printReceipt} from '../Prints/PrintFunction';

import Database from '../Database';
const db = new Database();

Sound.setCategory('Playback');
var ding = new Sound('neworder.mp3', Sound.MAIN_BUNDLE, error => {
  if (error) {
    console.log('failed to load the sound', error);
    return;
  }
});

const DialogNewOrder = ({screenName}: {screenName: string}) => {
  const navigation = useNavigation<any>();
  const {RestaurantId} = useAppSelector(state => state.Account);
  const [modalVisible, setModalVisible] = useState(false);
  const [orderData, setOrderData] = useState<any>(null);
  const [orderCode, setOrderCode] = useState<string>('');

  const [changeOrderStatus] = useLazyChangeOrderStatusQuery();

  const [getOrderItems, {data}] = useLazyGetOrderItemsQuery();

  const [getOrderDetailByCode] = useLazyGetOrderDetailByCodeQuery();

  useEffect(() => {
    //handle new order comming
    const onChildAdd = database()
      .ref('/orders')
      .orderByChild('orderstatus')
      .equalTo('NEW')
      .on('child_added', snapshot => {
        const noteValue = snapshot.val();
        if (
          noteValue.restaurantId === RestaurantId.toString() &&
          noteValue.orderstatus === 'NEW'
        ) {
          if (modalVisible == false) {
            setModalVisible(true);
            playSoundNotifiaction();
          }

          setOrderData(noteValue);
          setOrderCode(snapshot.key ? snapshot.key : '');
          if (snapshot.key) {
            getOrderItems({orderCode: snapshot.key});
          }
        }
      });

    // Stop listening for updates when no longer required
    return () => database().ref('/orders').off('child_added', onChildAdd);
  }, []);

  useEffect(() => {
    if (orderCode) {
      //hiden dialog if order change status
      const onOrderChange = database()
        .ref(`/orders/${orderCode}/orderstatus`)
        .on('value', function (snapshot) {
          if (snapshot && snapshot.val()) {
            if (snapshot.val() !== 'NEW') {
              ding.stop();
              setModalVisible(false);
              setOrderData(null);
              setOrderCode('');
            }
          }
        });

      //stop listerning when no longer required.
      return () =>
        database()
          .ref(`/orders/${orderCode}/orderstatus`)
          .off('value', onOrderChange);
    }
  }, [orderCode]);

  const playSoundNotifiaction = () => {
    ding.setVolume(1);
    ding.setNumberOfLoops(-1);
    ding.stop(() => {
      ding.play(success => {
        if (success) {
          ding.release();
          console.log(`Successfully finished playing sound`);
        } else {
          console.log('Playback failed');
          ding.reset();
        }
      });
    });
  };

  const renderFoodExtra = (extra: Extra[]) => {
    if (extra && extra.length > 0) {
      return extra.map(el => {
        return (
          <Text key={el.Id}>
            {el.Name} (x{el.Quantity}),{' '}
          </Text>
        );
      });
    } else return <></>;
  };

  const renderOrderDetail = () => {
    if (data?.Message === 'Success') {
      return (
        <>
          <View style={{marginTop: 15, marginBottom: 15}}>
            <Text style={{color: '#f60'}}>ORDER DETAIL</Text>
          </View>
          <View>
            {data.Data?.map((el, index) => {
              return (
                <View
                  key={index}
                  style={{
                    flexDirection: 'row',
                    borderTopWidth: 1,
                    borderTopColor: '#e5e5e5',
                    padding: 8,
                    alignItems: 'center',
                  }}>
                  <View style={{flexGrow: 1}}>
                    <View>
                      <Text style={{fontWeight: 'bold', color: '#000'}}>
                        {el.FoodName}
                      </Text>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                      {renderFoodExtra(el.Extras)}
                    </View>
                  </View>
                  <View style={{paddingLeft: 10}}>
                    <Text style={{color: '#000'}}>x {el.Quanlity}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </>
      );
    } else return <></>;
  };

  const closeNotificationDialog = (orderStatus: 'CANCEL' | 'PREPARE') => {
    ding.stop();
    setModalVisible(false);
    changeOrderStatus({
      orderCode: orderCode,
      orderStatus: orderStatus,
    })
      .then(response => {
        if (response.data?.Message === 'Success') {
          //update order status to Firebase
          database().ref(`/orders/${orderCode}`).update({
            orderstatus: orderStatus,
          });

          if (orderStatus === 'PREPARE') {
            doPrintReceiptWhenAcceptOrder();
          }

          //only reload if you are on the Home Screen.
          if (screenName === 'Home') {
            navigation.navigate('Home', {rand: Math.random()});
          }
        }
      })
      .catch(err => {
        ToastAndroid.show('An error occurred.', ToastAndroid.SHORT);
      });
  };

  const doPrintReceiptWhenAcceptOrder = () => {
    db.getRestaurantSettingFromLocalDb().then(response => {
      const {AutoPrint} = response;
      if (AutoPrint === 'True') {
        getOrderDetailByCode({orderCode}).then(response => {
          if (response.data) {
            const {Message, OrderDetail} = response.data;
            if (Message === 'Success') {
              printReceipt(OrderDetail);
            }
          }
        });
      }
    });
  };

  if (modalVisible) {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={true}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View
              style={{
                borderBottomColor: '#e5e5e5',
                borderBottomWidth: 1,
                paddingBottom: 10,
                marginBottom: 10,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Icon
                name={'volume-high-outline'}
                style={{color: '#000', fontSize: 25, marginRight: 8}}
              />
              <Text style={{color: '#000', fontWeight: 'bold'}}>NEW ORDER</Text>
            </View>
            <ScrollView>
              <View style={styles.row}>
                <View style={styles.rowLeft}>
                  <Text style={{color: '#333'}}>Order Code:</Text>
                </View>
                <View style={styles.rowRight}>
                  <Text style={{color: '#000'}}>{orderCode}</Text>
                </View>
              </View>
              <View style={styles.row}>
                <View style={styles.rowLeft}>
                  <Text style={{color: '#333'}}>Order Type:</Text>
                </View>
                <View
                  style={[
                    styles.rowRight,
                    {flexDirection: 'row', alignItems: 'center'},
                  ]}>
                  <View>
                    <Text style={{color: '#000', fontWeight: 'bold'}}>
                      {orderData?.orderType === 'DL' ? 'DELIVERY' : 'PICKUP'}
                    </Text>
                  </View>
                  {orderData?.orderType === 'DL' && (
                    <View style={{paddingLeft: 10}}>
                      <Text style={{color: '#333'}}>
                        {' -   '}Delivery Time: {orderData?.deliveryTime}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
              <View style={styles.row}>
                <View style={styles.rowLeft}>
                  <Text style={{color: '#333'}}>Customer:</Text>
                </View>
                <View style={styles.rowRight}>
                  <Text style={{color: '#000'}}>
                    {orderData?.customername} {'  -   '}
                    {formatPhoneNumber(orderData?.customerphone)}
                  </Text>
                </View>
              </View>
              {orderData?.orderType === 'DL' && (
                <View style={styles.row}>
                  <View style={styles.rowLeft}>
                    <Text style={{color: '#333'}}>Address:</Text>
                  </View>
                  <View style={styles.rowRight}>
                    <Text style={{color: '#000'}}>
                      {orderData?.customeraddress}
                    </Text>
                  </View>
                </View>
              )}
              {renderOrderDetail()}
            </ScrollView>

            <View
              style={{
                paddingTop: 20,
                marginTop: 10,
                flexDirection: 'row',
                justifyContent: 'flex-end',
              }}>
              <View style={{marginRight: 30}}>
                <IconButton
                  text="CANCEL"
                  leftIcon="close-outline"
                  onPress={() => closeNotificationDialog('CANCEL')}
                  bgColor="#888"
                  isLoading={false}
                />
              </View>

              <IconButton
                text="ACCEPT   "
                leftIcon="checkmark-outline"
                onPress={() => closeNotificationDialog('PREPARE')}
                bgColor="#22c55e"
                isLoading={false}
              />
            </View>
          </View>
        </View>
      </Modal>
    );
  } else return <></>;
};
export default DialogNewOrder;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    backgroundColor: '#ffffdd',
    borderRadius: 5,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '50%',
  },
  row: {
    flexDirection: 'row',
    paddingTop: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
    alignItems: 'center',
  },
  rowLeft: {
    width: 150,
  },
  rowRight: {
    flexGrow: 1,
  },
});
