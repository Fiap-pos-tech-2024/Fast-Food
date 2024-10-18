import { OrderRepository } from '../domain/interface/orderRepository'
import { Order } from '../domain/entities/order'


export default class orderService {
    static async createOrder(orderRepository: OrderRepository): Promise<Order> {
        const order = new Order(orderInput)
        return orderRepository.createOrder(order)
    }

    async getOrder(id: string): Promise<Order | null> {
        return this.orderRepository.findById(id)
    }

    async updateOrder(id: string, item: string, amount: number) {
        const order = new Order(id, item, amount)
        return this.orderRepository.update(order)
    }
    async deleteOrder(id: string) {
        return this.orderRepository.delete(id)
    }
}
