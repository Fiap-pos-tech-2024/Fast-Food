import { Order } from '../entities/order'

export interface PaymentGateway {
    createPaymentLink(order: Order): Promise<string>
    getPaymentStatus(
        url: string
    ): Promise<{ id: string; status: string } | null>
}
