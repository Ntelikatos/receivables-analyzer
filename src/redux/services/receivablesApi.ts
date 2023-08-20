import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {CommonResponse, Receivable, ReceivableSummaryStatisticsResponse} from "@/app/api/@types";

export const receivablesApi = createApi({
    tagTypes: ['RECEIVABLE', 'RECEIVABLE_STATISTICS'],
    reducerPath: 'receivableApi',
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api/v1"
    }),
    refetchOnFocus: true,
    endpoints: (builder) => ({
        getReceivables: builder.query<Receivable[], void>({
            query: () => `/receivables`,
            providesTags: ['RECEIVABLE'],
        }),
        createReceivable: builder.mutation<CommonResponse, Receivable>({
            query: (payload) => ({
                url: `/receivables`,
                method: 'POST',
                body: payload,
            }),
            async onQueryStarted(payload, {dispatch, queryFulfilled}) {
                const patchResult = dispatch(
                    receivablesApi.util.updateQueryData('getReceivables', undefined, (draft) => {
                        // The `draft` is Immer-wrapped and can be "mutated" like in createSlice
                        Object.assign(draft, payload)
                    })
                )

                try {
                    await queryFulfilled
                } catch {
                    patchResult.undo()
                }
            },
            invalidatesTags: ['RECEIVABLE', 'RECEIVABLE_STATISTICS'],
        }),
        getReceivablesSummaryStatistics: builder.query<ReceivableSummaryStatisticsResponse, void>({
            query: () => `/receivables/summary-statistics`,
            providesTags: ['RECEIVABLE_STATISTICS'],
        }),
        createReceivables: builder.mutation<CommonResponse, Receivable[]>({
            query: (payload) => ({
                url: `/receivables/batch`,
                method: 'POST',
                body: payload,
            }),
            async onQueryStarted(payload, {dispatch, queryFulfilled}) {
                const patchResult = dispatch(
                    receivablesApi.util.updateQueryData('getReceivables', undefined, (draft) => {
                        // The `draft` is Immer-wrapped and can be "mutated" like in createSlice
                        draft.push(...payload)
                    })
                )

                try {
                    await queryFulfilled
                } catch {
                    patchResult.undo()
                }
            },
            invalidatesTags: ['RECEIVABLE', 'RECEIVABLE_STATISTICS'],
        })
    }),
});

export const {
    useGetReceivablesQuery,
    useGetReceivablesSummaryStatisticsQuery,
    useCreateReceivableMutation,
    useCreateReceivablesMutation,
} = receivablesApi