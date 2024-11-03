/* eslint-disable @typescript-eslint/no-unused-vars */
import { Router, Request, Response } from 'express'
import { PaymentUseCase } from '../../useCases/payment'
import { Payment } from '../../domain/entities/payment'

export class PaymentController {
    private routes: Router

    constructor(private PaymentUseCase: PaymentUseCase) {
        this.routes = Router()
    }

    setupRoutes() {
        const router = Router()
        router.post('/', this.createPayment.bind(this))
        router.get('/:id', this.getPayment.bind(this))
        router.get('/:id/check', this.checkPaymentStatus.bind(this))
        return router
    }

    async createPayment(req: Request, res: Response) {
        try {
            const result = await this.PaymentUseCase.createPayment(req.body)
            res.status(201).json(result)
        } catch (error) {
            res.status(500).json({ error: 'Failed to create payment link' })
        }
    }

    public async getPayment(req: Request, res: Response) {
        try {
            const paymentId = req.params.id
            const payment = await this.PaymentUseCase.getPayment(paymentId)
            if (payment) {
                res.status(200).json(payment)
                return
            }
            res.status(404).send('Payment not found')
        } catch (error) {
            res.status(500).json({ error: 'An unexpected error occurred' })
        }
    }

    async checkPaymentStatus(req: Request, res: Response) {
        try {
            const paymentId = req.params.id

            const paymentStatus =
                await this.PaymentUseCase.checkPaymentStatus(paymentId)
            res.status(200).json(paymentStatus)
        } catch (error) {
            res.status(500).json({ error: 'Failed to check payment status' })
        }
    }
}
