import React, {FC, useEffect, useState} from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import Badge from '../../Components/Badge';
import {lastOrderObject} from '../../Models/order';
import {getStatusColor} from '../../common';
import moment from 'moment';
import {JsonDateFormat} from '../../const';
import database from '@react-native-firebase/database';
import {useNavigation} from '@react-navigation/native';

interface Props {
  data: lastOrderObject;
  currentOrderId?: number;
}

const OrderItem: FC<Props> = ({data, currentOrderId}) => {
  const navigation = useNavigation<any>();
  const [realtimeStatus, setRealtimeStatus] = useState(data.Status);

  useEffect(() => {
    const onOrderChange = database()
      .ref(`/orders/${data.Code}/orderstatus`)
      .on('value', function (snapshot) {
        if (snapshot && snapshot.val()) {
          setRealtimeStatus(snapshot.val());
        }
      });

    //stop listerning when no longer required
    return () =>
      database()
        .ref(`/orders/${data.Code}/orderstatus`)
        .off('value', onOrderChange);
  }, []);

  const getCustomerName = () => {
    if (!data.FirstName && !data.LastName) {
      return 'Non-register';
    } else {
      return data.FirstName + ' ' + data.LastName;
    }
  };

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('OrderDetail', {OrderId: data.Id})}
      style={{flex: 1}}>
      <View
        style={{
          backgroundColor: data.Id === currentOrderId ? '#ffffcc' : '#fff',
          borderWidth: 1,
          borderColor: '#e5e5e5',
          padding: 10,
          marginBottom: 10,
          borderRadius: 5,
          marginRight: 10,
          flex: 1,
        }}>
        <View style={{flexGrow: 1}}>
          <View style={{marginBottom: 5, flexGrow: 1}}>
            <Text style={{fontWeight: 'bold', color: '#333'}}>
              {data.SelectedFoods}
            </Text>
          </View>
          <View style={{marginBottom: 2}}>
            <Text style={{color: '#0073b7'}}>{getCustomerName()}</Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <View style={{flexGrow: 1}}>
              <Text>
                {moment(data.OrderDate, JsonDateFormat).format('LT')} |{' '}
                {data.Type}
              </Text>
            </View>
            <View>
              <Text style={{color: 'red'}}>${data.Total}</Text>
            </View>
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            borderTopColor: '#e5e5e5',
            borderTopWidth: 1,
            paddingTop: 10,
            marginTop: 10,
          }}>
          <View style={{flexGrow: 1}}>
            <Text>#{data.Code}</Text>
          </View>
          <Badge
            color={getStatusColor(realtimeStatus)}
            text={
              realtimeStatus === 'CANCELRESTAURANT' ? 'CANCEL' : realtimeStatus
            }
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default React.memo(OrderItem);
