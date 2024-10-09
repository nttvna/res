import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {baseUrl} from '../const';
import {RootState} from '../Redux/store';
import {RestaurantObj, RestaurantParams} from '../Models/restaurant';

export const restaurantApi = createApi({
  reducerPath: 'restaurantApi',
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
    prepareHeaders: (headers, {getState}) => {
      const token = (getState() as RootState).Account.Token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
    },
  }),
  tagTypes: ['RestaurantDetail'],
  endpoints: builder => ({
    getRestaurantInfo: builder.query<
      {Message: string; Data: RestaurantObj},
      void
    >({
      query: () => ({
        url: `/api/get-restaurant-info`,
        method: 'GET',
      }),
      providesTags: ['RestaurantDetail'],
    }),
    openRestaurant: builder.query<{Message: string}, {isClose: boolean}>({
      query: ({isClose}) => ({
        url: `/api/open-restaurant/${isClose}`,
        method: 'GET',
      }),
    }),
    updateRestaurant: builder.mutation<{Message: string}, RestaurantParams>({
      query: body => ({
        url: `/api/update-restaurant-info`,
        method: 'PUT',
        body,
        headers: {
          gtoken: body.GoogleToken,
        },
      }),
      invalidatesTags: ['RestaurantDetail'],
    }),
    handleCrash: builder.mutation<
      {Message: string},
      {
        Error: string;
        DeviceName: string;
        DeviceIp: string;
        ApiLevel: string;
      }
    >({
      query: body => ({
        url: `/api/handle-crash`,
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const {
  useGetRestaurantInfoQuery,
  useLazyOpenRestaurantQuery,
  useUpdateRestaurantMutation,
  useHandleCrashMutation,
} = restaurantApi;
