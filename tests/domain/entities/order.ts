import { ORDER_STATUS } from '../../../src/constants/order'
import { Product } from '../../../src/domain/entities/product'

export class Order {
    constructor(
        public idOrder: string | null,
        public idClient: string | null,
        public cpf: string | null,
        public name: string | null,
        public email: string | null,
        public paymentId: string | null,
        public paymentLink: string | null,
        public status: string,
        public value: number,
        public items: Array<Product>
    ) {}

    static createMock(
        idOrder = '1',
        idClient = '1',
        cpf = '000.000.000-00',
        name = 'John Doe',
        email = 'john@example.com',
        paymentLink = null,
        paymentId = null,
        status = ORDER_STATUS.RECEIVED,
        value = 10,
        items = [
            {
                idProduct: 'Item 1',
                amount: 2,
                name: 'Item 1',
                unitValue: 1,
                category: '1',
                totalValue: 2,
                observation: '',
                createdAt: new Date(),
                updatedAt: new Date(),
                deletedAt: null,
                calculateTotalValue: () => 2,
            },
        ]
    ): Order {
        return new Order(
            idOrder,
            idClient,
            cpf,
            name,
            email,
            paymentId,
            paymentLink,
            status,
            value,
            items
        )
    }
}
