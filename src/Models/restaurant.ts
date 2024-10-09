//https://transform.tools/json-to-typescript

export interface RestaurantObj {
  Name: string;
  Street: string;
  ShortAddress: string;
  Email: string;
  Phone: string;
  Fax: string;
  TimeZone: string;
  Tags: string;
  About: string;
  IsOpen: boolean;
}

export interface RestaurantParams {
  Name: string;
  Email: string;
  Phone: string;
  Fax: string;
  GoogleToken: string
}
