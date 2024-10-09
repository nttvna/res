import Toast from 'react-native-toast-message';
import { foodObjView } from './Models/order';
import { FoodObj, ModifyObj, SelectModifyObj } from './Models/redux';
import { ToastType } from './const';

export function getStatusColor(status: string) {
  if (status === 'NEW') {
    return '#f39c12';
  } else if (status === 'PREPARE') {
    return '#f56954';
  } else if (status === 'READY') {
    return '#00a65a';
  } else if (status === 'REFUSE') {
    return '#bce0ff';
  } else if (status === 'FINISH') {
    return '#0073b7';
  } else {
    return '#888';
  }
}

export function showToast(content: string, type: ToastType = ToastType._error) {
  Toast.show({
    type: type,
    text1: content,
    visibilityTime: 4000 //4s
  });
}

export function formatPhoneNumber(PhoneNumber: string) {
  let str = '';
  if (PhoneNumber && PhoneNumber.length == 11) {
    str = PhoneNumber.substring(1);
  } else {
    str = PhoneNumber;
  }

  //Filter only numbers from the input
  let cleaned = ('' + str).replace(/\D/g, '');

  //Check if the input is of correct length
  let match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);

  if (match) {
    return '(' + match[1] + ') ' + match[2] + '-' + match[3];
  } else {
    return str;
  }
}

export function formatNumber(amount: number) {
  if (amount) return amount.toFixed(2);
  else return '0.00';
}

export function formatMoney(amount: number) {
  //fixbug add float number: ex 27.6 + 4.14 = 31.740000000000002;
  let roundAmount: number = Math.round(amount * 100) / 100;

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  return formatter.format(roundAmount);
}

export function makeFoodObjectForBasket(
  data: foodObjView,
  selectedModifies: SelectModifyObj[],
  quantity: number,
) {
  let foodModifies: ModifyObj[] = [];
  if (data.ModifyGroups?.length > 0) {
    for (let i: number = 0; i < data.ModifyGroups.length; i++) {
      for (
        let j: number = 0;
        j < data.ModifyGroups[i].ItemModifies.length;
        j++
      ) {
        let selectedModfy = selectedModifies.filter(
          x => x.itemId == data.ModifyGroups[i].ItemModifies[j].ItemModifyId,
        );

        //**********NOTE************ */
        //Trong trường hợp có nhiều ItemModifyId giống nhau được chọn trong 1 món ăn (ItemModify đó nằm trong nhiều Group khác nhau) -> Chỉ lấy của Group đầu tiên
        //Trương hợp này thực tế sẽ không có cùng 1 ItemModify thêm vào nhiều group khác nhau -> Do trên web chưa hạn chế sẽ update web sau.
        //Trong trường hợp Edit món ăn, nếu chọn nhiều ItemModify trùng nhau trước đó -> Sẽ chỉ hiện ở Group đầu tiên.
        //**********NOTE************ */

        if (selectedModfy.length > 0) {
          //don't allow push duplicate item modify
          let isExistModify = false;
          for (let x: number = 0; x < foodModifies.length; x++) {
            if (
              foodModifies[x].ItemId ===
              data.ModifyGroups[i].ItemModifies[j].ItemModifyId
            ) {
              isExistModify = true;
            }
          }
          //add modify if not exist
          if (isExistModify === false) {
            foodModifies.push({
              ItemId: data.ModifyGroups[i].ItemModifies[j].ItemModifyId,
              ItemName: data.ModifyGroups[i].ItemModifies[j].ItemName,
              ItemPrice: data.ModifyGroups[i].ItemModifies[j].ItemPrice,
              GroupId: selectedModfy[0].groupId,
            });
          }
        }
      }
    }
  }

  let result: FoodObj = {
    UniqueId: Math.random(),
    FoodId: data.FoodId,
    FoodName: data.FoodName,
    FoodPrice: data.FoodPrice ? data.FoodPrice : 0,
    Quantity: quantity,
    FoodOptions: [...foodModifies],
  };
  return result;
}

export function checkFoodExistInBasket(
  currentFoods: FoodObj[],
  selectedFood: FoodObj,
) {
  let existIndex = -1;
  if (currentFoods.length > 0) {
    for (let i: number = 0; i < currentFoods.length; i++) {
      if (
        currentFoods[i].FoodId == selectedFood.FoodId &&
        currentFoods[i].FoodOptions.length == selectedFood.FoodOptions.length
      ) {
        let strItemIdCurrent = currentFoods[i].FoodOptions.map(
          obj => obj.ItemId,
        )
          .sort((a, b) => a - b)
          .join(',');
        let strItemIdNew = selectedFood.FoodOptions.map(obj => obj.ItemId)
          .sort((a, b) => a - b)
          .join(',');
        if (strItemIdCurrent == strItemIdNew) {
          existIndex = i;
        }
      }
    }
  }
  return existIndex;
}

export function getItemPrice(food: FoodObj) {
  let itemPriceIncludeModify: number = food.FoodPrice;
  if (food.FoodOptions.length > 0) {
    for (let i: number = 0; i < food.FoodOptions.length; i++) {
      itemPriceIncludeModify += food.FoodOptions[i].ItemPrice;
    }
  }
  return parseFloat(itemPriceIncludeModify.toFixed(2));
}

export function getBasketTotal(
  foods: FoodObj[],
  tip: number,
  tax: number,
  discount: number,
) {
  let _subTotal = 0;
  if (foods?.length > 0) {
    for (let i: number = 0; i < foods.length; i++) {
      let itemPrice: number = getItemPrice(foods[i]);
      _subTotal += itemPrice * foods[i].Quantity;
    }
  }

  let _paymentDue: number = _subTotal + tip + tax - discount;

  return {
    subTotal: parseFloat(_subTotal.toFixed(2)),
    paymentDue: parseFloat(_paymentDue.toFixed(2)),
  };
}
