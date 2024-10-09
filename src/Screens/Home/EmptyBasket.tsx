import moment from 'moment';
import React, {FC} from 'react';
import {Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface Props {
  restaurantTime: Date;
  timeZone: string;
}

const EmptyBasket: FC<Props> = ({restaurantTime, timeZone}) => {
  return (
    <View
      style={{
        padding: 20,
        backgroundColor: '#fff',
        margin: 5,
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      <View>
        <Icon
          name={'bag-handle-outline'}
          style={{color: '#888', fontSize: 25, marginRight: 8}}
        />
      </View>
      <View style={{flexGrow: 1}}>
        <Text style={{color: '#888'}}>Have no ticket today.</Text>
      </View>
      <View>
        <Text style={{color: '#888'}}>
          {timeZone}
          {' | '}
          {moment(restaurantTime).format('MM/DD/YYYY HH:mm')}
        </Text>
      </View>
    </View>
  );
};
export default React.memo(EmptyBasket);
