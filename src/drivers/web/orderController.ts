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
        this.routes.put('/:id', this.updateOrder.bind(this))
        this.routes.delete('/:id', this.deleteOrder.bind(this))
        this.routes.get('/:id', this.getOrder.bind(this))
        this.routes.get('/', this.listOrders.bind(this))
        this.routes.post('/', this.createOrder.bind(this))
        this.routes.patch('/:id/status', this.updateOrderStatus.bind(this))
        return this.routes
    }

    public async listOrders(req: Request, res: Response) {
        try {
            const orders = await this.OrderUseCase.listOrders()
            res.status(200).json(orders)
        } catch (error) {
            console.error(error)
            res.status(500).json({ error: 'Error fetching orders' })
        }
    }
    public async createOrder(req: Request, res: Response) {
        try {
            const order = req.body
            if (!order) {
                res.status(404).json({ error: 'Order not created' })
            }
            await this.OrderUseCase.createOrder(order)
            res.status(201).send('Order created successfullyfully')
        } catch (error) {
            const errorData = error as errorType
            const status_error: { [key: string]: number } = {
                'Order already exists': 409,
            }

            const status_code = status_error[errorData.message] || 500
            const error_message = status_error[errorData.message]
                ? errorData.message
                : 'An unexpected error occurred'
            res.status(status_code).json({ error: error_message })
        }
    }

    public async updateOrder(req: Request, res: Response) {
        try {
            const orderId = req.params.id
            const updatedUserData = req.body
            await this.OrderUseCase.updateOrder(orderId, updatedUserData)
            res.status(200).send(`Order ${orderId} updated successfully`)
        } catch (error) {
            console.error(error)
            res.status(500).json({ error: 'An unexpected error occurred' })
        }
    }

    public async deleteOrder(req: Request, res: Response) {
        try {
            const orderId = req.params.id
            await this.OrderUseCase.deleteOrder(orderId)
            res.status(200).send(`Order ${orderId} deleted successfully`)
        } catch (error) {
            console.error(error)
            res.status(500).json({ error: 'An unexpected error occurred' })
        }
    }

    public async getOrder(req: Request, res: Response) {
        try {
            const orderId = req.params.id
            const orders = await this.OrderUseCase.getOrder(orderId)
            if (orders) {
                res.status(200).json(orders)
            }
            res.status(404).send('Order not found')
        } catch (error) {
            console.error(error)
            res.status(500).json({ error: 'An unexpected error occurred' })
        }
    }

    /**
     * @swagger
     * /orders/:id/status:
     *   put:
     *     summary: Update order status
     *     tags:
     *       - Orders
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               orderId:
     *                 type: string
     *               status:
     *                 type: string
     *                 enum: [RECEIVED, IN_PREPARATION, READY, COMPLETED]
     *     responses:
     *       200:
     *         description: Order status updated successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                 updatedOrder:
     *                   type: object
     *       404:
     *         description: Order not found
     *       500:
     *         description: Unexpected error
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
}
