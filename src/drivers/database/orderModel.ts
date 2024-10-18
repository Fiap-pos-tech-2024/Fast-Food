import { MongoConnection } from '../../config/mongoConfig';
import { Order, OrderStatus } from '../../domain/entities/order';
import { OrderRepository } from '../../domain/interface/orderRepository';
import { ObjectId } from 'mongodb';

export class MongoOrderRepository implements OrderRepository {
  private collection = 'order';
  private mongoConnection: MongoConnection;

  constructor(mongoConnection: MongoConnection) {
    this.mongoConnection = mongoConnection;
  }

  private async getDb() {
    return this.mongoConnection.getDatabase();
  }

  async createOrder(order: Order): Promise<void> {
    const db = await this.getDb();
    await db.collection(this.collection).insertOne({
      _id: new ObjectId(),
      idClient: order.idClient,
      cpf: order.cpf,
      name: order.name,
      email: order.email,
      status: order.status,
      itens: order.itens,
      value: order.value,
    });
  }
  updateOrder(): Promise<void> {
    throw new Error('Method not implemented.');
  }
  deleteOrder(): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async updateOrderStatus(
    orderId: string,
    status: OrderStatus,
  ): Promise<Order | null> {
    const db = await this.getDb();
    const result = await db
      .collection(this.collection)
      .findOneAndUpdate(
        { orderId },
        { $set: { status } },
        { returnOriginal: false },
      )
      .exec();
    return result.value;
  }
}
