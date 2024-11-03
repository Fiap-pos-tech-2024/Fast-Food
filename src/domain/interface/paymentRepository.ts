import { Payment } from '../entities/payment'

export interface PaymentRepository {
    getPayment(id: string): Promise<Payment | null>
    createPayment(payment: Payment): Promise<{ id: string }>
    checkPaymentStatus(id: string): Promise<{ status: string } | null>
}
