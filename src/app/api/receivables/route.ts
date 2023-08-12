import {NextRequest, NextResponse} from "next/server";
import {prisma} from "@/lib/db/prisma";
import {z} from "zod";

export const ReceivableSchema = z.object({
    reference: z.string(),
    currencyCode: z.string(),
    issueDate: z.string(),
    openingValue: z.number().positive(),
    paidValue: z.number().positive(),
    dueDate: z.string(),
    closedDate: z.string().optional().nullable(),
    cancelled: z.boolean().optional().nullable(),
    debtorName: z.string(),
    debtorReference: z.string(),
    debtorAddress1: z.string().optional().nullable(),
    debtorAddress2: z.string().optional().nullable(),
    debtorTown: z.string().optional().nullable(),
    debtorState: z.string().optional().nullable(),
    debtorZip: z.string().optional().nullable(),
    debtorCountryCode: z.string(),
    debtorRegistrationNumber: z.string().optional().nullable(),
})

export type Receivable = z.infer<typeof ReceivableSchema> & { id?: number }

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