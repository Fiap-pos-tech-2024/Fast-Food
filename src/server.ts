import express from 'express'
import { OrderController } from './drivers/web/orderController'
import { HealthCheckController } from './drivers/web/healthCheckController'
import { ClientController } from './drivers/web/clientController'
import { ProductController } from './drivers/web/productController'
import { MongoConnection } from './config/mongoConfig'
import { ClientUseCase } from './useCases/client'
import { ProductUseCase } from './useCases/product'
import { MongoClientRepository } from './drivers/database/clientModel'
import { MongoOrderRepository } from './drivers/database/orderModel'
import { MongoProductRepository } from './drivers/database/productModel'
import { OrderUseCase } from './useCases/order'
import swaggerRouter from './config/swaggerConfig'
import { HealthCheckUseCase } from './useCases/healthCheck'

class InitProject {
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
        // Configuração do Client
        const clientRepository = new MongoClientRepository(this.mongoConnection)
        const clientUseCase = new ClientUseCase(clientRepository)
        const routesClientController = new ClientController(clientUseCase)
        this.express.use('/client', routesClientController.setupRoutes())

        // Configuração do Product
        const productRepository = new MongoProductRepository(
            this.mongoConnection
        )
        const productUseCase = new ProductUseCase(productRepository)
        const routesProductController = new ProductController(productUseCase)
        this.express.use('/product', routesProductController.setupRoutes())

        // Configuração do Order
        const orderRepository = new MongoOrderRepository(this.mongoConnection)
        const orderUseCase = new OrderUseCase(
            orderRepository,
            clientRepository,
            productRepository
        )
        const routesOrderController = new OrderController(orderUseCase)
        this.express.use('/order', routesOrderController.setupRoutes())

        // Configuração do Health Check e Swagger
        const healthCheckUseCase = new HealthCheckUseCase()
        const routesHealthCheckController = new HealthCheckController(
            healthCheckUseCase
        )
        this.express.use('/health', routesHealthCheckController.setupRoutes())
        this.express.use('/api-docs', swaggerRouter)
    }

    startServer() {
        this.express.listen(3000, () => {
            console.log('Server is running on port 3000')
        })
    }
}

new InitProject()
