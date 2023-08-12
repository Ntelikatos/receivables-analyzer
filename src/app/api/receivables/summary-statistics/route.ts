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

        const summaryStatistics = {
            totalInvoices,
            totalOpenInvoices,
            totalClosedInvoices,
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