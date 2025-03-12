import { PaymentRepository } from '../domain/interface/paymentRepository'
import { OrderRepository } from '../domain/interface/orderRepository'
import { Payment } from '../domain/entities/payment'
import { PAYMENT_STATUS } from '../constants/payment'
import { ORDER_STATUS } from '../constants/order'
import { MercadoPagoUseCase } from './mercadoPago'

export class PaymentUseCase {
    private paymentRepository: PaymentRepository
    private orderRepository: OrderRepository
    private mercadoPagoUseCase: MercadoPagoUseCase

    constructor(
        paymentRepository: PaymentRepository,
        orderRepository: OrderRepository,
        mercadoPagoUseCase: MercadoPagoUseCase
    ) {
        this.orderRepository = orderRepository
        this.paymentRepository = paymentRepository
        this.mercadoPagoUseCase = mercadoPagoUseCase
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

        const accessData = await this.mercadoPagoUseCase.getUserToken()
        if (!accessData?.token || !accessData?.userId) {
            throw new Error('Failed to fetch QR code token')
        }

        const qrCodeLink = await this.mercadoPagoUseCase.generateQRCodeLink(
            accessData,
            payment.order
        )
        const QRCodePaymentLink =
            await this.mercadoPagoUseCase.convertQRCodeToImage(
                qrCodeLink.qr_data
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

        const mercadoPagoData = await this.mercadoPagoUseCase.getPaymentStatus(
            webhookData.resource
        )
        if (!mercadoPagoData) {
            throw new Error('Failed to get MercadoPago data')
        }

        const paymentId = mercadoPagoData.id
        const paymentStatus = mercadoPagoData.status.toUpperCase()

        const payment = await this.paymentRepository.getPayment(paymentId)
        if (!payment) {
            throw new Error('Payment not found')
        }

        await this.paymentRepository.updatePaymentStatus(
            paymentId,
            paymentStatus
        )

        if (paymentStatus === 'PAID') {
            await this.orderRepository.updateOrderStatus(
                paymentId,
                ORDER_STATUS.RECEIVED
            )
        }
    }
}
