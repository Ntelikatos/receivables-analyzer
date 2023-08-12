import {NextRequest, NextResponse} from "next/server";
import {ErrorResponse} from "@/app/api/@types";
import {prisma} from "@/lib/db/prisma";
import StatusCode from "status-code-enum";

export async function GET(req: NextRequest) {
    try {
        const totalInvoices = await prisma.receivable.count();

        const totalOpenInvoices = await prisma.receivable.count({
            where: {closedDate: null}
        });

        const totalClosedInvoices = totalInvoices - totalOpenInvoices;

        const openInvoicesAggregate = await prisma.receivable.aggregate({
            _sum: {openingValue: true},
            _avg: {openingValue: true},
            _max: {openingValue: true},
            _min: {openingValue: true},
            where: {closedDate: null}
        });

        const closedInvoicesAggregate = await prisma.receivable.aggregate({
            _sum: {paidValue: true},
            _avg: {paidValue: true},
            _max: {paidValue: true},
            _min: {paidValue: true},
            where: {closedDate: {not: null}}
        });

        const summaryStatistics = {
            totalInvoices,
            totalOpenInvoices,
            totalClosedInvoices,
            openInvoicesValue: openInvoicesAggregate._sum.openingValue,
            closedInvoicesValue: closedInvoicesAggregate._sum.paidValue,
            averageOpenInvoiceValue: openInvoicesAggregate._avg.openingValue,
            averageClosedInvoiceValue: closedInvoicesAggregate._avg.paidValue,
            largestOpenInvoice: openInvoicesAggregate._max.openingValue,
            smallestOpenInvoice: openInvoicesAggregate._min.openingValue,
            largestClosedInvoice: closedInvoicesAggregate._max.paidValue,
            smallestClosedInvoice: closedInvoicesAggregate._min.paidValue
        }

        return NextResponse.json(summaryStatistics, {headers: {"Content-Type": "application/json"}})
    } catch (error) {
        // @ts-ignore
        console.error(error?.message);
        return NextResponse.json<ErrorResponse>({
            status: "InternalServerError",
            message: 'Server error!'
        }, {status: StatusCode.ServerErrorInternal})
    }
}