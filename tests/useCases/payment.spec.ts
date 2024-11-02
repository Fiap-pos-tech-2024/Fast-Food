import { PaymentUseCase } from '../../src/useCases/payment'
import { Order, OrderStatus } from '../../src/domain/entities/order'
import { MongoPaymentRepository } from '../../src/drivers/database/paymentModel'

describe('PaymentUseCase', () => {
    let paymentRepository: jest.Mocked<MongoPaymentRepository>
    let useCase: PaymentUseCase

    beforeEach(() => {
        paymentRepository = {} as jest.Mocked<MongoPaymentRepository>
        useCase = new PaymentUseCase(paymentRepository)
    })

    describe('processPayment', () => {
        it('should process payment and return success, paymentId, and orderId', async () => {
            const order = new Order({
                idOrder: '12345',
                idClient: '67890',
                cpf: '12345678901',
                name: 'John Doe',
                email: 'john.doe@example.com',
                idPayment: null,
                status: OrderStatus.RECEIVED,
                value: 100,
                itens: [{ idProduct: 'prod-1' }, { idProduct: 'prod-2' }],
            })
            const paymentData = { amount: 100 }

            const result = await useCase.processPayment(order, paymentData)

            expect(result).toEqual({
                success: true,
                paymentId: '12345',
                orderId: order.idOrder,
            })
        })
    })

    describe('confirmPayment', () => {
        it('should confirm payment and return true', async () => {
            const paymentLinkId = 'https://fake-payment-link.com/12345'

            const result = await useCase.confirmPayment(paymentLinkId)

            expect(result).toBe(true)
        })
    })
})
