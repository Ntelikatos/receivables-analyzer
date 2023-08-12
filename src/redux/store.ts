import {configureStore} from '@reduxjs/toolkit';
import {receivablesApi} from './services/receivablesApi';
import {setupListeners} from "@reduxjs/toolkit/query";

export const store = configureStore({
    reducer: {
        [receivablesApi.reducerPath]: receivablesApi.reducer,
    },
    devTools: process.env.NODE_ENV !== 'production',
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({}).concat([receivablesApi.middleware]),
});

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
