/* eslint-disable @typescript-eslint/no-unused-vars */
import { Router, Request, Response } from 'express'
import { PaymentUseCase } from '../../useCases/payment'

export class PaymentController {
    private routes: Router
    constructor(private PaymentUseCase: PaymentUseCase) {
        this.routes = Router()
    }

    setupRoutes() {
        this.routes.post('/', this.createPayment.bind(this))
        this.routes.get('/:id', this.getPayment.bind(this))
        this.routes.post('/receiver', this.paymentReceiver.bind(this))
        this.routes.get('/:id/check', this.checkPaymentStatus.bind(this))
        return this.routes
    }

    /**
     * @swagger
     * /payment:
     *   post:
     *     summary: Cria um link de pagamento
     *     tags: [Payment]
     *     description: Cria um novo link de pagamento com base nos dados fornecidos.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               order:
     *                 type: object
     *                 properties:
     *                   idOrder:
     *                     type: string
     *                     example: "12345"
     *                   idClient:
     *                     type: string
     *                     example: "67890"
     *                   cpf:
     *                     type: string
     *                     example: "123.456.789-00"
     *                   name:
     *                     type: string
     *                     example: "João Silva"
     *                   email:
     *                     type: string
     *                     example: "joao.silva@example.com"
     *                   status:
     *                     type: string
     *                     example: "WAITING_PAYMENT"
     *                   value:
     *                     type: number
     *                     example: 100.00
     *                   itens:
     *                     type: array
     *                     items:
     *                       type: object
     *                       properties:
     *                         id:
     *                           type: string
     *                           example: "123"
     *                         name:
     *                           type: string
     *                           example: "Produto Exemplo"
     *                         price:
     *                           type: number
     *                           example: 50.00
     *                         quantity:
     *                           type: number
     *                           example: 2
     *               total:
     *                 type: number
     *                 example: 100.00
     *     responses:
     *       '201':
     *         description: Link de pagamento criado com sucesso.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 id:
     *                   type: string
     *                   example: "12345"
     *       '500':
     *         description: Erro interno ao criar o link de pagamento.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   example: "Failed to create payment link"
     */
    async createPayment(req: Request, res: Response) {
        try {
            const result = await this.PaymentUseCase.createPayment(req.body)
            res.status(201).json(result)
        } catch (error) {
            res.status(500).json({ error: 'Failed to create payment link' })
        }
    }

    /**
     * @swagger
     * /payment/{id}:
     *   get:
     *     summary: Obtém os detalhes de um pagamento
     *     tags: [Payment]
     *     description: Recupera as informações de um pagamento com base no ID fornecido.
     *     parameters:
     *       - name: id
     *         in: path
     *         required: true
     *         description: O ID do pagamento que deve ser recuperado.
     *         schema:
     *           type: string
     *           example: "123454567891011"
     *     responses:
     *       '200':
     *         description: Detalhes do pagamento encontrados com sucesso.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 order:
     *                   type: object
     *                   properties:
     *                     idOrder:
     *                       type: string
     *                       example: "12345"
     *                     idClient:
     *                       type: string
     *                       example: "67890"
     *                     cpf:
     *                       type: string
     *                       example: "123.456.789-00"
     *                     name:
     *                       type: string
     *                       example: "João Silva"
     *                     email:
     *                       type: string
     *                       example: "joao.silva@example.com"
     *                     idPayment:
     *                       type: string
     *                       example: "12345678910"
     *                     status:
     *                       type: string
     *                       example: "RECEIVED"
     *                     value:
     *                       type: number
     *                       example: 100.00
     *                     itens:
     *                       type: array
     *                       items:
     *                         type: object
     *                         properties:
     *                           id:
     *                             type: string
     *                             example: "123"
     *                           name:
     *                             type: string
     *                             example: "Produto Exemplo"
     *                           price:
     *                             type: number
     *                             example: 50.00
     *                           quantity:
     *                             type: number
     *                             example: 2
     *                 paymentId:
     *                   type: string
     *                   example: "12345678910"
     *                 paymentLink:
     *                   type: string
     *                   example: "http://payment.link/12345"
     *                 status:
     *                   type: string
     *                   example: "PAID"
     *                 total:
     *                   type: number
     *                   example: 100.00
     *       '404':
     *         description: Pagamento não encontrado.
     *       '500':
     *         description: Erro inesperado ao recuperar o pagamento.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   example: "An unexpected error occurred"
     */
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

    async getPaymentData(merchantUrl: string, accessDataToken: string) {
        const response = await fetch(merchantUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: accessDataToken,
            },
        })
        const result = (await response.json()) as {
            external_reference: string
            order_status: string
        }
        return {
            orderId: result.external_reference,
            status: result.order_status,
        }
    }

    async paymentReceiver(req: Request, res: Response) {
        console.log('PARAMS', req.params)
        console.log('BODY', req.body)

        const token =
            'Bearer TEST-1824214370596611-011710-800a45987428cdff374d5c90415c07bb-2211997372'
        if (req.body.topic === 'merchant_order') {
            const paymentData = await this.getPaymentData(
                req.body.resource,
                token
            )

            if (paymentData.orderId) {
                await this.PaymentUseCase.updatePaymentStatus(
                    paymentData.orderId,
                    paymentData.status
                )
            }
        }

        res.status(200).send('Dados recebidos com sucesso')
    }

    /**
     * @swagger
     * /payment/{id}/status:
     *   get:
     *     summary: Verifica o status de um pagamento
     *     tags: [Payment]
     *     description: Recupera o status de um pagamento com base no ID fornecido.
     *     parameters:
     *       - name: id
     *         in: path
     *         required: true
     *         description: O ID do pagamento para verificar o status.
     *         schema:
     *           type: string
     *           example: "1234567891011"
     *     responses:
     *       '200':
     *         description: Status do pagamento recuperado com sucesso.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status:
     *                   type: string
     *                   example: "PAID"
     *       '404':
     *         description: Pagamento não encontrado.
     *       '500':
     *         description: Falha ao verificar o status do pagamento.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   example: "Failed to check payment status"
     */
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
