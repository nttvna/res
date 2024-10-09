export interface FoodObj {
  UniqueId: number; //for edit item in basket
  FoodId: number;
  FoodName: string;
  FoodPrice: number;
  Quantity: number;
  FoodOptions: ModifyObj[];
}

export interface ModifyObj {
  ItemId: number;
  ItemName: string;
  ItemPrice: number;
  GroupId: number;
}

export interface OrderState {
  RestaurantId: number;
  RestaurantTime: string;
  OrderType: string;
  Foods: FoodObj[];
  Discount: number;
  Tip: number;
  Tax: number;
}

export interface SelectModifyObj {
  itemId: number;
  groupId: number;
}
