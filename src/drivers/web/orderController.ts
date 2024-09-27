import { Router } from "express";

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

    public createOrder(req: any, res: any) {
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