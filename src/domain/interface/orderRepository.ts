import { Order, OrderStatus } from '../entities/order'

export interface OrderRepository {
    getOrder(id: string): Promise<Order | null>
    createOrder(order: Order): Promise<void>
    updateOrder(id: string, order: Order): Promise<void>
    deleteOrder(id: string): Promise<void>
    updateOrderStatus(orderId: string, status: OrderStatus): Promise<void>
    listOrders(): Promise<Order[]>
}
