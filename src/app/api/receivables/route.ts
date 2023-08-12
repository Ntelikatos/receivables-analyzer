import {NextRequest, NextResponse} from "next/server";
import {prisma} from "@/lib/db/prisma";
import {fromZodError} from "zod-validation-error";
import {CommonResponse, ErrorResponse, Receivable} from "@/app/api/@types";
import {ReceivableSchema} from "@/lib/api/validators/models/receivable";
import StatusCode from "status-code-enum";

export async function GET(req: NextRequest) {
    try {
        const receivables: Receivable[] = await prisma.receivable.findMany()

        return NextResponse.json<Receivable[]>(receivables, {headers: {"Content-Type": "application/json"}})
    } catch (error) {
        // @ts-ignore
        console.error(error?.message);
        return NextResponse.json<ErrorResponse>({
            status: "InternalServerError",
            message: 'Server error!'
        }, {status: StatusCode.ServerErrorInternal})
    }
}

export async function POST(req: NextRequest) {
    try {
        const payload: Receivable = await req.json()

        const validation = ReceivableSchema.safeParse(payload);

        if (!validation.success) {
            const validationError = fromZodError(validation.error)

            return NextResponse.json<ErrorResponse>({
                status: validationError.name,
                message: validationError.message
            }, {status: StatusCode.ClientErrorBadRequest})
        }

        const result =
            await prisma.receivable.create({
                data: payload,
            })

        return NextResponse.json<CommonResponse>({message: "Receivable created successfully"}, {
            status: StatusCode.SuccessCreated,
            headers: {"Content-Type": "application/json"}
        })
    } catch (error) {
        // @ts-ignore
        console.error(error?.message);
        return NextResponse.json<ErrorResponse>({
            status: "InternalServerError",
            message: 'Server error!'
        }, {status: StatusCode.ServerErrorInternal})
    }
}