export enum OrderStatus {
    RECEIVED = 'RECEIVED',
    IN_PREPARATION = 'IN_PREPARATION',
    READY = 'READY',
    COMPLETED = 'COMPLETED',
}

export interface ProductId {
    idProduct: string
}

export class Order {
    public idOrder: string | null
    public idClient: string | null
    public cpf: string | null
    public name: string | null
    public email: string | null
    public idPayment: string | null
    public status: OrderStatus
    public value: number
    public itens: ProductId[]

    constructor(order: Order) {
        this.idOrder = order.idOrder
        this.idClient = order.idClient
        this.cpf = order.cpf
        this.name = order.name
        this.email = order.email
        this.idPayment = order.idPayment
        this.status = order.status
        this.itens = order.itens ?? []
        this.value = order.value
    }
}
