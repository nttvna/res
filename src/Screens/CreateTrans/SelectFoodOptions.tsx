import {NativeStackScreenProps} from '@react-navigation/native-stack';
import HeaderGoBack from '../../Components/HeaderGoBack';
import Layout from '../../Layout';
import {RootStackParamList} from '../../RootStackParams';
import {
  Text,
  TouchableOpacity,
  View,
  FlatList,
  ScrollView,
  ToastAndroid,
} from 'react-native';
import IconButton from '../../Components/IconButton';
import Icon from 'react-native-vector-icons/Ionicons';
import {formatMoney, makeFoodObjectForBasket} from '../../common';
import ImageWithFallback from '../../Components/ImageWithFallback';
import {modifyGroupObjView, modifyObjView} from '../../Models/order';
import {addItemToBasket, editItemFromBasket} from '../../Redux/orderSlice';
import {useAppDispatch} from '../../Redux/hooks';
import {useEffect, useState} from 'react';
import QuantityButton from '../../Components/QuantityButton';
import {FoodObj, SelectModifyObj} from '../../Models/redux';

type NavProps = NativeStackScreenProps<RootStackParamList, 'SelectFoodOptions'>;
const SelectFoodOptions = ({route, navigation}: NavProps) => {
  const [selectedModifies, setModifies] = useState<SelectModifyObj[]>([]);
  const [foodTotal, setFoodTotal] = useState<number>(1);
  const dispatch = useAppDispatch();
  const {data, currentFoodInBasket} = route.params;

  useEffect(() => {
    if (currentFoodInBasket) {
      setFoodTotal(currentFoodInBasket.Quantity);
      let temData: SelectModifyObj[] = [];
      for (let i: number = 0; i < currentFoodInBasket.FoodOptions.length; i++) {
        temData.push({
          itemId: currentFoodInBasket.FoodOptions[i].ItemId,
          groupId: currentFoodInBasket.FoodOptions[i].GroupId,
        });
      }
      setModifies(temData);
    }
  }, [data, currentFoodInBasket]);

  const renderFoodInfo = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 15,
        }}>
        <View style={{width: 120, paddingRight: 20}}>
          {data && (
            <ImageWithFallback path={data.FoodImage} aspectRatio={4 / 3} />
          )}
        </View>
        <View style={{flexGrow: 1}}>
          <View style={{flex: 1, flexDirection: 'row'}}>
            <View style={{flexGrow: 1}}>
              <View>
                <Text style={{color: 'green', fontSize: 18}}>
                  {data?.FoodName}
                </Text>
              </View>
              {data?.FoodDescription && (
                <View>
                  <Text style={{color: '#333'}}>{data.FoodDescription}</Text>
                </View>
              )}
              <View style={{marginTop: 5}}>
                <Text style={{color: '#f60', fontSize: 16}}>
                  {data?.FoodPrice ? formatMoney(data.FoodPrice) : ''}
                </Text>
              </View>
            </View>
            <View>
              <QuantityButton
                quantity={foodTotal}
                changeQuantity={value => setFoodTotal(value)}
              />
            </View>
          </View>
        </View>
      </View>
    );
  };

  const renderOptionIcon = (modifyId: number, groupId: number) => {
    let isSelected = false;

    for (let i: number = 0; i < selectedModifies.length; i++) {
      if (
        selectedModifies[i].itemId === modifyId &&
        selectedModifies[i].groupId === groupId
      ) {
        isSelected = true;
        break;
      }
    }

    if (isSelected) {
      return (
        <Icon
          name={'checkbox-outline'}
          style={{color: 'green', fontSize: 28, marginRight: 10}}
        />
      );
    } else {
      return (
        <Icon
          name={'square-outline'}
          style={{color: '#333', fontSize: 28, marginRight: 10}}
        />
      );
    }
  };

  const renderOption = (modify: modifyObjView, groupId: number) => {
    return (
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          flex: 1 / 3,
          marginBottom: 10,
        }}
        onPress={() => selectModify(modify.ItemModifyId, groupId)}>
        <View>{renderOptionIcon(modify.ItemModifyId, groupId)}</View>
        <View style={{width: 80, marginRight: 10}}>
          <ImageWithFallback path={modify.ItemImgUrl} aspectRatio={4 / 3} />
        </View>
        <View style={{marginLeft: 10}}>
          <Text style={{color: '#000'}}>{modify.ItemName}</Text>
          <Text style={{color: '#f60'}}>
            {modify.ItemPrice && formatMoney(modify.ItemPrice)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderGroupOptions = (group: modifyGroupObjView) => {
    return (
      <View style={{marginTop: 5, marginBottom: 10}}>
        <View
          style={{
            flexDirection: 'row',
            marginBottom: 15,
            backgroundColor: '#f8f8f8',
            padding: 5,
            borderBottomWidth: 1,
            borderBottomColor: '#e5e5e5',
          }}>
          <View
            style={{
              paddingRight: 15,
              paddingLeft: 10,
              marginRight: 15,
              borderRightColor: '#e5e5e5',
              borderRightWidth: 1,
            }}>
            <Text
              style={{
                color: '#000',
                textTransform: 'uppercase',
                fontWeight: 'bold',
              }}>
              {group.GroupName}
            </Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            {group.IsRequired && (
              <Text style={{color: '#f60', marginRight: 20, fontSize: 13}}>
                Required
              </Text>
            )}
            {group.Maximum > 0 && (
              <Text style={{color: '#333', marginRight: 20, fontSize: 13}}>
                Max: {group.Maximum}
              </Text>
            )}
            {group.Minimum > 0 && (
              <Text style={{color: '#333', fontSize: 13}}>
                Min: {group.Minimum}
              </Text>
            )}
          </View>
        </View>
        <FlatList
          data={group.ItemModifies}
          renderItem={({item}) => renderOption(item, group.GroupId)}
          numColumns={3}
          scrollEnabled={false}
        />
      </View>
    );
  };

  const validSelectModifies = () => {
    let validMessage: string = '';
    if (data && data.ModifyGroups?.length > 0) {
      for (let i: number = 0; i < data?.ModifyGroups.length; i++) {
        const {Maximum, Minimum, IsRequired, GroupName, GroupId} =
          data.ModifyGroups[i];
        var selectedItemsOfGroup = selectedModifies.filter(
          x => x.groupId === GroupId,
        );
        //check required
        if (IsRequired && selectedItemsOfGroup.length === 0) {
          validMessage = '"' + GroupName + '" is required';
          break;
        }
        //check maximum
        if (Maximum > 0 && selectedItemsOfGroup.length > Maximum) {
          validMessage = 'Maximum "' + GroupName + '" is ' + Maximum;
          break;
        }
        //check minimum
        if (Minimum > 0 && selectedItemsOfGroup.length < Minimum) {
          validMessage = 'Minimum "' + GroupName + '" is ' + Minimum;
          break;
        }
      }
    }
    return validMessage;
  };

  const selectFood = () => {
    if (data) {
      let ms = validSelectModifies();
      if (ms && ms.length > 0) {
        ToastAndroid.show(ms, ToastAndroid.SHORT);
      } else {
        if (!currentFoodInBasket) {
          dispatch(
            addItemToBasket({
              Food: makeFoodObjectForBasket(data, selectedModifies, foodTotal),
            }),
          );
        } else {
          let editObj: FoodObj = makeFoodObjectForBasket(
            data,
            selectedModifies,
            foodTotal,
          );
          editObj.UniqueId = currentFoodInBasket.UniqueId;

          dispatch(
            editItemFromBasket({
              Food: editObj,
            }),
          );
        }
        navigation.navigate('CreateTrans', {rand: Math.random()});
      }
    }
  };

  const selectModify = (modifyId: number, groupId: number) => {
    let selectedData: SelectModifyObj[] = [...selectedModifies];
    let indexExists: number = -1;
    for (let i: number = 0; i < selectedData.length; i++) {
      if (
        selectedData[i].itemId === modifyId &&
        selectedData[i].groupId === groupId
      ) {
        indexExists = i;
      }
    }
    if (indexExists === -1) {
      selectedData.push({
        itemId: modifyId,
        groupId: groupId,
      });
    } else {
      selectedData.splice(indexExists, 1);
    }
    setModifies(selectedData);
  };

  return (
    <Layout screenName="Home">
      <HeaderGoBack name="Customise" showBackButton={true} />
      <View style={{flexDirection: 'row', flex: 1}}>
        <View
          style={{
            flex: 9,
            paddingLeft: 10,
            paddingRight: 10,
            paddingBottom: 10,
          }}>
          <View
            style={{
              flex: 1,
              backgroundColor: '#fff',
              borderWidth: 1,
              borderColor: '#e5e5e5',
              borderRadius: 5,
              padding: 10,
            }}>
            <ScrollView style={{flex: 1}}>
              {renderFoodInfo()}
              <FlatList
                data={data?.ModifyGroups}
                renderItem={({item}) => renderGroupOptions(item)}
                scrollEnabled={false}
              />
            </ScrollView>
          </View>
        </View>
        <View style={{flex: 2, paddingRight: 10, paddingLeft: 10}}>
          <View style={{marginBottom: 20}}>
            <IconButton
              text="APPLY CHANGES"
              leftIcon="checkmark-done-outline"
              onPress={selectFood}
              bgColor="green"
              isLoading={false}
            />
          </View>

          <IconButton
            text="CANCEL"
            leftIcon="close-outline"
            onPress={() => {
              navigation.navigate('CreateTrans', {rand: Math.random()});
            }}
            bgColor="#adb5bd"
            isLoading={false}
          />
        </View>
      </View>
    </Layout>
  );
};
export default SelectFoodOptions;
