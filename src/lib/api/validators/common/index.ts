import {z} from "zod";
import {ISO8601RegX} from "@/lib/reusables";

export const ISODateSchema = z.string()
    .refine(
        (data) => data.match(ISO8601RegX),
        "Invalid date format (YYYY-MM-DD)"
    )