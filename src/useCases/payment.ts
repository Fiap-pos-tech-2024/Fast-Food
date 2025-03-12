import { PaymentRepository } from '../domain/interface/paymentRepository'
import { OrderRepository } from '../domain/interface/orderRepository'
import { Payment } from '../domain/entities/payment'
import { PAYMENT_STATUS } from '../constants/payment'
import { ORDER_STATUS } from '../constants/order'
import { PaymentGateway } from '../domain/interface/paymentGateway'

export class PaymentUseCase {
    private paymentRepository: PaymentRepository
    private orderRepository: OrderRepository
    private paymentGateway: PaymentGateway

    constructor(
        paymentRepository: PaymentRepository,
        orderRepository: OrderRepository,
        paymentGateway: PaymentGateway
    ) {
        this.orderRepository = orderRepository
        this.paymentRepository = paymentRepository
        this.paymentGateway = paymentGateway
    }

    async createPayment(payment: Payment): Promise<{ id: string }> {
        if (!payment.order.idOrder) {
            throw new Error('Order ID is required')
        }
        const existingOrder = await this.orderRepository.getOrder(
            payment.order.idOrder
        )
        if (!existingOrder) {
            throw new Error('Order does not exist')
        }

        const QRCodePaymentLink = await this.paymentGateway.createPaymentLink(
            payment.order
        )

        const paymentCreated = await this.paymentRepository.createPayment({
            ...payment,
            paymentLink: QRCodePaymentLink,
            paymentId: payment.order.idOrder,
            status: PAYMENT_STATUS.AWAITING,
            total: payment.order.value,
        })

        await this.orderRepository.updateOrder(payment.order.idOrder, {
            ...payment.order,
            paymentLink: QRCodePaymentLink,
            paymentId: paymentCreated.id,
        })

        return paymentCreated
    }

    async getPayment(paymentId: string): Promise<Payment | null> {
        const payment = await this.paymentRepository.getPayment(paymentId)
        if (!payment) {
            throw new Error('Payment not found')
        }
        return payment
    }

    async handlePaymentWebhook(webhookData: {
        resource: string
        topic: string
    }): Promise<void> {
        if (webhookData.topic !== 'merchant_order') return

        const paymentStatusData = await this.paymentGateway.getPaymentStatus(
            webhookData.resource
        )
        if (!paymentStatusData) throw new Error('Payment not found')

        const paymentUrl = webhookData.resource
        const payment = await this.paymentRepository.getPayment(paymentUrl)
        if (!payment) throw new Error('Payment not found')

        await this.paymentRepository.updatePaymentStatus(
            paymentStatusData.id,
            paymentStatusData.status
        )

        if (paymentStatusData.status === 'PAID') {
            await this.orderRepository.updateOrderStatus(
                paymentStatusData.id,
                ORDER_STATUS.RECEIVED
            )
        }
    }
}
