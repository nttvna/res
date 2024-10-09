import {configureStore} from '@reduxjs/toolkit';
import accountReducer from './accountSlice';
import {accountApi} from '../Apis/account';
import {ordertApi} from '../Apis/orders';
import {settingApi} from '../Apis/settings';
import orderReducer from './orderSlice';
import {restaurantApi} from '../Apis/restaurant';

export const store = configureStore({
  reducer: {
    Account: accountReducer,
    Order: orderReducer,
    [accountApi.reducerPath]: accountApi.reducer,
    [ordertApi.reducerPath]: ordertApi.reducer,
    [restaurantApi.reducerPath]: restaurantApi.reducer,
    [settingApi.reducerPath]: settingApi.reducer,
  },

  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({serializableCheck: false}).concat([
      accountApi.middleware,
      ordertApi.middleware,
      restaurantApi.middleware,
      settingApi.middleware,
    ]),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
