import { Product } from './product'
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
    public status: string
    public value: number
    public itens: Product[]

    constructor(order: Omit<Order, 'idOrder'> & { idOrder?: string }) {
        this.idOrder = order.idOrder || null
        this.idClient = order.idClient || null
        this.cpf = order.cpf || null
        this.name = order.name || null
        this.email = order.email || null
        this.idPayment = order.idPayment || null
        this.status = order.status
        this.itens = order.itens ?? []
        this.value = order.value
    }
}
