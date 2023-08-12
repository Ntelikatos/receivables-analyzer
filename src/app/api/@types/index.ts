import {z} from "zod";
import {ReceivableSchema} from "@/lib/api/validators/models/receivable";

export type Receivable = z.infer<typeof ReceivableSchema> & { id?: number }

export type CommonResponse = { message: string };
export type ErrorResponse = { status: string, message: string };

