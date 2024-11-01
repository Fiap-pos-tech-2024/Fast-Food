
import { Router, Request, Response } from 'express';
import { OrderUseCase } from '../../useCases/order';

export class OrderController {
  private routes: Router;
  constructor(private OrderUseCase: OrderUseCase) {
    this.routes = Router();
  }

  public setupRoutes() {
    this.routes.put('/:id', this.updateOrder.bind(this));
    this.routes.delete('/:id', this.deleteOrder.bind(this));
    this.routes.get('/:id', this.getOrder.bind(this));
    this.routes.get('/', this.listOrders.bind(this));
    this.routes.post('/', this.createOrder.bind(this));
    this.routes.post('/orders/update-status', this.updateOrderStatus.bind(this));
    return this.routes;
  }


  public async listOrders(req: Request, res: Response) {
    try {
      const orders = await this.OrderUseCase.listOrders();
      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching orders' });
    }

  }
  public async createOrder(req: Request, res: Response) {
    try {
      const order = req.body;
        if (!order) {
        res.status(404).json({ error: 'Order not created' });
      }
      await this.OrderUseCase.createOrder(order);
      res.status(201).send('Order created successfully');
    } catch (error) {
      res.status(500).json({ error: 'An unexpected error occurred' });
    }
  }

  public async updateOrder(req: Request, res: Response) {
    try {
      const orderId = req.params.id;
      const updatedUserData = req.body;
      await this.OrderUseCase.updateOrder(orderId, updatedUserData);
      res.status(200).send(`Order ${orderId} updated success`);
    } catch (error) {
      res.status(500).json({ error: 'An unexpected error occurred' });
    }
  }

  public async deleteOrder(req: Request, res: Response) {
    try {
      const orderId = req.params.id;
      await this.OrderUseCase.deleteOrder(orderId);
      res.status(200).send(`Order ${orderId} deleted success`);
    } catch (error) {
      res.status(500).json({ error: 'An unexpected error occurred' });
    }
  }

  public async getOrder(req: Request, res: Response) {
    try {
      const orderId = req.params.id;
      const orders = await this.OrderUseCase.getOrder(orderId);
      res.status(200).send(orders);
    } catch (error) {
      res.status(500).json({ error: 'An unexpected error occurred' });
    }
  }

  public async updateOrderStatus(req: Request, res: Response): Promise<void> {
    const { orderId, status } = req.body;

    try {
      const updatedOrder = await this.OrderUseCase.updateOrderStatus(
        orderId,
        status
      )
      if (!updatedOrder) {
        res.status(404).json({ error: 'Order not found' });
        return
      }
      res.status(200).json(updatedOrder)
    } catch (error) {
      res.status(500).json({ error: 'An unexpected error occurred' })
    }
  }
}
