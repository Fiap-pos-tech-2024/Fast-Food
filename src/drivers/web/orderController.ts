import { Router } from 'express';
import { Request, Response } from 'express';

interface startOrderPayload {
  idClient: string;
}

export class orderController {
  private routes: Router;
  constructor() {
    this.routes = Router();
  }

  public setupRoutes() {
    this.routes.get('/', this.createOrder);
    this.routes.put('/', this.updateOrder);
    this.routes.delete('/', this.deleteOrder);
    this.routes.get('/', this.getOrder);
    return this.routes;
  }

  public async createOrder(req: Request<unknown, startOrderPayload>, res: Response) {
    try {
        const { idClient } = req;

        const createdOrder = await 
    }
        res.send('Create Order');
  }

  public updateOrder() {
    console.log('Update Order');
  }

  public deleteOrder() {
    console.log('Delete Order');
  }

  public getOrder() {
    console.log('Get Order');
  }
}
