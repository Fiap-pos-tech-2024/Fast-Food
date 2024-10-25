import { Router, Request, Response } from 'express';
import { OrderService } from '../../useCases/orderService';

export class OrderController {
  private routes: Router;
  constructor(private orderService: OrderService) {
    this.routes = Router();
  }

  public setupRoutes() {
    this.routes.put('/:id', this.updateOrder.bind(this));
    this.routes.delete('/:id', this.deleteOrder.bind(this));
    this.routes.get('/:id', this.getOrder.bind(this));
    this.routes.post('/', this.createOrder.bind(this));
    );

    return this.routes;
  }

  public async createOrder(req: Request, res: Response) {
    try {
      const { order } = req.body;
      if (!order) {
        res.status(404).json({ error: 'Order not created' });
      }
      await this.orderService.createOrder(order);
      res.status(201).send('Order created successfully');
    } catch (error) {
      res.status(500).json({ error: 'An unexpected error occurred' });
    }
  }

  public async updateOrder(req: Request, res: Response) {
    try {
      const orderId = req.params.id;
      const updatedUserData = req.body;
      await this.orderService.updateOrder(orderId, updatedUserData);
      res.status(200).send(`Order ${orderId} updated success`);
    } catch (error) {
      res.status(500).json({ error: 'An unexpected error occurred' });
    }
  }

  public async deleteOrder(req: Request, res: Response) {
    try {
      const orderId = req.params.id;
      await this.orderService.deleteOrder(orderId);
      res.status(200).send(`Order ${orderId} deleted success`);
    } catch (error) {
      res.status(500).json({ error: 'An unexpected error occurred' });
    }
  }

  public async getOrder(req: Request, res: Response) {
    try {
      const orderId = req.params.id;
      await this.orderService.getOrder(orderId);
      res.status(200).send(`Order ${orderId} deleted success`);
    } catch (error) {
      res.status(500).json({ error: 'An unexpected error occurred' });
    }
  }
}
