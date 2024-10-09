import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { CategoryReportItem, CategoryTypeItem, UpdateCategoryTypeItem } from '../Models/setting';
import { RootState } from '../Redux/store';
import { baseUrl } from '../const';

export const settingApi = createApi({
    reducerPath: 'settingApi',
    baseQuery: fetchBaseQuery({
        baseUrl: baseUrl,
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).Account.Token;
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
        },
    }),
    endpoints: builder => ({
        getCategoryType: builder.query<{ Message: string; Data: CategoryTypeItem[] }, void>({
            query: () => ({
                url: `/api/get-categorytypes`,
                method: 'GET',
            }),
        }),
        deleteCategoryType: builder.query<{ Message: string }, { Id: number }>({
            query: ({ Id }) => ({
                url: `/api/delete-categorytype/${Id}`,
                method: 'GET',
            }),
        }),
        updateCategoryType: builder.mutation<{ Message: string }, UpdateCategoryTypeItem>({
            query: (body) => ({
                url: `/api/update-categorytype`,
                method: 'POST',
                body
            }),
        }),
        getCategory: builder.query<{ Message: string; Data: CategoryReportItem[] }, void>({
            query: () => ({
                url: `/api/get-categories`,
                method: 'GET',
            }),
        }),
        removeCategory: builder.query<{ Message: string }, { Id: number }>({
            query: ({ Id }) => ({
                url: `/api/delete-category/${Id}`,
                method: 'GET',
            }),
        }),
    }),
});

export const {
    useLazyGetCategoryTypeQuery,
    useLazyDeleteCategoryTypeQuery,
    useUpdateCategoryTypeMutation,
    useLazyGetCategoryQuery,
    useLazyRemoveCategoryQuery
} = settingApi;
