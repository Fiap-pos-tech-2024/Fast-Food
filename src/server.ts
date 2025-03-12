import express from 'express'
import { MongoConnection } from './config/mongoConfig'
import swaggerRouter from './config/swaggerConfig'
import { ClientApiController } from './drivers/web/clientApiController'
import { HealthCheckApiController } from './drivers/web/healthCheckApiController'
import { OrderApiController } from './drivers/web/orderApiController'
import { ProductApiController } from './drivers/web/productApiController'
import { PaymentApiController } from './drivers/web/paymentApiController'
import { MercadoPagoController } from './drivers/web/mercadoPagoController'
import { MongoClientRepository } from './drivers/database/clientModel'
import { MongoOrderRepository } from './drivers/database/orderModel'
import { MongoProductRepository } from './drivers/database/productModel'
import { MongoPaymentRepository } from './drivers/database/paymentModel'
import { ClientUseCase } from './useCases/client'
import { ProductUseCase } from './useCases/product'
import { OrderUseCase } from './useCases/order'
import { HealthCheckUseCase } from './useCases/healthCheck'
import { PaymentUseCase } from './useCases/payment'

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
        const clientHandler = new ClientApiController(clientUseCase)
        this.express.use('/client', clientHandler.setupRoutes())

        // Configuração do Product
        const productRepository = new MongoProductRepository(
            this.mongoConnection
        )
        const productUseCase = new ProductUseCase(productRepository)
        const productHandler = new ProductApiController(productUseCase)
        this.express.use('/product', productHandler.setupRoutes())

        // Configuração do Order
        const orderRepository = new MongoOrderRepository(this.mongoConnection)
        const orderUseCase = new OrderUseCase(
            orderRepository,
            clientRepository,
            productRepository
        )
        const orderHandler = new OrderApiController(orderUseCase)
        this.express.use('/order', orderHandler.setupRoutes())

        // Configuração do MercadoPagoController
        const mercadoPagoController = new MercadoPagoController()

        // Configuração do Pagamento
        const paymentRepository = new MongoPaymentRepository(
            this.mongoConnection
        )
        const paymentUseCase = new PaymentUseCase(
            paymentRepository,
            orderRepository,
            mercadoPagoController
        )
        const paymentHandler = new PaymentApiController(paymentUseCase)
        this.express.use('/payment', paymentHandler.setupRoutes())

        // Configuração do Health Check e Swagger
        const healthCheckUseCase = new HealthCheckUseCase()
        const healthCheckHandler = new HealthCheckApiController(
            healthCheckUseCase
        )
        this.express.use('/health', healthCheckHandler.setupRoutes())
        this.express.use('/api-docs', swaggerRouter)
    }

    startServer() {
        this.express.listen(3000, () => {
            console.log('Server is running on port 3000')
        })
    }
}

new InitProject()
