import { Order } from '../entities/order';

export interface OrderRepository {
  createOrder(order: Order): Promise<void>;
  updateOrder(order: Order): Promise<void>;
  deleteOrder(id: string): Promise<void>;
  updateOrderStatus(orderId: string, status: string): Promise<Order | null>;
}
