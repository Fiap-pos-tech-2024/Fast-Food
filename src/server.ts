import express from 'express'
import { OrderController } from './drivers/web/orderController'
import { healthCheckController } from './drivers/web/healthCheckController'
import { UserController } from './drivers/web/userController'
import { MongoConnection } from './config/mongoConfig'
import { userUseCase } from './useCases/user'
import { MongoUserRepository } from './drivers/database/userModel'
import { MongoOrderRepository } from './drivers/database/orderModel'
import { OrderService } from './useCases/OrderService'

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
        const userRepository = new MongoUserRepository(this.mongoConnection)
        const userCase = new userUseCase(userRepository)
        const routesUserController = new UserController(userCase)
        this.express.use('/user', routesUserController.setupRoutes())

        const orderRepository = new MongoOrderRepository(this.mongoConnection)
        const orderService = new OrderService(orderRepository)
        const routesOrderController = new OrderController(orderService)
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
