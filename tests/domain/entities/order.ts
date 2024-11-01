export class Order {
    constructor(
        public idOrder: string | null,
        public idClient: string | null,
        public cpf: string | null,
        public name: string | null,
        public email: string | null,
        public idPayment: string | null,
        public status: string,
        public value: number,
        public itens: Array<Object>
    ) {}

    static createMock(
        idOrder = null,
        idPayment = null,
        idClient = '1',
        cpf = '000.000.000-00',
        name = 'John Doe',
        email = 'john@example.com',
        status = 'RECEIVED',
        value = 10,
        itens = [{ idProduct: 'Item 1' }, { idProduct: 'Item 2' }]
    ): Order {
        return new Order(
            idOrder,
            idPayment,
            idClient,
            cpf,
            name,
            email,
            status,
            value,
            itens
        )
    }
}
