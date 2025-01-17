import QRCode from 'qrcode'
import { PAYMENT_STATUS } from '../constants/payment'
import { Order } from '../domain/entities/order'
import { Payment } from '../domain/entities/payment'
import { Product } from '../domain/entities/product'
import { OrderRepository } from '../domain/interface/orderRepository'
import { PaymentRepository } from '../domain/interface/paymentRepository'

export class PaymentUseCase {
    constructor(
        private paymentRepository: PaymentRepository,
        private orderRepository: OrderRepository
    ) {}

    async getUserToken(): Promise<{ token: string; userId: number } | null> {
        console.log(process.env.MERCADO_PAGO_API)
        const url = `${process.env.MERCADO_PAGO_API}/oauth/token`
        const data = {
            client_secret: process.env.MERCADO_PAGO_CLIENT_SECRET,
            client_id: process.env.MERCADO_PAGO_CLIENT_ID,
            grant_type: 'client_credentials',
            test_token: 'true',
        }

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
            const result = (await response.json()) as {
                token: string
                access_token: string
                token_type: string
                user_id: number
            }
            return {
                token: `${result.token_type} ${result.access_token}`,
                userId: result.user_id,
            }
        } catch (error) {
            console.error('Erro na requisição:', error)
            throw new Error('Failed to fetch QR code token')
        }
    }

    async convertQRCodeToImage(qrData: string): Promise<string> {
        try {
            return QRCode.toDataURL(qrData, {
                width: 300,
                type: 'image/png',
            })
        } catch (error) {
            console.log(error)
            throw new Error('Erro ao gerar QR code: ' + error)
        }
    }

    async generateQRCodeLink(
        accessData: { token: string; userId: number },
        order: Order
    ) {
        const url = `${process.env.MERCADO_PAGO_QR_CODE_API}/${accessData.userId}/pos/Loja1/qrs`

        const data = {
            external_reference: order.idOrder,
            title: 'Product order',
            description: 'FastFood sale',
            notification_url:
                'https://7996-152-254-159-137.ngrok-free.app/payment/receiver',
            total_amount: order.value,
            items: order.items.map((item: Product) => {
                return {
                    sku_number: item.idProduct,
                    category: 'marketplace',
                    title: item.name,
                    description: item.observation,
                    unit_price: item.unitValue,
                    unit_measure: 'unit',
                    total_amount: item.amount * item.unitValue,
                    quantity: item.amount,
                }
            }),
        }
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: accessData.token,
                    'X-Idempotency-Key': order.idOrder ?? '',
                },
                body: JSON.stringify(data),
            })
            const result = (await response.json()) as { qr_data: string }
            return result
        } catch (error) {
            console.error('Erro na requisição:', error)
            throw new Error('Failed to fetch QR code token')
        }
    }

    async generateQRCode(order: Order) {
        const accessData = await this.getUserToken()
        if (!accessData?.token || !accessData?.userId) {
            throw new Error('Failed to fetch QR code token')
        }

        const qrCodeLink = await this.generateQRCodeLink(accessData, order)

        return this.convertQRCodeToImage(qrCodeLink.qr_data)
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

        const QRCodePaymentLink = await this.generateQRCode(payment.order)
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

    async getPayment(id: string): Promise<Payment | null> {
        return this.paymentRepository.getPayment(id)
    }

    async updatePaymentStatus(orderId: string, paymentStatus: string) {
        const existingOrder = await this.orderRepository.getOrder(orderId)
        if (!existingOrder) {
            throw new Error('Order does not exist')
        }

        await this.orderRepository.updateOrderStatus(orderId, paymentStatus)
        return this.paymentRepository.updatePaymentStatus(
            orderId,
            paymentStatus
        )
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
