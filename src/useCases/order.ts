import { Order } from '../domain/entities/order'
import { OrderRepository } from '../domain/interface/orderRepository'
import { ClientRepository } from '../domain/interface/clientRepository'
import { ProductRepository } from '../domain/interface/productRepository'
import { Product } from '../domain/entities/product'
import { ORDER_STATUS, ORDER_STATUS_LIST } from '../constants/order'

export class OrderUseCase {
    constructor(
        private orderRepository: OrderRepository,
        private clientRepository: ClientRepository,
        private productRepository: ProductRepository
    ) {}

    async getOrder(id: string): Promise<Order | null> {
        const orders = await this.orderRepository.getOrder(id)
        if (!orders) throw new Error('Order not found')
        return orders
    }
    async getActiveOrders(): Promise<Order[]> {
        return this.orderRepository.getActiveOrders()
    }

    async createOrder(order: Order): Promise<string> {
        if (!order) throw new Error('Invalid order data')

        if (order.items?.length === 0)
            throw new Error('Order must have at least one item')

        if (order.idOrder) {
            const existingOrder = await this.getOrder(order.idOrder)
            if (existingOrder) throw new Error('Order already exists')
        }

        if (order.idClient) {
            const existingClient = await this.clientRepository.findById(
                order.idClient
            )
            if (!existingClient) throw new Error('Client does not exist')
        }

        const itemsDetails: Product[] = []
        order.value = 0

        for (const item of order.items) {
            const existingProduct = await this.productRepository.findById(
                item.idProduct
            )

            if (!existingProduct) {
                continue
            }

            const productDetail = new Product({
                idProduct: existingProduct.idProduct,
                name: existingProduct.name,
                amount: item.amount,
                unitValue: existingProduct.unitValue ?? 0,
                observation: item.observation ?? null,
                createdAt: new Date(),
                updatedAt: null,
                deletedAt: null,
                category: existingProduct.category,
                calculateTotalValue: function () {
                    return this.unitValue * this.amount
                },
            })

            itemsDetails.push(productDetail)
            order.value += productDetail.calculateTotalValue()
        }

        order.items = itemsDetails
        order.status = ORDER_STATUS.AWAITING_PAYMENT

        const result = await this.orderRepository.createOrder(order)
        return result
    }

    async updateOrder(id: string, order: Order) {
        const existingOrder = await this.getOrder(id)
        if (!existingOrder) throw new Error('Order does not exist')

        return this.orderRepository.updateOrder(id, order)
    }

    async deleteOrder(id: string) {
        const existingOrder = await this.getOrder(id)
        if (!existingOrder) throw new Error('Order does not exist')

        return this.orderRepository.deleteOrder(id)
    }

    async updateOrderStatus(id: string, status: string): Promise<void> {
        if (!ORDER_STATUS_LIST.includes(status)) {
            throw new Error('Invalid status provided')
        }

        return this.orderRepository.updateOrderStatus(id, status)
    }

    async listOrders(): Promise<Order[]> {
        return this.orderRepository.listOrders()
    }
}
