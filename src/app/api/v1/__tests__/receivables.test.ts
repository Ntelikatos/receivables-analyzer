/**
 * @jest-environment node
 */

import {GET} from '../receivables/route';
import {clearMockData, createMockData, getRecordsCount, mockRequestResponse} from "@/lib/testing";
import {matchers} from 'jest-json-schema';
import {ReceivablesSchema} from "@/lib/testing/schemas";

expect.extend(matchers);

describe('[GET] /api/v1/receivables (working properly)', () => {
    it('should return a successful response', async () => {
        const {req, res} = mockRequestResponse();
        const response = await GET(req, res);

        expect(response.status).toBe(200);
        expect(response.statusText).toEqual('OK');
    });

    it('should contain header content-type:application/json', async () => {
        const {req, res} = mockRequestResponse();
        const response = await GET(req, res);

        expect(response.headers.has('content-type')).toEqual(true);
        expect(response.headers.get('content-type')).toEqual('application/json');
    });
});

describe('[GET] /api/v1/receivables (can get records)', () => {
    beforeEach(async () =>
        await createMockData()
    )

    afterEach(async () =>
        await clearMockData()
    )

    it('should be able to get all receivables', async () => {
        const {req, res} = mockRequestResponse();
        const response = await GET(req, res);

        const body = await response.json()

        const recordsCount = await getRecordsCount()

        expect(body.length === recordsCount).toEqual(true);
    });

    it('should be able to get all receivables with correct schema', async () => {
        const {req, res} = mockRequestResponse();
        const response = await GET(req, res);

        const body = await response.json()

        expect(body).toMatchSchema(ReceivablesSchema);
    });
})