export const ReceivableSchema = {
    type: 'object',
    properties: {
        id: {
            type: 'integer',
        },
        reference: {
            type: 'string',
        },
        currencyCode: {
            type: 'string',
        },
        issueDate: {
            type: 'string',
        },
        openingValue: {
            type: 'number',
        },
        paidValue: {
            type: 'number',
        },
        dueDate: {
            type: 'string',
        },
        closedDate: {
            type: ['string', 'null'],
        },
        cancelled: {
            type: ['boolean', 'null'],
        },
        debtorName: {
            type: 'string',
        },
        debtorReference: {
            type: 'string',
        },
        debtorAddress1: {
            type: ['string', 'null'],
        },
        debtorAddress2: {
            type: ['string', 'null'],
        },
        debtorTown: {
            type: ['string', 'null'],
        },
        debtorState: {
            type: ['string', 'null'],
        },
        debtorZip: {
            type: ['string', 'null'],
        },
        debtorCountryCode: {
            type: 'string',
        },
        debtorRegistrationNumber: {
            type: ['string', 'null'],
        },
    }
}

export const ReceivablesSchema = {
    type: 'array',
    items: {
        ReceivableSchema
    }
}