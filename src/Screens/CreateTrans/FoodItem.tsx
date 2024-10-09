import {Text, View, TouchableOpacity} from 'react-native';
import {foodObjView} from '../../Models/order';
import {FC} from 'react';
import {formatMoney, makeFoodObjectForBasket} from '../../common';
import ImageWithFallback from '../../Components/ImageWithFallback';
import {useNavigation} from '@react-navigation/native';
import {addItemToBasket} from '../../Redux/orderSlice';
import {useAppDispatch} from '../../Redux/hooks';

interface Props {
  data: foodObjView;
}

const FoodItem: FC<Props> = ({data}) => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<any>();
  const addFoodToBasket = () => {
    if (data?.ModifyGroups?.length > 0) {
      navigation.navigate('SelectFoodOptions', {data});
    } else {
      dispatch(addItemToBasket({Food: makeFoodObjectForBasket(data, [], 1)}));
    }
  };

  return (
    <TouchableOpacity
      style={{
        backgroundColor: '#fff',
        borderRadius: 5,
        margin: 5,
        marginRight: 8,
        padding: 3,
        borderColor: '#888',
        borderWidth: 1,
        marginBottom: 10,
      }}
      onPress={addFoodToBasket}>
      <View
        style={{
          flexDirection: 'row',
          paddingLeft: 5,
          paddingRight: 5,
          borderBottomColor: '#e5e5e5',
          borderBottomWidth: 1,
          paddingBottom: 5,
        }}>
        <View style={{flex: 1}}>
          <Text style={{fontWeight: 'bold', color: '#f60'}}>#12</Text>
        </View>
        <View style={{flex: 1}}>
          <Text style={{fontWeight: 'bold', color: '#000', textAlign: 'right'}}>
            {data.FoodPrice ? formatMoney(data.FoodPrice) : ''}
          </Text>
        </View>
      </View>
      <View>
        <ImageWithFallback path={data.FoodImage} aspectRatio={4 / 3} />
      </View>
      <View style={{paddingTop: 2, paddingBottom: 5}}>
        <Text style={{color: '#333', textAlign: 'center'}}>
          {data.FoodName}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
export default FoodItem;
