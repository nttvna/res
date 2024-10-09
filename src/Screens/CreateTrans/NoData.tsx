import React, {FC} from 'react';
import {Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';

interface Props {
  restaurantTime: Date;
  timeZone: string;
  message: string;
}

const NoData: FC<Props> = ({restaurantTime, timeZone, message}) => {
  return (
    <View
      style={{
        backgroundColor: '#fff',
        margin: 5,
        padding: 20,
        display: 'flex',
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      <View>
        <Icon
          name={'alert-circle-outline'}
          style={{color: '#888', fontSize: 25, marginRight: 8}}
        />
      </View>
      <View style={{flexGrow: 1}}>
        <Text style={{color: '#000'}}>{message}</Text>
      </View>

      <View>
        <Text style={{color: '#888', fontSize: 12}}>
          {timeZone}
          {' | '}
          {moment(restaurantTime).format('MM/DD/YYYY HH:mm')}
        </Text>
      </View>
    </View>
  );
};
export default React.memo(NoData);
