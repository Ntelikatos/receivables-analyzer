import {z} from "zod";
import {ReceivableSchema} from "@/lib/api/validators/models/receivable";

export type Receivable = z.infer<typeof ReceivableSchema> & { id?: number }

export type ReceivableSummaryStatisticsResponse = {
    totalInvoices?: number
    totalOpenInvoices?: number
    totalClosedInvoices?: number
    openInvoicesValue?: number,
    closedInvoicesValue?: number,
    averageOpenInvoiceValue?: number,
    averageClosedInvoiceValue?: number,
    largestOpenInvoice?: number,
    smallestOpenInvoice?: number,
    largestClosedInvoice?: number,
    smallestClosedInvoice?: number
}

export type CommonResponse = { message: string };
export type ErrorResponse = { status: string, message: string };

