import { Order } from '../entities/order';

export interface OrderRepository {
  getOrder(id: string): Promise<Order | null>;
  createOrder(order: Order): Promise<void>;
  updateOrder(id: string, order: Order): Promise<void>;
  deleteOrder(id: string): Promise<void>;
}
