export enum OrderStatus {
    RECEIVED = 'RECEIVED',
    IN_PREPARATION = 'IN_PREPARATION',
    READY = 'READY',
    COMPLETED = 'COMPLETED',
}

export class Order {
    constructor(
        public orderId: number,
        public status: OrderStatus,
        public userId: number | null,
        public cpf: number | null,
        public name: string | null,
        public email: string | null,
        public data: string,
        public total: number,
        public products: any,
        public payment: string
    ) {}
}
