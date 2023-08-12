import {NextRequest, NextResponse} from "next/server";
import {prisma} from "@/lib/db/prisma";

export type Receivable = {
    reference: string,
    currencyCode: string,
    issueDate: string,
    openingValue: number,
    paidValue: number,
    dueDate: string,
    closedDate?: string,
    cancelled: boolean,
    debtorName: string,
    debtorReference: string,
    debtorAddress1?: string,
    debtorAddress2?: string,
    debtorTown?: string,
    debtorState?: string,
    debtorZip?: string,
    debtorCountryCode: string,
    debtorRegistrationNumber?: string
}

export type CommonResponse = { message: string };
export type ErrorResponse = { status: string, message: string };

export async function POST(req: NextRequest) {
    try {
        const payload: Receivable = await req.json()

        const result =
            await prisma.receivable.create({
                data: payload,
            })

        return NextResponse.json<CommonResponse>({message: "Receivable created successfully"}, {
            status: 201,
            headers: {"Content-Type": "application/json"}
        })
    } catch (error) {
        // @ts-ignore
        console.error(error?.message);
        return NextResponse.json<ErrorResponse>({
            status: "InternalServerError",
            message: 'Server error!'
        }, {status: 201})
    }
}