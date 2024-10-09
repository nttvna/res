import React, {FC} from 'react';
import {Text, View} from 'react-native';

interface Props {
  text: string;
  color: string | undefined;
}

const Badge: FC<Props> = ({text, color}) => {
  return (
    <View
      style={{
        backgroundColor: color ? color : '#888',
        padding: 3,
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: 8,
      }}>
      <Text style={{color: '#fff', fontSize: 11}}>{text}</Text>
    </View>
  );
};
export default React.memo(Badge);
