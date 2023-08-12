import {NextRequest, NextResponse} from "next/server";
import {ErrorResponse, ReceivableSummaryStatisticsResponse} from "@/app/api/@types";
import {prisma} from "@/lib/db/prisma";
import StatusCode from "status-code-enum";

/**
 * @swagger
 * /receivables/statistics:
 *   get:
 *     summary: Retrieves a summary of receivables statistics
 *     description: Fetches aggregate statistics about the receivables, including count, total value, average value, maximum value, and minimum value for both open and closed invoices.
 *     responses:
 *       200:
 *         description: Successful retrieval of receivables statistics
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/ReceivableSummaryStatisticsResponse'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/ErrorResponse'
 */
export async function GET(req: NextRequest) {
    try {
        const totalInvoices = await prisma.receivable.count();

        const totalOpenInvoices = await prisma.receivable.count({
            where: {
                AND: [
                    {closedDate: null},
                    {cancelled: null}
                ]
            }
        });

        const totalClosedInvoices = totalInvoices - totalOpenInvoices;

        const openInvoicesAggregate = await prisma.receivable.aggregate({
            _sum: {openingValue: true},
            _avg: {openingValue: true},
            _max: {openingValue: true},
            _min: {openingValue: true},
            where: {
                AND: [
                    {closedDate: null},
                    {cancelled: null} // TODO: check also for false
                ]
            }
        });

        const closedInvoicesAggregate = await prisma.receivable.aggregate({
            _sum: {paidValue: true},
            _avg: {paidValue: true},
            _max: {paidValue: true},
            _min: {paidValue: true},
            where: {
                AND: [
                    {closedDate: {not: null}},
                    {cancelled: null} // TODO: check also for false
                ]
            }
        });

        const summaryStatistics: ReceivableSummaryStatisticsResponse = {
            totalInvoices,
            totalOpenInvoices,
            totalClosedInvoices,
            openInvoicesValue: openInvoicesAggregate._sum.openingValue ?? 0,
            closedInvoicesValue: closedInvoicesAggregate._sum.paidValue ?? 0,
            averageOpenInvoiceValue: openInvoicesAggregate._avg.openingValue ?? 0,
            averageClosedInvoiceValue: closedInvoicesAggregate._avg.paidValue ?? 0,
            largestOpenInvoice: openInvoicesAggregate._max.openingValue ?? 0,
            smallestOpenInvoice: openInvoicesAggregate._min.openingValue ?? 0,
            largestClosedInvoice: closedInvoicesAggregate._max.paidValue ?? 0,
            smallestClosedInvoice: closedInvoicesAggregate._min.paidValue ?? 0
        }

        return NextResponse.json<ReceivableSummaryStatisticsResponse>(summaryStatistics, {headers: {"Content-Type": "application/json"}})
    } catch (error) {
        // @ts-ignore
        console.error(error?.message);
        return NextResponse.json<ErrorResponse>({
            status: "InternalServerError",
            message: 'Server error!'
        }, {status: StatusCode.ServerErrorInternal})
    }
}