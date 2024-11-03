import { PAYMENT_STATUS } from '../constants/payment'
import { Payment } from '../domain/entities/payment'
import { OrderRepository } from '../domain/interface/orderRepository'
import { PaymentRepository } from '../domain/interface/paymentRepository'

export class PaymentUseCase {
    constructor(
        private paymentRepository: PaymentRepository,
        private orderRepository: OrderRepository
    ) {}

    async createPayment(payment: Payment): Promise<{id: string}> {
        if (!payment.order.idOrder) {
            throw new Error('Order ID is required')
        }

        const existingOrder = await this.orderRepository.getOrder(
            payment.order.idOrder
        )
        if (!existingOrder) {
            throw new Error('Order does not exist')
        }

        const fakePaymentLink = `https://fake-payment-link.com/${payment.order.idOrder}`
        return this.paymentRepository.createPayment({
            ...payment,
            paymentLink: fakePaymentLink,
            status: PAYMENT_STATUS.AWAITING,
        })
    }

    async getPayment(id: string): Promise<Payment | null> {
        return this.paymentRepository.getPayment(id)
    }

    async checkPaymentStatus(id: string): Promise<{ status: string } | null> {
        const resultStatusPayment =
            await this.paymentRepository.checkPaymentStatus(id)
        if (resultStatusPayment?.status === PAYMENT_STATUS.PAID) {
            const paidOrder = await this.getPayment(id)
            if (paidOrder?.order?.idOrder) {
                this.orderRepository.updatePayment(
                    paidOrder?.order?.idOrder,
                    id
                )
                return resultStatusPayment
            }
            throw new Error('Order not found')
        }
        return resultStatusPayment
    }
}
