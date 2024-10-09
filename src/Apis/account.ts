import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { baseUrl } from '../const';

// Define a service using a base URL and expected endpoints
export const accountApi = createApi({
  reducerPath: 'accountApi',
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
    headers: {
      'content-type': 'application/json',
    },
  }),
  endpoints: builder => ({
    login: builder.mutation<
      { Message: string; Data: any; Token: string },
      { email: string; password: string }
    >({
      query: body => ({
        url: '/api/login',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useLoginMutation } = accountApi;
