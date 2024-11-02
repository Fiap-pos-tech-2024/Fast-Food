import { MongoConnection } from '../../config/mongoConfig'
export class MongoPaymentRepository {
    constructor(private mongoConnection: MongoConnection) {}

    async savePayment(data: any) {}

    updatePaymentStatus(paymentLinkId: string): Promise<boolean> {
        return Promise.resolve(true)
    }
}
