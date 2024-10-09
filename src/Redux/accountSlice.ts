import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

// Define a type for the slice state
interface AccountState {
  UserId: number;
  FirstName: string;
  LastName: string;
  RoleId: number;
  Email: string;
  RestaurantName: string;
  RestaurantId: number;
  DefaultLangId: number;
  Token: string;
  fbEmail: string;
  fbPassword: string;
  restaurantTime: Date;
  TimeZone: string;
  Manager: string;
}

// Define the initial state using that type
const initialState: AccountState = {
  UserId: 0,
  FirstName: '',
  LastName: '',
  RoleId: 0,
  Email: '',
  RestaurantName: '',
  RestaurantId: 0,
  DefaultLangId: 0,
  Token: '',
  fbEmail: '',
  fbPassword: '',
  restaurantTime: new Date(),
  TimeZone: '',
  Manager: '123456'
};

export const accountSlice = createSlice({
  name: 'Account',
  initialState,
  reducers: {
    userLogin: (
      state,
      action: PayloadAction<{
        UserId: number;
        FirstName: string;
        LastName: string;
        RoleId: number;
        Email: string;
        RestaurantName: string;
        RestaurantId: number;
        DefaultLangId: number;
        Token: string;
        fbEmail: string;
        fbPassword: string;
        RestaurantTime: string;
        TimeZone: string;
        Manager: string;
      }>,
    ) => {
      const {
        UserId,
        FirstName,
        LastName,
        RoleId,
        Email,
        RestaurantName,
        RestaurantId,
        DefaultLangId,
        Token,
        fbEmail,
        fbPassword,
        RestaurantTime,
        TimeZone,
        Manager,
      } = action.payload;
      state.UserId = UserId;
      state.FirstName = FirstName;
      state.LastName = LastName;
      state.RoleId = RoleId;
      state.Email = Email;
      state.RestaurantName = RestaurantName;
      state.RestaurantId = RestaurantId;
      state.DefaultLangId = DefaultLangId;
      state.Token = Token;
      state.fbEmail = fbEmail;
      state.fbPassword = fbPassword;
      state.restaurantTime = new Date(RestaurantTime);
      state.TimeZone = TimeZone;
      state.Manager=Manager;
    },
    userLogOut: state => {
      state.UserId = 0;
      state.FirstName = '';
      state.LastName = '';
      state.RoleId = 0;
      state.Email = '';
      state.RestaurantName = '';
      state.RestaurantId = 0;
      state.DefaultLangId = 0;
      state.Token = '';
      state.fbEmail = '';
      state.fbPassword = '';
      state.restaurantTime = new Date();
      state.TimeZone = '';
      state.Manager='123456';
    },
    updateRestaurantName: (
      state,
      action: PayloadAction<{ RestaurantName: string }>,
    ) => {
      const { RestaurantName } = action.payload;
      state.RestaurantName = RestaurantName;
    },
  },
});

export const { userLogin, userLogOut, updateRestaurantName } =
  accountSlice.actions;
export default accountSlice.reducer;
