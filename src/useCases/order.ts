import { Order } from '../domain/entities/order'
import { OrderRepository } from '../domain/interface/orderRepository'
import { ClientRepository } from '../domain/interface/clientRepository'

export class OrderUseCase {
    constructor(
        private orderRepository: OrderRepository,
        private clientRepository: ClientRepository
    ) {}

    async getOrder(id: string): Promise<Order | null> {
        return await this.orderRepository.getOrder(id)
    }

    async createOrder(order: Order): Promise<void> {
        if (order.idOrder) {
            const existingOrder = await this.getOrder(order.idOrder)
            if (existingOrder) {
                throw new Error('Order already exist')
            }
        }

        if (order.idClient) {
            const existingClient = await this.clientRepository.findById(
                order.idClient
            )
            if (!existingClient) {
                throw new Error('Client does not exist')
            }
        }
        return await this.orderRepository.createOrder(order)
    }

    async updateOrder(id: string, order: Order) {
        const existingOrder = await this.getOrder(id)
        if (!existingOrder) {
            throw new Error('Order does not exist')
        }
        return await this.orderRepository.updateOrder(id, order)
    }

    async deleteOrder(id: string) {
        const existingOrder = await this.getOrder(id)
        if (!existingOrder) {
            throw new Error('Order does not exist')
        }
        return await this.orderRepository.deleteOrder(id)
    }

    async updateOrderStatus(id: string, status: string): Promise<Order | null> {
        return await this.orderRepository.updateOrderStatus(id, status)
    }

    async listOrders(): Promise<Order[]> {
        return await this.orderRepository.listOrders()
    }
}
