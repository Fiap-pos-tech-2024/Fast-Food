import { Order, OrderStatus } from '../domain/entities/order'
import { OrderRepository } from '../domain/interface/orderRepository'

export class OrderUseCase {
    constructor(private orderRepository: OrderRepository) {}

    async getOrder(id: string): Promise<Order | null> {
        return this.orderRepository.getOrder(id)
    }

    async createOrder(order: Order): Promise<void> {
        // validar se o produto existe.
        return this.orderRepository.createOrder(order)
    }

    async updateOrder(id: string, order: Order) {
        return this.orderRepository.updateOrder(id, order)
    }

    async deleteOrder(id: string) {
        return this.orderRepository.deleteOrder(id)
    }

    async updateOrderStatus(id: string, status: OrderStatus): Promise<void> {
        return this.orderRepository.updateOrderStatus(id, status)
    }

    async listOrders(): Promise<Order[]> {
        return this.orderRepository.listOrders()
    }
}
