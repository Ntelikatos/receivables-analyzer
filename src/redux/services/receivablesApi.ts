import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {Receivable} from "@/app/api/@types";

export const receivablesApi = createApi({
    tagTypes: ['RECEIVABLE'],
    reducerPath: 'receivableApi',
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NEXT_APP_API_URL ?? "http://localhost:3000/api"
    }),
    refetchOnFocus: true,
    endpoints: (builder) => ({
        getReceivables: builder.query<Receivable[], void>({
            query: () => `/receivables`,
            providesTags: ['RECEIVABLE'],
        }),
    }),
});

export const {
    useGetReceivablesQuery
} = receivablesApi