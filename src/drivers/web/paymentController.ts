import { Router, Request, Response } from 'express'
import { PaymentUseCase } from '../../useCases/payment'

export class PaymentController {
    private routes: Router

    constructor(private PaymentUseCase: PaymentUseCase) {
        this.routes = Router()
    }

    setupRoutes() {
        this.routes.post('/', this.createPayment.bind(this))
        this.routes.get('/:paymentId', this.getPayment.bind(this))
        this.routes.post('/webhook', this.paymentWebhook.bind(this))
        return this.routes
    }

    public async createPayment(req: Request, res: Response): Promise<void> {
        try {
            const payment = req.body
            const result = await this.PaymentUseCase.createPayment(payment)
            res.status(201).json(result)
        } catch (error) {
            console.log('Failed to create payment link', error)
            res.status(500).json({ error: 'Failed to create payment link' })
        }
    }

    public async getPayment(req: Request, res: Response): Promise<void> {
        try {
            const { paymentId } = req.params
            const result = await this.PaymentUseCase.getPayment(paymentId)
            if (!result) res.status(404).send('Payment not found')

            res.status(200).json(result)
        } catch (error) {
            console.log('Failed to get payment', error)
            res.status(500).json({ error: 'An unexpected error occurred' })
        }
    }

    public async paymentWebhook(req: Request, res: Response): Promise<void> {
        try {
            const webhookData = req.body
            console.log('webhookData', webhookData)
            await this.PaymentUseCase.handlePaymentWebhook(webhookData)
            res.status(200).send('Webhook processed successfully')
        } catch (error) {
            console.log('Failed to process webhook info', error)
            res.status(400).json({ error: 'Failed to process webhook info' })
        }
    }
}
