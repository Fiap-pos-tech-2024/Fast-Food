import { Order } from '../domain/entities/order'
import { MongoPaymentRepository } from '../drivers/database/paymentModel'

export class PaymentUseCase {
    constructor(private paymentRepository: MongoPaymentRepository) {}

    async processPayment(order: Order, paymentData: any) {
        return { success: true, paymentId: '12345', orderId: order.idOrder }
    }

    async confirmPayment(paymentLinkId: string) {
        return true
    }
}
