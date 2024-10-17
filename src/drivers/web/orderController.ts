import { Router } from "express";

export class orderController {

    private routes: Router;
    constructor() {
        this.routes = Router();
    }

    public setupRoutes() {
        this.routes.put('/', this.updateOrder.bind(this));
        this.routes.delete('/', this.deleteOrder.bind(this));
        this.routes.get('/', this.getOrder.bind(this));
        this.routes.post('/', this.createOrder.bind(this));
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

}