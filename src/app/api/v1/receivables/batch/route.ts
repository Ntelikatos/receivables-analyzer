import {NextRequest, NextResponse} from "next/server";
import {CommonResponse, ErrorResponse, Receivable} from "@/app/api/@types";
import {ReceivablesSchema} from "@/lib/api/validators/models/receivable";
import {fromZodError} from "zod-validation-error";
import {prisma} from "@/lib/db/prisma";
import StatusCode from "status-code-enum";

/**
 * @swagger
 * /receivables/bulk:
 *   post:
 *     summary: Creates multiple receivables
 *     description: Validates the provided array of data and creates multiple receivables in the system.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/definitions/Receivable'
 *     responses:
 *       201:
 *         description: Receivables successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/CommonResponse'
 *       400:
 *         description: Bad Request - Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/ErrorResponse'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/ErrorResponse'
 */
export async function POST(req: NextRequest) {
    try {
        const payload: Receivable[] = await req.json()

        const validation = ReceivablesSchema.safeParse(payload);

        if (!validation.success) {
            const validationError = fromZodError(validation.error)

            return NextResponse.json<ErrorResponse>({
                status: validationError.name,
                message: validationError.message
            }, {status: StatusCode.ClientErrorBadRequest})
        }

        const result = await Promise.all(
            payload.map(
                async (entry) =>
                    await prisma.receivable.create({
                        data: entry,
                    })
            )
        )

        return NextResponse.json<CommonResponse>(
            {
                message: `${payload.length} receivable${payload.length > 1 ? 's' : ''} created successfully`
            },
            {
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