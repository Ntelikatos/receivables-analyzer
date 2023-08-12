import {NextRequest, NextResponse} from "next/server";
import {prisma} from "@/lib/db/prisma";
import {fromZodError} from "zod-validation-error";
import {CommonResponse, ErrorResponse, Receivable} from "@/app/api/@types";
import {ReceivableSchema} from "@/lib/api/validators/models/receivable";

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