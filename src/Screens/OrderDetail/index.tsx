import {
  Text,
  StyleSheet,
  View,
  ScrollView,
  FlatList,
  ToastAndroid,
  Alert,
} from 'react-native';
import {RootStackParamList} from '../../RootStackParams';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import Layout from '../../Layout';
import {
  useGetOrderDetailQuery,
  useLazyChangeOrderStatusQuery,
} from '../../Apis/orders';
import HeaderGoBack from '../../Components/HeaderGoBack';
import IconButton from '../../Components/IconButton';
import LoadingComponent from '../../Components/Loading';
import Badge from '../../Components/Badge';
import {formatMoney, formatPhoneNumber, getStatusColor} from '../../common';
import FoodItem from './FoodItem';
import database from '@react-native-firebase/database';
import {useEffect, useState} from 'react';
import {printReceipt} from '../../Prints/PrintFunction';

type NavProps = NativeStackScreenProps<RootStackParamList, 'OrderDetail'>;

const OrderDetail = ({route, navigation}: NavProps) => {
  const [realtimeStatus, setRealtimeStatus] = useState('');

  const {data, isLoading} = useGetOrderDetailQuery({
    orderId: route.params.OrderId,
  });

  const [changeOrderStatus] = useLazyChangeOrderStatusQuery();

  useEffect(() => {
    if (data?.OrderDetail) {
      setRealtimeStatus(data.OrderDetail.OrderStatus);

      const onOrderChange = database()
        .ref(`/orders/${data.OrderDetail.OrderCode}/orderstatus`)
        .on('value', function (snapshot) {
          if (snapshot && snapshot.val()) {
            setRealtimeStatus(snapshot.val());
          }
        });

      //stop listerning when no longer required.
      return () =>
        database()
          .ref(`/orders/${data.OrderDetail.OrderCode}/orderstatus`)
          .off('value', onOrderChange);
    }
  }, [data?.OrderDetail]);

  const changeStatus = (status: string) => {
    if (data?.OrderDetail) {
      changeOrderStatus({
        orderCode: data.OrderDetail.OrderCode,
        orderStatus: status,
      })
        .then(response => {
          if (response.data?.Message === 'Success') {
            //update order status to Firebase
            database().ref(`/orders/${data.OrderDetail.OrderCode}`).update({
              orderstatus: status,
            });
            //update order status to Firebase
            ToastAndroid.show(
              'Update ticket successfully.',
              ToastAndroid.SHORT,
            );
            navigation.navigate('Home', {rand: Math.random()});
          }
        })
        .catch(err => {
          ToastAndroid.show('An error occurred.', ToastAndroid.SHORT);
        });
    }
  };

  const renderCancelConfirmDialog = () =>
    Alert.alert('Confirmation', 'Are you sure you want cancel this ticket?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () => {
          changeStatus('CANCEL');
        },
      },
    ]);

  const doPrintTicket = () => {
    printReceipt(data?.OrderDetail);
  };

  const renderOrderButton = () => {
    return (
      <>
        <View
          style={{
            marginBottom: 15,
            borderBottomWidth: 1,
            borderBottomColor: '#ccc',
            paddingBottom: 15,
          }}>
          <IconButton
            text="PRINT"
            leftIcon="print-outline"
            onPress={doPrintTicket}
            bgColor="#06b6d4"
            isLoading={false}
          />
        </View>

        {realtimeStatus === 'NEW' ? (
          <View style={{marginBottom: 15}}>
            <IconButton
              text="PREPARE"
              leftIcon="flame-outline"
              onPress={() => changeStatus('PREPARE')}
              bgColor="#fb923c"
              isLoading={false}
            />
          </View>
        ) : (
          <></>
        )}

        {realtimeStatus === 'NEW' || realtimeStatus === 'PREPARE' ? (
          <View style={{marginBottom: 15}}>
            <IconButton
              text="READY"
              leftIcon="play-outline"
              onPress={() => changeStatus('READY')}
              bgColor="#38bdf8"
              isLoading={false}
            />
          </View>
        ) : (
          <></>
        )}

        {realtimeStatus === 'NEW' ||
        realtimeStatus === 'PREPARE' ||
        realtimeStatus === 'READY' ? (
          <View style={{marginBottom: 15}}>
            <IconButton
              text="FINISH"
              leftIcon="checkmark-outline"
              onPress={() => changeStatus('FINISH')}
              bgColor="#22c55e"
              isLoading={false}
            />
          </View>
        ) : (
          <></>
        )}

        {realtimeStatus === 'NEW' ||
        realtimeStatus === 'PREPARE' ||
        realtimeStatus === 'READY' ? (
          <View style={{marginBottom: 15}}>
            <IconButton
              text="CANCEL"
              leftIcon="close-outline"
              onPress={renderCancelConfirmDialog}
              bgColor="#a3a3a3"
              isLoading={false}
            />
          </View>
        ) : (
          <></>
        )}
      </>
    );
  };

  const renderOrderDetail = () => {
    if (data && data.OrderDetail) {
      const {OrderDetail} = data;
      return (
        <>
          <View style={s.orderDetailItem}>
            <View style={s.itemLeft}>
              <Text style={{color: '#000'}}>Code:</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                flexGrow: 1,
              }}>
              <Text style={{color: '#000', marginRight: 10}}>
                #{OrderDetail.OrderCode}
              </Text>
              <Badge
                text={realtimeStatus}
                color={getStatusColor(realtimeStatus)}
              />
            </View>
            <View
              style={{
                alignItems: 'flex-end',
              }}>
              <Text style={{color: '#000'}}>
                Order Time:{'  '}
                <Text style={{fontWeight: 'bold'}}>
                  {OrderDetail.OrderTimeStr}
                </Text>
              </Text>
            </View>
          </View>

          <View style={s.orderDetailItem}>
            <View style={s.itemLeft}>
              <Text style={{color: '#000'}}>Ticket Type:</Text>
            </View>
            <View>
              <Text style={{color: '#000'}}>
                {OrderDetail.Type === 'DL' ? 'DELIVERY' : 'PICKUP'}
              </Text>
            </View>
          </View>
          <View style={s.orderDetailItem}>
            <View style={s.itemLeft}>
              <Text style={{color: '#000'}}>Customer:</Text>
            </View>
            <View>
              <Text style={{color: '#000'}}>
                {OrderDetail.CusName} -{' '}
                {formatPhoneNumber(OrderDetail.CusPhone)}
              </Text>
            </View>
          </View>
          <View style={s.orderDetailItem}>
            <View style={s.itemLeft}>
              <Text style={{color: '#000'}}>Customer Address:</Text>
            </View>
            <View>
              <Text style={{color: '#000'}}>{OrderDetail.CusAddress}</Text>
            </View>
          </View>
          <View style={{paddingTop: 15, paddingBottom: 10}}>
            <Text style={{color: 'green', fontWeight: 'bold'}}>
              TICKET DETAIL
            </Text>
          </View>
          <FlatList
            data={OrderDetail.OrderItems}
            renderItem={({item}) => (
              <View style={{flex: 1 / 5}} key={item.FoodId}>
                <FoodItem data={item} />
              </View>
            )}
            keyExtractor={item => item.FoodId.toString()}
            ListEmptyComponent={
              <View style={{padding: 20, backgroundColor: '#fff', margin: 5}}>
                <Text>Have no data!</Text>
              </View>
            }
            scrollEnabled={false}
          />
          <View style={[s.wrOrderTotal, {marginTop: 20}]}>
            <View style={s.wrOrderLeft}>
              <Text style={{fontWeight: 'bold', color: '#000'}}>SubTotal:</Text>
            </View>
            <View style={s.wrOrderRight}>
              <Text style={{fontWeight: 'bold', color: '#000'}}>
                {formatMoney(OrderDetail.SubTotal)}
              </Text>
            </View>
          </View>
          <View style={s.wrOrderTotal}>
            <View style={s.wrOrderLeft}>
              <Text style={{fontWeight: 'bold', color: '#000'}}>Tax:</Text>
            </View>
            <View style={s.wrOrderRight}>
              <Text style={{fontWeight: 'bold', color: '#000'}}>
                {formatMoney(OrderDetail.Tax)}
              </Text>
            </View>
          </View>
          <View style={s.wrOrderTotal}>
            <View style={s.wrOrderLeft}>
              <Text style={{fontWeight: 'bold', color: '#000'}}>Tip:</Text>
            </View>
            <View style={s.wrOrderRight}>
              <Text style={{fontWeight: 'bold', color: '#000'}}>
                {formatMoney(OrderDetail.Tip)}
              </Text>
            </View>
          </View>
          <View style={s.wrOrderTotal}>
            <View style={s.wrOrderLeft}>
              <Text style={{fontWeight: 'bold', color: '#000'}}>Total:</Text>
            </View>
            <View style={s.wrOrderRight}>
              <Text style={{fontWeight: 'bold', color: '#000'}}>
                {formatMoney(OrderDetail.Total)}
              </Text>
            </View>
          </View>
          {OrderDetail.ResNote && (
            <View style={{marginTop: 20}}>
              <Text style={{color: 'red', textAlign: 'right'}}>
                (*) {OrderDetail.ResNote}
              </Text>
            </View>
          )}
        </>
      );
    } else return <></>;
  };

  return (
    <Layout screenName="OrderDetail">
      <HeaderGoBack name="Ticket Detail" showBackButton={true} />
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
          }}>
          {isLoading ? (
            <LoadingComponent isHorizontal={false} />
          ) : (
            <ScrollView>{renderOrderDetail()}</ScrollView>
          )}
        </View>
        <View style={{width: 200, paddingLeft: 20}}>
          {!isLoading && renderOrderButton()}
        </View>
      </View>
    </Layout>
  );
};

export default OrderDetail;

const s = StyleSheet.create({
  orderDetailItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemLeft: {
    width: 180,
    paddingTop: 8,
    paddingBottom: 8,
  },
  wrOrderTotal: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 8,
  },
  wrOrderLeft: {
    display: 'flex',
    flex: 4 / 5,
    alignItems: 'flex-end',
  },
  wrOrderRight: {
    display: 'flex',
    flex: 1 / 5,
    alignItems: 'flex-end',
  },
});
