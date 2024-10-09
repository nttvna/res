import {FC, useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface Props {
  quantity: number;
  changeQuantity: (value: number) => void;
}

const QuantityButton: FC<Props> = ({quantity, changeQuantity}) => {
  const [total, setTotal] = useState<number>(quantity);

  useEffect(() => {
    setTotal(quantity);
  }, [quantity]);

  const changeTotal = (total: number) => {
    if (total > 0) {
      setTotal(total);
      changeQuantity(total);
    }
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 10,
        marginTop: 10,
      }}>
      <View>
        <TouchableOpacity
          style={s.btnGroup}
          onPress={() => changeTotal(total - 1)}>
          <Icon
            name={'remove-outline'}
            style={{color: 'green', fontSize: 25}}
          />
        </TouchableOpacity>
      </View>
      <View style={{paddingLeft: 15, paddingRight: 15}}>
        <Text style={{fontSize: 20, fontWeight: 'bold', color: '#000'}}>
          {total}
        </Text>
      </View>
      <View>
        <TouchableOpacity
          style={s.btnGroup}
          onPress={() => changeTotal(total + 1)}>
          <Icon name={'add-outline'} style={{color: 'green', fontSize: 25}} />
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default QuantityButton;

const s = StyleSheet.create({
  btnGroup: {
    padding: 5,
    borderWidth: 1,
    borderColor: 'green',
    borderRadius: 5,
    backgroundColor: '#f8f8f8',
  },
});
