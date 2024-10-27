import { Order } from "../domain/entities/order";
import { OrderRepository } from "../domain/interface/orderRepository";

export class OrderService {
    constructor(private orderRepository: OrderRepository) {}

        createOrder() {
            console.log('Create Order');
        }

        updateOrder() {
            console.log('Update Order');
        }
        deleteOrder() {
            console.log('Delete Order');
        }    

        async updateOrderStatus(id: string, status: string): Promise<Order | null> {
        return await this.orderRepository.updateOrderStatus(id, status);
    }
}
