import { OrderStatus, ProductId } from '../../../src/domain/entities/order'

export class Order {
    constructor(
        public idOrder: string | null,
        public idClient: string | null,
        public cpf: string | null,
        public name: string | null,
        public email: string | null,
        public idPayment: string | null,
        public status: OrderStatus,
        public value: number,
        public itens: Array<ProductId>
    ) {}

    static createMock(
        idOrder = '1',
        idClient = '1',
        cpf = '000.000.000-00',
        name = 'John Doe',
        email = 'john@example.com',
        idPayment = null,
        status = OrderStatus.RECEIVED,
        value = 10,
        itens = [{ idProduct: 'Item 1' }, { idProduct: 'Item 2' }]
    ): Order {
        return new Order(
            idOrder,
            idClient,
            cpf,
            name,
            email,
            idPayment,
            status,
            value,
            itens
        )
    }
}
