import { Router, Request, Response } from 'express'
import { OrderUseCase } from '../../useCases/order'

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
        this.routes.post(
            '/orders/update-status',
            this.updateOrderStatus.bind(this)
        )
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

    public async updateOrderStatus(req: Request, res: Response): Promise<void> {
        const { idOrder, status } = req.body

        try {
            const updatedOrder = await this.OrderUseCase.updateOrderStatus(
                idOrder,
                status
            )
            if (!updatedOrder) {
                res.status(404).json({ error: 'Order not found' })
                return
            }
            res.status(200).json(updatedOrder)
        } catch (error) {
            console.error(error)
            res.status(500).json({ error: 'An unexpected error occurred' })
        }
    }
}
