import Order  from '../entities/order'
import { OrderStatusType } from '../entities/types/orderTypes'

export interface OrderRepository {
    orders(status: OrderStatusType): Promise<Array<Order>>
    createOrder(order: Order): Promise<Order>
    findOrderById(id: string): Promise<Order | null>
    findOrderByIdClient(idClient: string): Promise<Order | null>
    updateOrder(order: Order): Promise<Order>
    updateStatusOrder(id: string, status: OrderStatusType): Promise<Order>
    deleteOrder(id: string): Promise<void> 
}
