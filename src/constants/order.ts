export const ORDER_STATUS = {
    AWAITING_PAYMENT: 'AWAITING_PAYMENT',
    RECEIVED: 'RECEIVED',
    IN_PREPARATION: 'IN_PREPARATION',
    READY: 'READY',
    COMPLETED: 'COMPLETED',
}

export const ORDER_STATUS_LIST = [
    ORDER_STATUS.RECEIVED,
    ORDER_STATUS.IN_PREPARATION,
    ORDER_STATUS.READY,
    ORDER_STATUS.COMPLETED,
]

export const ERROR_STATUS_BY_MESSAGE: { [key: string]: number } = {
    'Order not found': 404,
    'Order already exists': 409,
    'Invalid order data': 400,
    'Invalid status provided': 400,
    'Product does not exist': 400,
    'Client does not exist': 400,
    'Order must have at least one item': 500,
}
