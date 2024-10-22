import { Router, Request, Response } from 'express'
import { OrderService } from '../../useCases/OrderService'

export class orderController {
    private routes: Router
    constructor(private orderService: OrderService) {
        this.routes = Router()
    }

    public setupRoutes() {
        this.routes.put('/', this.updateOrder.bind(this))
        this.routes.delete('/', this.deleteOrder.bind(this))
        this.routes.get('/', this.getOrder.bind(this))
        this.routes.post('/', this.createOrder.bind(this))
        this.routes.post(
            '/orders/update-status',
            this.updateOrderStatus.bind(this)
        )

        return this.routes
    }

    public createOrder(req: any, res: any) {
        res.send('Create Order')
    }

    public updateOrder(req: any, res: any) {
        res.send('Update Order')
    }

    public deleteOrder(req: any, res: any) {
        res.send('Delete Order')
    }

    public getOrder(req: any, res: any) {
        res.send('Get Order')
    }

/**
 * @swagger
 * /orders/update-status:
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

    public async updateOrderStatus(req: Request, res: Response) {
        const { orderId, status } = req.body

        try {
            const updatedOrder = await this.orderService.updateOrderStatus(
                orderId,
                status
            )
            if (!updatedOrder) {
                return res.status(404).json({ error: 'Order not found' })
            }
            res.status(200).json(updatedOrder)
        } catch (error) {
            res.status(500).json({ error: 'An unexpected error occurred' })
        }
    }
}
