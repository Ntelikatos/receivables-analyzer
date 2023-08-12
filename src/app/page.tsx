'use client'

import {
    useCreateReceivablesMutation,
    useGetReceivablesQuery,
    useGetReceivablesSummaryStatisticsQuery
} from "@/redux/services/receivablesApi";
import {Receivable, ReceivableSummaryStatisticsResponse} from "@/app/api/@types";
import {v4 as uuidv4} from 'uuid';
import {Table, TableHeader, TableBody, TableColumn, TableRow, TableCell, getKeyValue} from "@nextui-org/table";
import {Spinner} from "@nextui-org/spinner";
import {useMemo} from "react";
import {Button} from "@nextui-org/button";
import {Chart as ChartJS, ArcElement, Tooltip, Legend} from 'chart.js';
import {Doughnut} from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Home() {
    const {data: receivables, isLoading: isLoadingReceivables} = useGetReceivablesQuery()
    const {data: summaryStatistics, isLoading: isLoadingSummaryStatistics} = useGetReceivablesSummaryStatisticsQuery()
    const [createReceivables, {isLoading: isLoadingCreateReceivables}] = useCreateReceivablesMutation()

    const receivablesDummyPayload: Receivable[] = [
        {
            "reference": uuidv4(),
            "currencyCode": "USD",
            "issueDate": "2023-02-22",
            "openingValue": 250,
            "paidValue": 100,
            "dueDate": "2023-03-05",
            "debtorName": "John Doe",
            "debtorReference": uuidv4(),
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

    const columns = [
        {
            key: "reference",
            label: "Reference",
        },
        {
            key: "debtorName",
            label: "Debtor Name",
        },
        {
            key: "debtorReference",
            label: "Debtor Reference",
        },
        {
            key: "issueDate",
            label: "Issue Date",
        },
        {
            key: "dueDate",
            label: "Due Date",
        },
        {
            key: "closedDate",
            label: "Closed Date",
        },
        {
            key: "currencyCode",
            label: "Currency Code",
        },
        {
            key: "openingValue",
            label: "Opening Value",
        },
        {
            key: "paidValue",
            label: "Paid Value",
        }
    ];

    const mappedReceivables = useMemo(() => {
        return receivables ? receivables.map((item) => {
            return {
                reference: item.reference,
                debtorName: item.debtorName,
                debtorReference: item.debtorReference,
                issueDate: item.issueDate,
                dueDate: item.dueDate,
                closedDate: item.closedDate,
                currencyCode: item.currencyCode,
                openingValue: item.openingValue,
                paidValue: item.paidValue
            }
        }) : []
    }, [receivables])

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <h1 className="mb-6 text-5xl">Receivables</h1>
            <div className="mb-6">
                <Table aria-label="Example table with dynamic content">
                    <TableHeader columns={columns}>
                        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
                    </TableHeader>
                    <TableBody
                        items={mappedReceivables ?? []}
                        isLoading={isLoadingReceivables}
                        loadingContent={<Spinner label="Loading..."/>}
                        emptyContent={!isLoadingReceivables ? "No receivables to display." : " "}
                    >
                        {(item) => (
                            <TableRow key={item.reference ?? new Date().getTime()}>
                                {(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <Button
                size="lg"
                color="primary"
                className="mb-6"
                isLoading={isLoadingCreateReceivables}
                onClick={() => createReceivables(receivablesDummyPayload)}
            >Create receivables</Button>

            <h1 className="mb-6 text-5xl">Receivables Summary Statistics</h1>
            <div className="mb-6">
                {isLoadingSummaryStatistics ? <Spinner/> : <Doughnut
                    data={{
                        labels: ['Open', 'Closed'],
                        datasets: [
                            {
                                // label: '# of Votes',
                                data: [
                                    (summaryStatistics as ReceivableSummaryStatisticsResponse).openInvoicesValue,
                                    (summaryStatistics as ReceivableSummaryStatisticsResponse).closedInvoicesValue
                                ],
                                backgroundColor: [
                                    'rgba(255, 99, 132, 0.5)',
                                    'rgba(54, 162, 235, 0.5)'
                                ],
                                borderColor: [
                                    'rgba(255, 99, 132, 1)',
                                    'rgba(54, 162, 235, 1)'
                                ],
                                borderWidth: 1,
                            },
                        ],
                    }}
                />}
            </div>

        </main>
    )
}
