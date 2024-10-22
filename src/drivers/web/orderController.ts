import { Router, Request, Response } from 'express';
import { OrderService } from '../../useCases/OrderService';

export class orderController {

    private routes: Router;
    constructor(private orderService: OrderService) {
        this.routes = Router();
    }

    public setupRoutes() {
        this.routes.put('/', this.updateOrder.bind(this));
        this.routes.delete('/', this.deleteOrder.bind(this));
        this.routes.get('/', this.getOrder.bind(this));
        this.routes.post('/', this.createOrder.bind(this));
        this.routes.post('/orders/update-status', this.updateOrderStatus.bind(this));

        return this.routes;
    }

    public createOrder(req: any, res: any) {
        res.send('Create Order');
    }

    public updateOrder(req: any, res: any) {
        res.send('Update Order');
    }

    public deleteOrder(req: any, res: any) {
        res.send('Delete Order');
    }

    public getOrder(req: any, res: any) {
        res.send('Get Order');
    }

    public async updateOrderStatus(req: Request, res: Response) {
        const { orderId, status } = req.body;

        try {
            const updatedOrder = await this.orderService.updateOrderStatus(orderId, status);
            if (!updatedOrder) {
                return res.status(404).json({ error: 'Order not found' });
            }
            res.status(200).json(updatedOrder);
        } catch (error) {
            res.status(500).json({ error: 'An unexpected error occurred' });
        }
    }


}