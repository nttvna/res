import {Text, View, StyleSheet} from 'react-native';
import {Extra, OrderItem} from '../../Models/order';
import {FC} from 'react';
import React from 'react';
import {formatMoney} from '../../common';

interface Props {
  data: OrderItem;
}

const FoodItem: FC<Props> = ({data}) => {
  const getTotal = (
    foodExtra: Extra[],
    foodQuantity: number,
    foodPrice: number,
  ) => {
    let total: number = foodQuantity * foodPrice;

    if (foodExtra)
      for (let i: number = 0; i < foodExtra.length; i++) {
        total += foodExtra[i].Price * foodExtra[i].Quantity;
      }

    return <Text>{formatMoney(total)}</Text>;
  };

  const renderFoodExtra = (foodExtra: Extra[]) => {
    if (foodExtra) {
      return (
        <View>
          {foodExtra.map((el: Extra) => {
            return (
              <View
                key={el.Id}
                style={{flexDirection: 'row', alignItems: 'center'}}>
                <View>
                  <Text>
                    {'- '}
                    {el.Name}{' '}
                  </Text>
                </View>
                <View>
                  <Text>
                    ({el.Quantity} x {formatMoney(el.Price)})
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      );
    } else return <></>;
  };

  return (
    <View style={s.wrp}>
      <View style={{flexGrow: 1}}>
        <Text style={{color: '#000', fontWeight: 'bold'}}>{data.FoodName}</Text>
        {renderFoodExtra(data.Extras)}
      </View>
      <View style={{width: 50}}>
        <Text style={{color: '#000'}}>{data.Quanlity}</Text>
      </View>
      <View style={{width: 100}}>
        <Text style={{color: '#000', textAlign: 'right'}}>
          {getTotal(data.Extras, data.Quanlity, data.FoodPrice)}
        </Text>
      </View>
    </View>
  );
};
export default React.memo(FoodItem);

const s = StyleSheet.create({
  wrp: {
    paddingTop: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
    flexDirection: 'row',
    alignItems: 'center',
  },
});
