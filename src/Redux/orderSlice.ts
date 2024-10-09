import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';
import {FoodObj, OrderState} from '../Models/redux';
import {checkFoodExistInBasket} from '../common';

// Define the initial state using that type
const initialState: OrderState = {
  RestaurantId: 0,
  RestaurantTime: '',
  OrderType: 'PK',
  Foods: [],
  Discount: 0,
  Tip: 0,
  Tax: 0,
};

export const orderSlice = createSlice({
  name: 'Order',
  initialState,
  reducers: {
    initBasket: (
      state,
      action: PayloadAction<{
        RestaurantId: number;
        RestaurantTime: string;
      }>,
    ) => {
      const {RestaurantId, RestaurantTime} = action.payload;
      state.RestaurantId = RestaurantId;
      state.RestaurantTime = RestaurantTime;
      state.Foods = [];
      state.Discount = 0;
      state.Tip = 0;
      state.Tax = 0;
    },
    addItemToBasket: (
      state,
      action: PayloadAction<{
        Food: FoodObj;
      }>,
    ) => {
      const {Food} = action.payload;
      //check exists
      let currentFoods: FoodObj[] = state.Foods;
      let existIndex = checkFoodExistInBasket(currentFoods, Food);
      if (existIndex === -1) {
        currentFoods.push(Food);
      } else {
        currentFoods[existIndex].Quantity =
          currentFoods[existIndex].Quantity + 1;
      }

      state.Foods = [...currentFoods];
    },
    editItemFromBasket: (
      state,
      action: PayloadAction<{
        Food: FoodObj;
      }>,
    ) => {
      const {Food} = action.payload;
      let currentFoods: FoodObj[] = state.Foods;
      let existIndex = currentFoods.findIndex(
        x => x.UniqueId === Food.UniqueId,
      );
      if (existIndex !== -1) {
        currentFoods[existIndex] = {...Food};
      }

      state.Foods = [...currentFoods];
    },
    removeItemFromBasket: (
      state,
      action: PayloadAction<{
        Food: FoodObj;
      }>,
    ) => {
      const {Food} = action.payload;
      let currentFoods: FoodObj[] = state.Foods;
      let existIndex = currentFoods.findIndex(
        x => x.UniqueId === Food.UniqueId,
      );
      if (existIndex !== -1) {
        currentFoods.splice(existIndex, 1);
      }

      state.Foods = [...currentFoods];
    },
  },
});

export const {
  initBasket,
  addItemToBasket,
  editItemFromBasket,
  removeItemFromBasket,
} = orderSlice.actions;
export default orderSlice.reducer;
