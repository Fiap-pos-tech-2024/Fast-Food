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
    /**
     * @swagger
     * /payment:
     *   post:
     *     summary: Cria um novo pagamento
     *     tags: [Payment]
     *     description: Cria um pagamento contendo um link de pagamento do tipo QR CODE para o cliente com base nas informações do pedido.
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
     *                     example: "678adc35ed21b00d8e815de5"
     *                   idClient:
     *                     type: string
     *                     example: "678aafe9825ee5d0791e4344"
     *                   cpf:
     *                     type: string
     *                     example: "01234567896"
     *                   name:
     *                     type: string
     *                     example: "John Doe"
     *                   email:
     *                     type: string
     *                     example: "john@teste.com"
     *                   status:
     *                     type: string
     *                     example: "WAITING_PAYMENT"
     *                   value:
     *                     type: number
     *                     example: 10
     *                   items:
     *                     type: array
     *                     items:
     *                       type: object
     *                       properties:
     *                         idProduct:
     *                           type: string
     *                           example: "1"
     *                         name:
     *                           type: string
     *                           example: "Coca-Cola"
     *                         observation:
     *                           type: string
     *                           example: "Sem gelo"
     *                         unitValue:
     *                           type: number
     *                           example: 10
     *                         price:
     *                           type: number
     *                           example: 20
     *                         amount:
     *                           type: number
     *                           example: 2
     *     responses:
     *       201:
     *         description: Link de pagamento criado com sucesso
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 id:
     *                   type: string
     *                   example: '678adc35ed21b00d8e815de5'
     *       500:
     *         description: Erro interno ao criar o pagamento
     */

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

    /**
     * @swagger
     * /payment/{paymentId}:
     *   get:
     *     summary: Obtém detalhes de um pagamento
     *     tags: [Payment]
     *     description: Retorna informações detalhadas sobre um pagamento específico, incluindo dados do pedido, status do pagamento e o link de pagamento.
     *     parameters:
     *       - in: path
     *         name: paymentId
     *         required: true
     *         description: ID do pagamento para obter os detalhes
     *         schema:
     *           type: string
     *           example: "678adc35ed21b00d8e815de5"
     *     responses:
     *       200:
     *         description: Detalhes do pagamento obtidos com sucesso
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
     *                       example: "678adc35ed21b00d8e815de5"
     *                     idClient:
     *                       type: string
     *                       example: "678aafe9825ee5d0791e4344"
     *                     cpf:
     *                       type: string
     *                       example: "01234567896"
     *                     name:
     *                       type: string
     *                       example: "John Doe"
     *                     email:
     *                       type: string
     *                       example: "john@teste.com"
     *                     status:
     *                       type: string
     *                       example: "WAITING_PAYMENT"
     *                     value:
     *                       type: number
     *                       example: 10
     *                     items:
     *                       type: array
     *                       items:
     *                         type: object
     *                         properties:
     *                           idProduct:
     *                             type: string
     *                             example: "1"
     *                           name:
     *                             type: string
     *                             example: "Coca-Cola"
     *                           observation:
     *                             type: string
     *                             example: "Sem gelo"
     *                           unitValue:
     *                             type: number
     *                             example: 10
     *                           price:
     *                             type: number
     *                             example: 20
     *                           amount:
     *                             type: number
     *                             example: 2
     *                 paymentId:
     *                   type: string
     *                   example: "678adc35ed21b00d8e815de5"
     *                 paymentLink:
     *                   type: string
     *                   example: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAANQAAADUCAYAAADk3g0YAAAAAkl..."
     *                 status:
     *                   type: string
     *                   example: "paid"
     *                 total:
     *                   type: number
     *                   example: 10
     *       404:
     *         description: Pagamento não encontrado
     *       500:
     *         description: Erro interno ao obter detalhes do pagamento
     */
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

    /**
     * @swagger
     * /payment/webhook:
     *   post:
     *     summary: Recebe e processa informações de webhook de pagamento
     *     tags: [Payment]
     *     description: Rota para processar as notificações enviadas pelo sistema de pagamento. O corpo da requisição inclui url de consulta dos detalhes do pagamento e o tópico da notificação.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               resource:
     *                 type: string
     *                 example: "https://api.mercadolibre.com/merchant_orders/27361530909"
     *               topic:
     *                 type: string
     *                 example: "merchant_order"
     *     responses:
     *       200:
     *         description: Webhook processado com sucesso
     *       400:
     *         description: Erro ao processar o webhook
     */
    public async paymentWebhook(req: Request, res: Response): Promise<void> {
        try {
            const webhookData = req.body
            await this.PaymentUseCase.handlePaymentWebhook(webhookData)
            res.status(200).send('Webhook processed successfully')
        } catch (error) {
            console.log('Failed to process webhook info', error)
            res.status(400).json({ error: 'Failed to process webhook info' })
        }
    }
}
