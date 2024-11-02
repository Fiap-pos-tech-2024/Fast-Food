import { Router, Request, Response } from 'express'
import { PaymentUseCase } from '../../useCases/payment'
import { Order } from '../../domain/entities/order'

export class PaymentController {
    constructor(private paymentUseCase: PaymentUseCase) {}

    setupRoutes() {
        const router = Router()
        router.post('/create-payment-link', this.createPaymentLink.bind(this))
        router.post('/check-payment-status', this.checkPaymentStatus.bind(this))
        return router
    }

    async createPaymentLink(req: Request, res: Response) {
        try {
            const { orderData, total } = req.body
            const order = new Order(orderData)

            // Criação de um link fake de pagamento
            const fakePaymentLink = `https://fake-payment-link.com/${order.idOrder}`

            // Retorna o link fake de pagamento
            res.status(201).json({
                success: true,
                paymentLink: fakePaymentLink,
                orderId: order.idOrder,
                total,
            })
        } catch (error) {
            res.status(500).json({ error: 'Failed to create payment link' })
        }
    }

    async checkPaymentStatus(req: Request, res: Response) {
        try {
            const { paymentLinkId } = req.body

            // Aqui simulamos a confirmação do pagamento
            const paymentConfirmed = true // Pode usar lógica real se integrado com Mercado Pago

            if (paymentConfirmed) {
                await this.paymentUseCase.confirmPayment(paymentLinkId)

                res.status(200).json({
                    success: true,
                    message: 'Payment confirmed. Order sent to the kitchen.',
                })
            } else {
                res.status(200).json({
                    success: false,
                    message: 'Payment not confirmed yet.',
                })
            }
        } catch (error) {
            res.status(500).json({ error: 'Failed to check payment status' })
        }
    }
}
