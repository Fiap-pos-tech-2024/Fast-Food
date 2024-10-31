import { Order } from '../domain/entities/order';
import { OrderRepository } from '../domain/interface/orderRepository';

export class OrderService {
  constructor(private orderRepository: OrderRepository) {}

  async getOrder(id: string): Promise<Order | null> {
    return await this.orderRepository.getOrder(id);
  }

  async createOrder(order: Order): Promise<void> {
    return await this.orderRepository.createOrder(order);
  }

  async updateOrder(id: string, order: Order) {
    return await this.orderRepository.updateOrder(id, order);
  }
  async deleteOrder(id: string) {
    return await this.orderRepository.deleteOrder(id);
  }
  
   async updateOrderStatus(id: string, status: string): Promise<Order | null> {
      return await this.orderRepository.updateOrderStatus(id, status)
  }

}
