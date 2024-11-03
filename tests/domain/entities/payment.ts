import { Order } from './order'

export class Payment {
    constructor(
        public order: Order,
        public paymentId: string,
        public paymentLink: string,
        public status: string,
        public total: number
    ) {}

    static createMock(
        order = Order.createMock(),
        paymentId = '2',
        paymentLink = 'some link',
        status = 'STATUS',
        total = 10
    ): Payment {
        return new Payment(order, paymentId, paymentLink, status, total)
    }
}
