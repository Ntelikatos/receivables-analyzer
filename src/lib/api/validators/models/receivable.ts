import {z} from "zod";
import {ISODateSchema} from "@/lib/api/validators/common";

export const ReceivableSchema = z.object({
    reference: z.string(),
    currencyCode: z.string(),
    issueDate: ISODateSchema,
    openingValue: z.number().positive(),
    paidValue: z.number().positive(),
    dueDate: ISODateSchema,
    closedDate: ISODateSchema.optional().nullable(),  // optional
    cancelled: z.boolean().optional().nullable(), // optional
    debtorName: z.string(),
    debtorReference: z.string(),
    debtorAddress1: z.string().optional().nullable(),  // optional
    debtorAddress2: z.string().optional().nullable(),  // optional
    debtorTown: z.string().optional().nullable(),      // optional
    debtorState: z.string().optional().nullable(),     // optional
    debtorZip: z.string().optional().nullable(),       // optional
    debtorCountryCode: z.string(),
    debtorRegistrationNumber: z.string().optional().nullable(), // optional
})
    .refine((data) => new Date(data.issueDate).getTime() <= new Date(data.dueDate).getTime(),
        {message: "Issue date should be less or equal to due date"})
    .refine((data) => data.closedDate
            ? new Date(data.closedDate).getTime() >= new Date(data.issueDate).getTime()
            : true,
        {message: "Closed date should be greater or equal to issue date"})

export const ReceivablesSchema = ReceivableSchema.array()