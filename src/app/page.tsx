'use client'

import {useGetReceivablesQuery} from "@/redux/services/receivablesApi";

export default function Home() {
    const {data: receivables, isLoading: isLoadingReceivables} = useGetReceivablesQuery()

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <h1>Receivables</h1>
            <p>{isLoadingReceivables ? 'Loading...' : JSON.stringify(receivables)}</p>
        </main>
    )
}
