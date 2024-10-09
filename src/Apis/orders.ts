import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {baseUrl} from '../const';
import {RootState} from '../Redux/store';
import {
  OrderItem,
  categoryObjView,
  lastOrderObject,
  orderDetailObj,
} from '../Models/order';
import {OrderState} from '../Models/redux';

export const ordertApi = createApi({
  reducerPath: 'orderApi',
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
    prepareHeaders: (headers, {getState}) => {
      const token = (getState() as RootState).Account.Token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
    },
  }),
  tagTypes: ['OrderDetail'],
  endpoints: builder => ({
    getLastOrder: builder.query<
      {Message: string; Data: lastOrderObject[]},
      {selectedDate: string; orderType: string}
    >({
      query: ({selectedDate, orderType}) => ({
        url: `/api/get-last-order/${selectedDate}/${orderType}`,
        method: 'GET',
      }),
      providesTags: ['OrderDetail'],
    }),
    getOrderDetail: builder.query<
      {Message: string; OrderDetail: orderDetailObj},
      {orderId: number}
    >({
      query: ({orderId}) => ({
        url: `/api/get-order-detail/${orderId}`,
        method: 'GET',
      }),
      providesTags: ['OrderDetail'],
    }),
    getOrderDetailByCode: builder.query<
      {Message: string; OrderDetail: orderDetailObj},
      {orderCode: string}
    >({
      query: ({orderCode}) => ({
        url: `/api/get-order-detail-bycode/${orderCode}`,
        method: 'GET',
      }),
      providesTags: ['OrderDetail'],
    }),
    getOrderItems: builder.query<
      {Message: string; Data: OrderItem[]},
      {orderCode: string}
    >({
      query: ({orderCode}) => ({
        url: `/api/get-order-items/${orderCode}`,
        method: 'GET',
      }),
      providesTags: ['OrderDetail'],
    }),
    changeOrderStatus: builder.query<
      {Message: string},
      {orderCode: string; orderStatus: string}
    >({
      query: ({orderCode, orderStatus}) => ({
        url: `/api/change-order-status/${orderCode}/${orderStatus}`,
        method: 'GET',
      }),
      providesTags: ['OrderDetail'],
    }),
    getCateForNewOrder: builder.query<
      {Message: string; Data: categoryObjView[]},
      {resTime: string}
    >({
      query: ({resTime}) => ({
        url: `/api/get-categories-for-new-order/${resTime}`,
        method: 'GET',
      }),
    }),
    createOrder: builder.mutation<{Message: string; Data: number}, OrderState>({
      query: body => ({
        url: `/api/create-order`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['OrderDetail'],
    }),
  }),
});

export const {
  useLazyGetLastOrderQuery,
  useGetOrderDetailQuery,
  useLazyChangeOrderStatusQuery,
  useLazyGetOrderItemsQuery,
  useLazyGetOrderDetailByCodeQuery,
  useLazyGetCateForNewOrderQuery,
  useCreateOrderMutation,
} = ordertApi;
