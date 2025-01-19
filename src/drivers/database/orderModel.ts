import { MongoConnection } from '../../config/mongoConfig'
import { Order } from '../../domain/entities/order'
import { OrderRepository } from '../../domain/interface/orderRepository'
import { ObjectId } from 'mongodb'

export class MongoOrderRepository implements OrderRepository {
    private collection = 'order'
    private mongoConnection: MongoConnection

    constructor(mongoConnection: MongoConnection) {
        this.mongoConnection = mongoConnection
    }

    private async getDb() {
        return this.mongoConnection.getDatabase()
    }

    async createOrder(order: Order): Promise<void> {
        const db = await this.getDb()
        await db.collection(this.collection).insertOne({
            _id: new ObjectId(),
            idClient: order.idClient,
            cpf: order.cpf,
            name: order.name,
            email: order.email,
            status: order.status,
            itens: order.items,
            value: order.value,
        })
    }

    async getOrder(orderId: string): Promise<Order | null> {
        const db = await this.getDb()
        const order = await db
            .collection(this.collection)
            .findOne({ _id: new ObjectId(orderId) })
        if (order) {
            return new Order({
                idOrder: order._id.toString(),
                idClient: order.idClient,
                cpf: order.cpf,
                name: order.name,
                email: order.email,
                status: order.status,
                items: order.items,
                value: order.value,
                paymentLink: order.paymentLink,
                paymentId: order.paymentId,
            })
        }
        return null
    }

    async updateOrder(orderId: string, updatedOrderData: Order): Promise<void> {
        const db = await this.getDb()
        const dbCollection = db.collection(this.collection)
        const query = { _id: new ObjectId(orderId) }

        const orderData = { ...updatedOrderData, idOrder: orderId }
        await dbCollection.updateOne(query, { $set: orderData })
    }

    async deleteOrder(orderId: string): Promise<void> {
        const db = await this.getDb()
        await db
            .collection(this.collection)
            .deleteOne({ _id: new ObjectId(orderId) })
    }

    async updateOrderStatus(orderId: string, status: string): Promise<void> {
        const db = await this.getDb()
        const dbCollection = db.collection(this.collection)
        const query = { _id: new ObjectId(orderId) }

        await dbCollection.updateOne(query, { $set: { status } })
    }

    async updatePayment(orderId: string, paymentId: string): Promise<void> {
        const db = await this.getDb()
        const dbCollection = db.collection(this.collection)
        const query = { _id: new ObjectId(orderId) }

        await dbCollection.updateOne(query, { $set: { idPayment: paymentId } })
    }

    async listOrders(): Promise<Order[]> {
        const db = await this.getDb()
        const orders = await db.collection(this.collection).find().toArray()
        return orders.map((order) => {
            return new Order({
                idOrder: order._id.toString(),
                idClient: order.idClient,
                cpf: order.cpf,
                name: order.name,
                email: order.email,
                status: order.status,
                items: order.items,
                value: order.value,
                paymentLink: order.paymentLink,
                paymentId: order.paymentId,
            })
        })
    }
}
