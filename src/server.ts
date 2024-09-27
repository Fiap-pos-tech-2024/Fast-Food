import express from 'express';
import { orderController } from './drivers/web/orderController';
import { healthCheckController } from './drivers/web/healthCheckController';
class initProject {

    public express: express.Application;

    constructor() {
        this.express = express();
        this.setupRoutes();
        this.startServer();
    }

    async setupRoutes() {
        const routesOrderController = new orderController();
        const routesHealthCheckController = new healthCheckController();
        this.express.use('/order', routesOrderController.setupRoutes());
        this.express.use('/health', routesHealthCheckController.setupRoutes());
    }

    async startServer() {
        this.express.listen(3000, () => {
            console.log('Server is running on port 3000');
        });
    }
}

new initProject();