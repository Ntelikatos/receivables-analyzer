import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";

export const receivablesApi = createApi({
    tagTypes: ['RECEIVABLE'],
    reducerPath: 'receivableApi',
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NEXT_APP_API_URL ?? "http://localhost:3000/api"
    }),
    refetchOnFocus: true,
    endpoints: (builder) => ({}),
});

export const {} = receivablesApi