import {createMocks, RequestMethod} from 'node-mocks-http'
import {NextRequest, NextResponse} from "next/server";
import {Receivable} from "@/app/api/@types";
import {prisma} from "@/lib/db/prisma";
import {v4 as uuidv4} from "uuid";
import {faker} from "@faker-js/faker";
import {Prisma} from ".prisma/client";

export const mockData: Receivable[] = [
    {
        "reference": uuidv4(),
        "currencyCode": faker.finance.currencyCode(),
        "issueDate": "2023-02-22",
        "openingValue": 130.23,
        "paidValue": 130.23,
        "dueDate": "2023-03-05",
        "closedDate": "2023-03-06",
        "debtorName": faker.person.fullName(),
        "debtorReference": uuidv4(),
        "debtorCountryCode": faker.location.countryCode()
    }
]

export function mockRequestResponse(method: RequestMethod = 'GET') {
    const {
        req,
        res,
    }: { req: NextRequest; res: NextResponse<Receivable[]> } = createMocks({method});

    return {req, res};
}

export async function createMockData() {
    return await Promise.all(
        mockData.map(
            async (entry) =>
                await prisma.receivable.create({
                    data: entry,
                })
        )
    ) as Receivable[]
}

export async function getRecordsCount() {
    const result = await prisma.receivable.aggregate({
        _count: true
    })

    return result._count
}

export async function clearMockData() {
    const result =
        await prisma.receivable.deleteMany({
            where: {reference: {in: mockData.map((item) => item.reference)}}
        })

    await prisma.$queryRaw(
        Prisma.sql`
            UPDATE main.sqlite_sequence
            SET seq = (SELECT COUNT(id) FROM main.Receivable)
            WHERE name = 'Receivable'
        `
    );
}