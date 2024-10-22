import { Order } from "../entities/order";

export interface OrderRepository {
    createOrder(): void;
    updateOrder(): void;
    deleteOrder(): void;
    getOrder(): void;
    updateOrderStatus(orderId: string, status: string): Promise<Order | null>;
}
