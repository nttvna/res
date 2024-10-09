//https://transform.tools/json-to-typescript

export interface lastOrderObject {
  Id: number;
  Code: string;
  OrderDate: string | null;
  FirstName: string;
  LastName: string;
  SubTotal: number;
  PromotionTotal: number;
  PromotionDetail: any;
  Tax: number;
  Total: number;
  Status: string;
  Type: string;
  IsActive: boolean;
  CustomerId: number;
  Source: number;
  DeliveryStreet: string;
  DeliveryLat: string;
  DeliveryLong: string;
  DeliveryDate: string | null;
  DeliveryFromTime: string | null;
  DeliveryToTime: string | null;
  DeliveryTime: string;
  SelectedFoods: string;
}

export interface orderDetailObj {
  OrderId: number;
  ResId: number;
  ResName: string;
  ResAddress: string;
  ShortAddress: string;
  ResPhone: string;
  ResEmail: string;
  ResNote: string;
  ResLogo: string;
  CusName: string;
  CusPhone: string;
  CusEmail: string;
  CusAddress: string;
  DeliverNote: string;
  PaymentType: string;
  CardName: string;
  CardType: string;
  CardNumber: string;
  OrderCode: string;
  OrderTime: string;
  DeliverTime: any;
  DeliveryTimeFrom: any;
  DeliveryTimeTo: any;
  OrderStatus: string;
  OrderItems: OrderItem[];
  OrderTimeStr: string;
  DeliverTimeStr: any;
  DeliveryFeeForCustomer: number;
  DeliveryFeeForDeliver: number;
  CommissionFee: number;
  Tax: number;
  SubTotal: number;
  Total: number;
  Tip: number;
  DeliverName: any;
  RatingDeliverByCustomer: any;
  RatingRestaurantByCustomer: any;
  Type: string;
  ServiceFeeForCustomer: number;
  FoodImageUrl: string;
  PaymentTypeId: number;
}

export interface OrderItem {
  FoodId: number;
  FoodName: string;
  //Options: any
  Extras: Extra[];
  Quanlity: number;
  FoodPrice: number;
  Tax: number;
}

export interface Extra {
  Id: number;
  Name: string;
  Price: number;
  PriceId: number;
  Checked: boolean;
  GroupName: any;
  GroupActive: any;
  Maximum: number;
  Minimum: number;
  IsRequired: boolean;
  OptionImgUrl: any;
  Quantity: number;
}

export interface categoryObjView {
  CategoryId: number;
  CategoryName: string;
  CategoryImage: string;
  Foods: foodObjView[];
}

export interface foodObjView {
  FoodId: number;
  FoodName: string;
  FoodDescription: string;
  FoodPrice?: number;
  FoodImage: string;
  ModifyGroups: modifyGroupObjView[];
}

export interface modifyGroupObjView {
  GroupId: number;
  GroupName: string;
  IsRequired: boolean;
  Maximum: number;
  Minimum: number;
  ItemModifies: modifyObjView[];
}

export interface modifyObjView {
  ItemModifyId: number;
  ItemName: string;
  ItemPrice: number;
  ItemImgUrl: string;
}
