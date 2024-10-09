import { RouteProp } from '@react-navigation/native';
import { foodObjView } from './Models/order';
import { FoodObj } from './Models/redux';

export type RootStackParamList = {
  Home: { rand?: number; OrderId?: number };
  OrderDetail: { OrderId: number };
  Login: { rand?: number };
  Settings: undefined;
  RestaurantInfo: undefined;
  AppInfo: undefined;
  Restaurant: undefined;
  CategoryType: undefined;
  Categories: undefined;
  CreateTrans: { rand?: number };
  SelectFoodOptions: {
    data: foodObjView | null;
    currentFoodInBasket: FoodObj | null;
  };
  Reports: {
    data: foodObjView | null;
    currentFoodInBasket: FoodObj | null;
  };
  ManagerLogin: undefined;
};

export type RootRouteProps<RouteName extends keyof RootStackParamList> =
  RouteProp<RootStackParamList, RouteName>;
