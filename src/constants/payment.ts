export const PAYMENT_STATUS = {
    AWAITING: 'AWAITING',
    PAID: 'PAID',
    FAILURE: 'FAILURE',
}

export const ERROR_STATUS_BY_MESSAGE: { [key: string]: number } = {
    'Payment not found': 404,
}
