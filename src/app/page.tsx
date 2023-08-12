'use client'

import {
    useCreateReceivablesMutation,
    useGetReceivablesQuery,
    useGetReceivablesSummaryStatisticsQuery
} from "@/redux/services/receivablesApi";
import {Receivable} from "@/app/api/@types";
import {v4 as uuidv4} from 'uuid';

export default function Home() {
    const {data: receivables, isLoading: isLoadingReceivables} = useGetReceivablesQuery()
    const {data: summaryStatistics, isLoading: isLoadingSummaryStatistics} = useGetReceivablesSummaryStatisticsQuery()
    const [createReceivables, {isLoading: isLoadingCreateReceivables}] = useCreateReceivablesMutation()

    const receivablesDummyPayload: Receivable[] = [
        {
            "reference": "asdasd",
            "currencyCode": "USD",
            "issueDate": "2023-02-22",
            "openingValue": 250,
            "paidValue": 100,
            "dueDate": "2023-03-05",
            "debtorName": "John Doe",
            "debtorReference": "asdasdad",
            "debtorCountryCode": "gr"
        },
        {
            "reference": uuidv4(),
            "currencyCode": "USD",
            "issueDate": "2023-02-22",
            "openingValue": 250,
            "paidValue": 100,
            "dueDate": "2023-03-05",
            "closedDate": "2023-03-06",
            "debtorName": "John Doe",
            "debtorReference": uuidv4(),
            "debtorCountryCode": "gr"
        }
    ]

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <h1>Receivables</h1>
            <p>{isLoadingReceivables ? 'Loading...' : JSON.stringify(receivables)}</p>
            <h1>Receivables Summary Statistics</h1>
            <p>{isLoadingSummaryStatistics ? 'Loading...' : JSON.stringify(summaryStatistics)}</p>
            <button onClick={() => createReceivables(receivablesDummyPayload)}>Create Receivables</button>
        </main>
    )
}
