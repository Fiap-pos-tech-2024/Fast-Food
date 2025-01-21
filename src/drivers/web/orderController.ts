/* eslint-disable @typescript-eslint/no-unused-vars */
import { Router, Request, Response } from 'express'
import { OrderUseCase } from '../../useCases/order'
import { ORDER_STATUS_LIST } from '../../constants/order'

interface errorType {
    message: string
}

export class OrderController {
    private routes: Router
    constructor(private OrderUseCase: OrderUseCase) {
        this.routes = Router()
    }

    public setupRoutes() {
        this.routes.get('/status/active', this.listActiveOrders.bind(this))
        this.routes.get('/:id', this.getOrder.bind(this))
        this.routes.put('/:id', this.updateOrder.bind(this))
        this.routes.delete('/:id', this.deleteOrder.bind(this))
        this.routes.get('/', this.listOrders.bind(this))
        this.routes.post('/', this.createOrder.bind(this))
        this.routes.patch('/:id/status', this.updateOrderStatus.bind(this))
        return this.routes
    }

    /**
     * @swagger
     * /order:
     *   get:
     *     summary: Lista todos os pedidos
     *     tags: [Orders]
     *     responses:
     *       200:
     *         description: Lista de pedidos retornada com sucesso
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 type: object
     *                 properties:
     *                   idOrder:
     *                     type: string
     *                     description: ID do pedido
     *                   idClient:
     *                     type: string
     *                     description: ID do cliente
     *                   cpf:
     *                     type: string
     *                     description: CPF do cliente
     *                   name:
     *                     type: string
     *                     description: Nome do cliente
     *                   email:
     *                     type: string
     *                     description: E-mail do cliente
     *                   paymentId:
     *                     type: string
     *                     description: ID do pagamento
     *                   paymentLink:
     *                     type: string
     *                     description: Link do pagamento
     *                   status:
     *                     type: string
     *                     enum: [PENDING, RECEIVED, COMPLETED, CANCELED]
     *                     description: Status do pedido
     *                   value:
     *                     type: number
     *                     description: Valor total do pedido
     *                   itens:
     *                     type: array
     *                     items:
     *                       type: string
     *                       description: IDs dos produtos no pedido
     *       500:
     *         description: Erro interno ao buscar os pedidos
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   description: Mensagem de erro
     */
    public async listOrders(req: Request, res: Response) {
        try {
            const orders = await this.OrderUseCase.listOrders()
            res.status(200).json(orders)
        } catch (error) {
            res.status(500).json({ error: 'Error fetching orders' })
        }
    }

    /**
     * @swagger
     * /order:
     *   post:
     *     summary: Cria um novo pedido
     *     tags: [Orders]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               idOrder:
     *                 type: string
     *                 description: ID do pedido (opcional)
     *               idClient:
     *                 type: string
     *                 description: ID do cliente
     *               cpf:
     *                 type: string
     *                 description: CPF do cliente
     *               name:
     *                 type: string
     *                 description: Nome do cliente
     *               email:
     *                 type: string
     *                 description: E-mail do cliente
     *               paymentId:
     *                 type: string
     *                 description: ID do pagamento
     *               paymentLink:
     *                 type: string
     *                 description: Link do pagamento
     *               status:
     *                 type: string
     *                 enum: [PENDING, RECEIVED, COMPLETED, CANCELED]
     *                 description: Status do pedido
     *               value:
     *                 type: number
     *                 description: Valor total do pedido
     *               itens:
     *                 type: array
     *                 items:
     *                   type: string
     *                   description: IDs dos produtos no pedido
     *     responses:
     *       201:
     *         description: Pedido criado com sucesso
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                  id:
     *                     type: string
     *                     description: ID do pedido
     *                  message:
     *                      type: string
     *                      description: Mensagem de sucesso
     *       400:
     *         description: Pedido não criado
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   description: Mensagem de erro
     *       409:
     *         description: Pedido já existe
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   description: Mensagem de erro
     *       500:
     *         description: Erro interno do servidor
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   description: Mensagem de erro
     */
    public async createOrder(req: Request, res: Response) {
        try {
            const order = req.body
            if (!order) {
                res.status(404).json({ error: 'Order not created' })
            }

            const orderId = await this.OrderUseCase.createOrder(order)
            res.status(201).json({
                id: orderId,
                message: 'Order created successfully',
            })
        } catch (error) {
            const errorData = error as errorType
            const status_error: { [key: string]: number } = {
                'Order already exists': 409,
                'Product does not exist': 400,
                'Client does not exist': 400,
                'Order must have at least one item': 500,
            }

            const status_code = status_error[errorData.message] || 500
            const error_message = status_error[errorData.message]
                ? errorData.message
                : 'An unexpected error occurred'
            res.status(status_code).json({ error: error_message })
        }
    }

    /**
     * @swagger
     * /order/{id}:
     *   put:
     *     summary: Atualiza um pedido
     *     tags: [Orders]
     *     parameters:
     *       - name: id
     *         in: path
     *         required: true
     *         description: ID do pedido que será atualizado
     *         schema:
     *           type: string
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               idOrder:
     *                 type: string
     *                 description: ID do pedido
     *               idClient:
     *                 type: string
     *                 description: ID do cliente
     *               cpf:
     *                 type: string
     *                 description: CPF do cliente
     *               name:
     *                 type: string
     *                 description: Nome do cliente
     *               email:
     *                 type: string
     *                 description: E-mail do cliente
     *               paymentId:
     *                 type: string
     *                 description: ID do pagamento
     *               paymentLink:
     *                 type: string
     *                 description: Link do pagamento
     *               status:
     *                 type: string
     *                 enum: [PENDING, RECEIVED, COMPLETED, CANCELED]
     *                 description: Status do pedido
     *               value:
     *                 type: number
     *                 description: Valor total do pedido
     *               itens:
     *                 type: array
     *                 items:
     *                   type: string
     *                   description: IDs dos produtos no pedido
     *     responses:
     *       200:
     *         description: Pedido atualizado com sucesso
     *         content:
     *           text/plain:
     *             schema:
     *               type: string
     *       500:
     *         description: Erro interno do servidor
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   description: Mensagem de erro
     */
    public async updateOrder(req: Request, res: Response) {
        try {
            const orderId = req.params.id
            const updatedUserData = req.body
            await this.OrderUseCase.updateOrder(orderId, updatedUserData)
            res.status(200).send(`Order ${orderId} updated successfully`)
        } catch (error) {
            res.status(500).json({ error: 'An unexpected error occurred' })
        }
    }
    /**
     * @swagger
     * /order/{id}:
     *   delete:
     *     summary: Exclui um pedido
     *     tags: [Orders]
     *     parameters:
     *       - name: id
     *         in: path
     *         required: true
     *         description: ID do pedido que será excluído
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Pedido excluído com sucesso
     *         content:
     *           text/plain:
     *             schema:
     *               type: string
     *       500:
     *         description: Erro interno do servidor
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   description: Mensagem de erro
     */
    public async deleteOrder(req: Request, res: Response) {
        try {
            const orderId = req.params.id
            await this.OrderUseCase.deleteOrder(orderId)
            res.status(200).send(`Order ${orderId} deleted successfully`)
        } catch (error) {
            res.status(500).json({
                error: 'An unexpected error occurred',
            })
        }
    }

    /**
     * @swagger
     * /order/{id}:
     *   get:
     *     summary: Obtém os detalhes de um pedido
     *     tags: [Orders]
     *     parameters:
     *       - name: id
     *         in: path
     *         required: true
     *         description: ID do pedido que será consultado
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Pedido encontrado com sucesso
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 idOrder:
     *                   type: string
     *                   description: ID do pedido
     *                 idClient:
     *                   type: string
     *                   description: ID do cliente
     *                 cpf:
     *                   type: string
     *                   description: CPF do cliente
     *                 name:
     *                   type: string
     *                   description: Nome do cliente
     *                 email:
     *                   type: string
     *                   description: E-mail do cliente
     *               paymentId:
     *                 type: string
     *                 description: ID do pagamento
     *               paymentLink:
     *                 type: string
     *                 description: Link do pagamento
     *                 status:
     *                   type: string
     *                   enum: [PENDING, RECEIVED, COMPLETED, CANCELED]
     *                   description: Status do pedido
     *                 value:
     *                   type: number
     *                   description: Valor total do pedido
     *                 itens:
     *                   type: array
     *                   items:
     *                     type: string
     *                     description: IDs dos produtos no pedido
     *       404:
     *         description: Pedido não encontrado
     *         content:
     *           text/plain:
     *             schema:
     *               type: string
     *       500:
     *         description: Erro interno do servidor
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   description: Mensagem de erro
     */
    public async getOrder(req: Request, res: Response) {
        try {
            const orderId = req.params.id
            const orders = await this.OrderUseCase.getOrder(orderId)
            if (orders) {
                res.status(200).json(orders)
                return
            }
            res.status(404).send('Order not found')
        } catch (error) {
            res.status(500).json({ error: 'An unexpected error occurred' })
        }
    }
    /**
     * @swagger
     * /order/{id}/status:
     *   patch:
     *     summary: Atualiza o status de um pedido
     *     tags: [Orders]
     *     parameters:
     *       - name: id
     *         in: path
     *         required: true
     *         description: ID do pedido que será atualizado
     *         schema:
     *           type: string
     *       - name: status
     *         in: body
     *         required: true
     *         description: Novo status do pedido
     *         schema:
     *           type: object
     *           properties:
     *             status:
     *               type: string
     *               enum: ['RECEIVED','IN_PREPARATION','READY', 'COMPLETED']
     *     responses:
     *       200:
     *         description: Status do pedido atualizado com sucesso
     *         examples:
     *           message: "Order status 1 updated successfully"
     *       400:
     *         description: Status inválido
     *         examples:
     *           error: "Invalid status provided"
     *       500:
     *         description: Erro interno do servidor
     *         examples:
     *           error: "Erro detalhado sobre o problema"
     */

    public async updateOrderStatus(req: Request, res: Response): Promise<void> {
        const orderId = req.params.id
        const { status } = req.body

        if (!ORDER_STATUS_LIST.includes(status)) {
            res.status(400).json({ error: 'Invalid status provided' })
            return
        }

        try {
            await this.OrderUseCase.updateOrderStatus(orderId, status)
            res.status(200).send(`Order status ${orderId} updated successfully`)
        } catch (error) {
            res.status(500).json({ error })
        }
    }

    /**
     * @swagger
     * /order/active-orders:
     *   get:
     *     summary: Lista pedidos ativos e pagos
     *     description: Retorna apenas pedidos com status ativo (RECEIVED, IN_PREPARATION, READY) que já foram pagos.
     *     tags: [Orders]
     *     responses:
     *       200:
     *         description: Lista de pedidos ativos e pagos retornada com sucesso
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 type: object
     *                 properties:
     *                   idOrder:
     *                     type: string
     *                     description: ID do pedido
     *                     example: "order_123456"
     *                   idClient:
     *                     type: string
     *                     description: ID do cliente
     *                     example: "client_001"
     *                   cpf:
     *                     type: string
     *                     description: CPF do cliente
     *                     example: "000.000.000-00"
     *                   name:
     *                     type: string
     *                     description: Nome do cliente
     *                     example: "John Doe"
     *                   email:
     *                     type: string
     *                     description: E-mail do cliente
     *                     example: "john@example.com"
     *                   idPayment:
     *                     type: string
     *                     description: ID do pagamento
     *                     example: "payment_abc123"
     *                   status:
     *                     type: string
     *                     enum: [RECEIVED, IN_PREPARATION, READY]
     *                     description: Status do pedido
     *                     example: "IN_PREPARATION"
     *                   value:
     *                     type: number
     *                     description: Valor total do pedido
     *                     example: 29.90
     *                   itens:
     *                     type: array
     *                     items:
     *                       type: object
     *                       properties:
     *                         idProduct:
     *                           type: string
     *                           description: ID do produto no pedido
     *                           example: "product_001"
     *                         name:
     *                           type: string
     *                           description: Nome do produto
     *                           example: "Hambúrguer"
     *                         amount:
     *                           type: integer
     *                           description: Quantidade do produto
     *                           example: 2
     *                         unitValue:
     *                           type: number
     *                           description: Valor unitário do produto
     *                           example: 14.95
     *                         observation:
     *                           type: string
     *                           description: Observações sobre o produto
     *                           example: "Sem cebola"
     *       500:
     *         description: Erro interno ao buscar os pedidos ativos
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   description: Mensagem de erro
     *                   example: "Error fetching active orders"
     */
    public async listActiveOrders(req: Request, res: Response) {
        try {
            const activeOrders = await this.OrderUseCase.getActiveOrders()
            res.status(200).json(activeOrders)
        } catch (error) {
            res.status(500).json({ error: 'Error fetching active orders' })
        }
    }
}
