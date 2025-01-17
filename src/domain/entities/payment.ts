import { Order } from './order'

export class Payment {
    constructor(
        public order: Order,
        public paymentId: string | null,
        public paymentLink: string,
        public status: string,
        public total: number
    ) {}
}
