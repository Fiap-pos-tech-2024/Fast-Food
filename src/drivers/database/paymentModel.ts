import { ObjectId } from 'mongodb'
import { MongoConnection } from '../../config/mongoConfig'
import { PaymentRepository } from '../../domain/interface/paymentRepository'
import { Payment } from '../../domain/entities/payment'

export class MongoPaymentRepository implements PaymentRepository {
    private collection = 'payment'
    private mongoConnection: MongoConnection

    constructor(mongoConnection: MongoConnection) {
        this.mongoConnection = mongoConnection
    }

    private async getDb() {
        return this.mongoConnection.getDatabase()
    }

    async createPayment(payment: Payment): Promise<{ id: string }> {
        const db = await this.getDb()
        const payments = await db.collection(this.collection).insertOne({
            _id: new ObjectId(payment.paymentId ?? ''),
            ...payment,
        })
        return { id: payments.insertedId.toString() }
    }

    async getPayment(paymentId: string): Promise<Payment | null> {
        const db = await this.getDb()
        const payment = await db
            .collection(this.collection)
            .findOne({ _id: new ObjectId(paymentId) })
        if (payment) {
            return new Payment(
                payment.order,
                payment._id.toString(),
                payment.paymentLink,
                payment.status,
                payment.total
            )
        }
        return null
    }

    async updatePaymentStatus(
        paymentId: string,
        status: string
    ): Promise<void> {
        const db = await this.getDb()
        const dbCollection = db.collection(this.collection)
        const query = { _id: new ObjectId(paymentId) }
        await dbCollection.updateOne(query, {
            $set: {
                status,
                'order.status': status,
            },
        })
    }
}
