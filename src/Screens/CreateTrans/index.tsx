import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../RootStackParams';
import Layout from '../../Layout';
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ToastAndroid,
  Alert,
  Switch,
} from 'react-native';
import {useEffect, useRef, useState} from 'react';
import OrderByCode from './OrderByCode';
import CategoryItem from './CategoryItem';
import FoodItem from './FoodItem';
import IconButton from '../../Components/IconButton';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  useCreateOrderMutation,
  useLazyGetCateForNewOrderQuery,
} from '../../Apis/orders';
import {useAppSelector} from '../../Redux/hooks';
import moment from 'moment';
import {categoryObjView, foodObjView} from '../../Models/order';
import LoadingComponent from '../../Components/Loading';
import NoData from './NoData';
import {FoodObj} from '../../Models/redux';
import {formatMoney, getBasketTotal, getItemPrice} from '../../common';
import {removeItemFromBasket} from '../../Redux/orderSlice';
import {useAppDispatch} from '../../Redux/hooks';
import {TicketType} from '../../const';
import DialogPaymentButton from '../../Components/DialogPaymentButton';

type NavProps = NativeStackScreenProps<RootStackParamList, 'CreateTrans'>;
const CreateTrans = ({route, navigation}: NavProps) => {
  const scrollViewBasket = useRef<any>(null);
  const dispatch = useAppDispatch();
  const [showPaymentDialog, setShowPaymentDialog] = useState<boolean>(false);
  const [categories, setCategories] = useState<categoryObjView[]>([]);
  const [selectedCategory, setCategory] = useState<categoryObjView | null>(
    null,
  );
  const [orderType, setType] = useState<string>(TicketType.ForHere);
  const {restaurantTime, TimeZone} = useAppSelector(state => state.Account);

  const orderReduxData = useAppSelector(state => state.Order);
  const {Foods, Tip, Tax, Discount} = orderReduxData;

  const [getCateForNewOrder, {isLoading}] = useLazyGetCateForNewOrderQuery();
  const [createOrder, {isLoading: isCreating}] = useCreateOrderMutation();

  useEffect(() => {
    if (restaurantTime) {
      getCateForNewOrder({
        resTime: moment(restaurantTime).format('MM-DD-YYYY'),
      })
        .unwrap()
        .then(response => {
          const {Message, Data} = response;
          if (Message === 'Success') {
            setCategories([...Data]);
          } else {
            ToastAndroid.show(Message, ToastAndroid.SHORT);
          }
        })
        .catch(err => {
          ToastAndroid.show(err.Message, ToastAndroid.SHORT);
        });
    }
  }, [restaurantTime]);

  useEffect(() => {
    scrollViewBasket.current?.scrollToEnd({animated: true});
  }, [Foods]);

  const doCreateOrder = () => {
    if (orderReduxData.Foods.length === 0) {
      ToastAndroid.show('Your cart is currently empty.', ToastAndroid.SHORT);
      return;
    }

    createOrder(orderReduxData)
      .unwrap()
      .then(response => {
        console.log(response);
        navigation.navigate('Home', {
          rand: Math.random(),
          OrderId: response?.Data,
        });
      })
      .catch(err => {
        ToastAndroid.show(err.Message, ToastAndroid.SHORT);
      });
  };

  const goEditBasketItem = (foodInBasket: FoodObj) => {
    let dataForEditFood: foodObjView | null = null;
    for (let i: number = 0; i < categories.length; i++) {
      for (let j: number = 0; j < categories[i].Foods.length; j++) {
        if (categories[i].Foods[j].FoodId === foodInBasket.FoodId) {
          dataForEditFood = categories[i].Foods[j];
          break;
        }
      }
    }
    navigation.navigate('SelectFoodOptions', {
      data: dataForEditFood,
      currentFoodInBasket: foodInBasket,
    });
  };

  const renderOrderDetail = () => {
    return (
      <View
        style={{
          flexGrow: 1,
          paddingLeft: 10,
          paddingRight: 10,
        }}>
        <ScrollView style={{flex: 1}} ref={scrollViewBasket}>
          <FlatList
            data={Foods}
            renderItem={({item}) => renderOrderItem(item)}
            scrollEnabled={false}
            ListEmptyComponent={() => (
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingTop: 20,
                }}>
                <Icon
                  name={'basket-outline'}
                  style={{color: '#888', fontSize: 50}}
                />
                <Text style={{color: '#888', marginTop: 5}}>
                  Your cart is currently empty.
                </Text>
              </View>
            )}
          />
        </ScrollView>
      </View>
    );
  };

  const renderOrderItem = (data: FoodObj) => {
    return (
      <View
        style={{
          borderBottomColor: '#e5e5e5',
          borderBottomWidth: 1,
          marginBottom: 5,
          paddingBottom: 5,
        }}>
        <View>
          <Text style={{color: '#000', fontWeight: 'bold'}}>
            {data.FoodName}
          </Text>
        </View>

        {data.FoodOptions && data.FoodOptions.length > 0 && (
          <View>
            <Text style={{color: '#333'}}>
              {data.FoodOptions.map(obj => obj.ItemName).join(',')}
            </Text>
          </View>
        )}

        <View
          style={{flexDirection: 'row', alignItems: 'center', marginTop: 5}}>
          <View
            style={{flexGrow: 1, flexDirection: 'row', alignItems: 'center'}}>
            <Text style={{color: '#f60', fontSize: 16}}>
              {formatMoney(getItemPrice(data))}
            </Text>
            <Text style={{color: '#333', marginLeft: 8}}>
              (x{data.Quantity})
            </Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity onPress={() => goEditBasketItem(data)}>
              <Icon
                name={'create-outline'}
                style={{color: '#0d6efd', fontSize: 25, marginRight: 15}}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => dispatch(removeItemFromBasket({Food: data}))}>
              <Icon
                name={'trash-outline'}
                style={{color: '#f60', fontSize: 22, marginRight: 5}}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const renderCancelOrderConfirmDialog = () => {
    if (Foods.length > 0) {
      Alert.alert(
        'Confirmation',
        'Are you sure you want to cancel this ticket?',
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {
            text: 'OK',
            onPress: () => {
              navigation.navigate('Home', {
                rand: Math.random(),
              });
            },
          },
        ],
      );
    } else {
      navigation.navigate('Home', {
        rand: Math.random(),
      });
    }
  };

  const renderOrderButton = () => {
    return (
      <View style={{padding: 5}}>
        <View style={{flexDirection: 'row'}}>
          <View style={{flex: 3 / 7, paddingRight: 5}}>
            <IconButton
              text="CANCEL"
              leftIcon="close-outline"
              onPress={renderCancelOrderConfirmDialog}
              bgColor="#adb5bd"
              isLoading={false}
            />
          </View>
          <View style={{flex: 4 / 7, paddingLeft: 5}}>
            <IconButton
              text="PAY"
              leftIcon="card-outline"
              onPress={() => {
                setShowPaymentDialog(true);
              }}
              bgColor="#f60"
              isLoading={false}
            />
          </View>
        </View>
        <View style={{paddingTop: 8}}>
          {isCreating ? (
            <IconButton
              text=""
              leftIcon=""
              onPress={() => {}}
              bgColor="green"
              isLoading={true}
            />
          ) : (
            <IconButton
              text="SAVE"
              leftIcon="save-outline"
              onPress={doCreateOrder}
              bgColor="green"
              isLoading={false}
            />
          )}
        </View>
      </View>
    );
  };

  const renderOrderTotal = () => {
    let totalObj = getBasketTotal(Foods, Tip, Tax, Discount);
    return (
      <View style={{padding: 5}}>
        <View
          style={{
            flexDirection: 'row',
            marginBottom: 5,
            paddingBottom: 10,
            borderBottomWidth: 1,
            borderBottomColor: '#e5e5e5',
          }}>
          <View style={{flexGrow: 1}}></View>
          <View>
            <TouchableOpacity>
              <View
                style={{
                  backgroundColor: '#0d6efd',
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingRight: 10,
                  paddingLeft: 3,
                  borderRadius: 5,
                }}>
                <Icon
                  name={'add-outline'}
                  style={{color: '#fff', fontSize: 25, marginRight: 5}}
                />
                <Text style={{color: '#fff'}}>Misc Charge</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View style={s.rowTotal}>
          <View style={s.rowLeft}>
            <Text style={s.labelTotal}>SubTotal:</Text>
          </View>
          <View style={s.rowRight}>
            <Text style={s.txtTotal}>{formatMoney(totalObj.subTotal)}</Text>
          </View>
        </View>
        <View style={s.rowTotal}>
          <View style={s.rowLeft}>
            <Text style={s.labelTotal}>Discount:</Text>
          </View>
          <View style={s.rowRight}>
            <Text style={s.txtTotal}>{formatMoney(Discount)}</Text>
          </View>
        </View>
        <View style={s.rowTotal}>
          <View style={s.rowLeft}>
            <Text style={s.labelTotal}>Sale Tax:</Text>
          </View>
          <View style={s.rowRight}>
            <Text style={s.txtTotal}>{formatMoney(Tax)}</Text>
          </View>
        </View>
        <View
          style={[
            s.rowTotal,
            {
              borderTopWidth: 1,
              borderTopColor: '#e5e5e5',
              paddingTop: 2,
              marginTop: 2,
              marginBottom: 10,
            },
          ]}>
          <View style={s.rowLeft}>
            <Text style={s.labelTotal}>Payment Due:</Text>
          </View>
          <View style={s.rowRight}>
            <Text style={[s.txtTotal, {color: 'red', fontSize: 16}]}>
              {formatMoney(totalObj.paymentDue)}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <Layout screenName="Home">
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          flex: 1,
        }}>
        <View
          style={{
            display: 'flex',
            flex: 1,
            padding: 8,
            backgroundColor: '#fff',
            borderRightColor: '#e5e5e5',
            borderRightWidth: 1,
          }}>
          {isLoading ? (
            <LoadingComponent isHorizontal={false} />
          ) : (
            <FlatList
              data={categories}
              renderItem={({item, index}) => (
                <CategoryItem
                  key={index}
                  data={item}
                  selectCategory={() => setCategory({...item})}
                />
              )}
            />
          )}
        </View>
        <View
          style={{display: 'flex', flex: 6, paddingLeft: 10, paddingRight: 10}}>
          <OrderByCode categoryName={selectedCategory?.CategoryName} />
          <View style={{flex: 1, paddingTop: 5}}>
            {selectedCategory ? (
              <FlatList
                data={selectedCategory?.Foods}
                renderItem={({item, index}) => (
                  <View style={{display: 'flex', flex: 1 / 5}}>
                    <FoodItem key={index} data={item} />
                  </View>
                )}
                numColumns={5}
                ListEmptyComponent={() => (
                  <NoData
                    message="There is no data."
                    timeZone={TimeZone}
                    restaurantTime={restaurantTime}
                  />
                )}
              />
            ) : (
              <NoData
                message="Please select a category for continue."
                timeZone={TimeZone}
                restaurantTime={restaurantTime}
              />
            )}
          </View>
        </View>
        <View
          style={{
            display: 'flex',
            flex: 2.3,
            backgroundColor: '#fff',
            borderLeftWidth: 1,
            borderLeftColor: '#e5e5e5',
          }}>
          <View
            style={{
              margin: 10,
              borderBottomColor: '#888',
              borderBottomWidth: 1,
              paddingBottom: 10,
              paddingTop: 1,
              flexDirection: 'row',
            }}>
            <View style={{flexGrow: 1}}>
              <Text style={{color: '#000', fontSize: 16}}>Ticket Detail</Text>
            </View>
            <View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontWeight: 'bold',
                    color: 'green',
                    paddingRight: 10,
                  }}>
                  {orderType}
                </Text>
                <Switch
                  trackColor={{false: '#767577', true: 'green'}}
                  thumbColor={
                    orderType === TicketType.ToGo ? '#f5dd4b' : '#f4f3f4'
                  }
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={() => {
                    if (orderType === TicketType.ToGo) {
                      setType(TicketType.ForHere);
                    } else {
                      setType(TicketType.ToGo);
                    }
                  }}
                  value={orderType === TicketType.ToGo}
                />
              </View>
            </View>
          </View>
          {renderOrderDetail()}
          {renderOrderTotal()}
          {renderOrderButton()}
        </View>
      </View>
      <DialogPaymentButton
        showDialog={showPaymentDialog}
        toggleDialog={value => setShowPaymentDialog(value)}
      />
    </Layout>
  );
};
export default CreateTrans;

const s = StyleSheet.create({
  rowTotal: {
    flexDirection: 'row',
    marginBottom: 3,
    alignItems: 'center',
  },
  rowLeft: {
    flex: 3,
  },
  rowRight: {
    flex: 2,
  },
  txtTotal: {
    color: '#000',
    fontWeight: 'bold',
    textAlign: 'right',
  },
  labelTotal: {
    color: '#000',
    textAlign: 'right',
  },
});
