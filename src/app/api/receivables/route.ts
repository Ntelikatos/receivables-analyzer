import {NextRequest, NextResponse} from "next/server";
import {prisma} from "@/lib/db/prisma";
import {z} from "zod";
import {fromZodError} from "zod-validation-error";

export const ISO8601RegX = /^(?:\d{4}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1\d|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)|\d{2}(?:0[48]|[2468][048]|[13579][26])-02-29)$/

export const ISODateSchema = z.string()
    .refine(
        (data) => data.match(ISO8601RegX),
        "Invalid date format (YYYY-MM-DD)"
    )

export const ReceivableSchema = z.object({
    reference: z.string(),
    currencyCode: z.string(),
    issueDate: ISODateSchema,
    openingValue: z.number().positive(),
    paidValue: z.number().positive(),
    dueDate: ISODateSchema,
    closedDate: ISODateSchema.optional().nullable(),
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
    .refine((data) => new Date(data.issueDate).getTime() <= new Date(data.dueDate).getTime(),
        {message: "Issue date should be less or equal to due date"})
    .refine((data) => data.closedDate
            ? new Date(data.closedDate).getTime() >= new Date(data.issueDate).getTime()
            : true,
        {message: "Closed date should be greater or equal to issue date"})

export type Receivable = z.infer<typeof ReceivableSchema> & { id?: number }

export type CommonResponse = { message: string };
export type ErrorResponse = { status: string, message: string };

export async function POST(req: NextRequest) {
    try {
        const payload: Receivable = await req.json()

        const validation = ReceivableSchema.safeParse(payload);

        if (!validation.success) {
            const validationError = fromZodError(validation.error)

            return NextResponse.json<ErrorResponse>({
                status: validationError.name,
                message: validationError.message
            }, {status: 400})
        }

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