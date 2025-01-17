import { Payment } from '../entities/payment'

export interface PaymentRepository {
    getPayment(id: string): Promise<Payment | null>
    createPayment(payment: Payment): Promise<{ id: string }>
    updatePaymentStatus(id: string, status: string): Promise<void>
}
