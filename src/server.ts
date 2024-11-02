import express from 'express'
import { OrderController } from './drivers/web/orderController'
import { healthCheckController } from './drivers/web/healthCheckController'
import { ClientController } from './drivers/web/clientController'
import { MongoConnection } from './config/mongoConfig'
import { ClientUseCase } from './useCases/client'
import { MongoClientRepository } from './drivers/database/clientModel'
import { MongoOrderRepository } from './drivers/database/orderModel'
import { OrderUseCase } from './useCases/order'

class initProject {
    public express: express.Application
    public mongoConnection: MongoConnection

    constructor() {
        this.express = express()
        this.mongoConnection = MongoConnection.getInstance()
        this.start()
    }

    async start() {
        try {
            await this.mongoConnection.connect()
            this.express.use(express.json())
            this.setupRoutes()
            this.startServer()
        } catch (error) {
            console.error('Failed to start application:', error)
        }
    }

    setupRoutes() {
        const clientRepository = new MongoClientRepository(this.mongoConnection)
        const clientCase = new ClientUseCase(clientRepository)
        const routesClientController = new ClientController(clientCase)
        this.express.use('/client', routesClientController.setupRoutes())

        const orderRepository = new MongoOrderRepository(this.mongoConnection)
        const orderUseCase = new OrderUseCase(orderRepository)
        const routesOrderController = new OrderController(orderUseCase)
        this.express.use('/order', routesOrderController.setupRoutes())

        const routesHealthCheckController = new healthCheckController()
        this.express.use('/health', routesHealthCheckController.setupRoutes())
    }

    startServer() {
        this.express.listen(3000, () => {
            console.log('Server is running on port 3000')
        })
    }
}

new initProject()
