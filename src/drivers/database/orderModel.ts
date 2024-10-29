import { MongoConnection } from '../../config/mongoConfig'
import { Order, OrderStatus } from '../../domain/entities/order'
import { OrderRepository } from '../../domain/interface/orderRepository'

export class MongoOrderRepository implements OrderRepository {
    private collection = 'order'
    private mongoConnection: MongoConnection

    constructor(mongoConnection: MongoConnection) {
        this.mongoConnection = mongoConnection
    }

    private async getDb() {
        return this.mongoConnection.getDatabase()
    }

    createOrder(): void {
        throw new Error('Method not implemented.')
    }
    updateOrder(): void {
        throw new Error('Method not implemented.')
    }
    deleteOrder(): void {
        throw new Error('Method not implemented.')
    }
    getOrder(): void {
        throw new Error('Method not implemented.')
    }

    async updateOrderStatus(
        orderId: string,
        status: OrderStatus
    ): Promise<Order | null> {
        const db = await this.getDb()
        const result = await db
            .collection(this.collection)
            .findOneAndUpdate(
                { orderId },
                { $set: { status } },
                { returnOriginal: false }
            )
            .exec()
        return result.value
    }
}
