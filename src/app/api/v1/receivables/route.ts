import {NextRequest, NextResponse} from "next/server";
import {prisma} from "@/lib/db/prisma";
import {fromZodError} from "zod-validation-error";
import {CommonResponse, ErrorResponse, Receivable} from "@/app/api/@types";
import {ReceivableSchema} from "@/lib/api/validators/models/receivable";
import StatusCode from "status-code-enum";

/**
 * @swagger
 * /receivables:
 *   get:
 *     summary: Retrieves a list of receivables
 *     description: Returns a list of all receivables available in the system.
 *     responses:
 *       200:
 *         description: Successful retrieval of receivables
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/Receivable'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/ErrorResponse'
 */
export async function GET(req: NextRequest, res: NextResponse) {
    try {
        const receivables: Receivable[] = await prisma.receivable.findMany()

        return NextResponse.json<Receivable[]>(receivables, {
            statusText: 'OK',
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

/**
 * @swagger
 * /receivables:
 *   post:
 *     summary: Creates a new receivable
 *     description: Validates the provided data and creates a new receivable in the system.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/Receivable'
 *     responses:
 *       201:
 *         description: Receivable successfully created
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