import { PaymentUseCase } from '../../src/useCases/payment'
import { PaymentRepository } from '../../src/domain/interface/paymentRepository'
import { Order } from '../domain/entities/order'
import { OrderRepository } from '../../src/domain/interface/orderRepository'
import { Payment } from '../domain/entities/payment'

describe('PaymentUseCase', () => {
    let PaymentRepository: jest.Mocked<PaymentRepository>
    let OrderRepository: jest.Mocked<OrderRepository>
    let useCase: PaymentUseCase

    beforeEach(() => {
        OrderRepository = {
            getOrder: jest.fn(),
            createOrder: jest.fn(),
            updateOrder: jest.fn(),
            deleteOrder: jest.fn(),
            updateOrderStatus: jest.fn(),
            updatePayment: jest.fn(),
            listOrders: jest.fn(),
        }

        PaymentRepository = {
            createPayment: jest.fn(),
            getPayment: jest.fn(),
            checkPaymentStatus: jest.fn(),
        }

        useCase = new PaymentUseCase(PaymentRepository, OrderRepository)
    })

    describe('createPayment', () => {
        it('should create a new payment link', async () => {
            const mockedOrder = Order.createMock()
            const paymentData: Payment = {
                order: mockedOrder,
                paymentId: '2',
                paymentLink: 'some link',
                status: 'STATUS',
                total: 10,
            } as Payment

            OrderRepository.getOrder.mockResolvedValue(mockedOrder)

            await useCase.createPayment(paymentData)

            expect(PaymentRepository.createPayment).toHaveBeenCalledWith(
                paymentData
            )
            expect(PaymentRepository.createPayment).toHaveBeenCalledTimes(1)
        })

        it('should throw an error if payment without order registry', async () => {
            const mockedOrder = Order.createMock()
            const paymentData: Payment = {
                order: mockedOrder,
                paymentId: '2',
                paymentLink: 'some link',
                status: 'STATUS',
                total: 10,
            } as Payment

            OrderRepository.getOrder.mockResolvedValue(null)

            await expect(useCase.createPayment(paymentData)).rejects.toThrow(
                'Order does not exist'
            )
            expect(PaymentRepository.createPayment).not.toHaveBeenCalled()
        })
    })

    describe('getPayment', () => {
        it('should return a order by id', async () => {
            const mockedOrder = Order.createMock()
            const mockedPaymentId = '2'
            const paymentData: Payment = {
                order: mockedOrder,
                paymentId: '2',
                paymentLink: 'some link',
                status: 'STATUS',
                total: 10,
            } as Payment

            PaymentRepository.getPayment.mockResolvedValue(paymentData)

            const result = await useCase.getPayment(mockedPaymentId)

            expect(result).toEqual(paymentData)
            expect(PaymentRepository.getPayment).toHaveBeenCalledWith(
                mockedPaymentId
            )
        })

        it('should return null if payment does not exist', async () => {
            const mockedPaymentId = '2'
            PaymentRepository.getPayment.mockResolvedValue(null)

            const result = await useCase.getPayment(mockedPaymentId)

            expect(result).toBeNull()
            expect(PaymentRepository.getPayment).toHaveBeenCalledWith(
                mockedPaymentId
            )
        })
    })

    describe('checkPaymentStatus', () => {
        it('should send correctly params', async () => {
            const mockedPaymentId = '1'
            const status = { status: 'Success' }
            PaymentRepository.checkPaymentStatus.mockResolvedValue(status)

            await useCase.checkPaymentStatus(mockedPaymentId)

            expect(PaymentRepository.checkPaymentStatus).toHaveBeenCalledWith(
                mockedPaymentId
            )
        })

        it('should save payment id in order if status is paid', async () => {
            const mockedPaymentId = '2'
            const status = { status: 'PAID' }
            const mockedOrder = Order.createMock()
            const paymentData: Payment = {
                order: mockedOrder,
                paymentId: '2',
                paymentLink: 'some link',
                status: 'STATUS',
                total: 10,
            } as Payment

            PaymentRepository.checkPaymentStatus.mockResolvedValue(status)
            PaymentRepository.getPayment.mockResolvedValue(paymentData)

            OrderRepository.updatePayment.mockResolvedValue()

            await useCase.checkPaymentStatus(mockedPaymentId)

            expect(PaymentRepository.checkPaymentStatus).toHaveBeenCalledWith(
                mockedPaymentId
            )
            expect(PaymentRepository.getPayment).toHaveBeenCalledTimes(1)
            expect(OrderRepository.updatePayment).toHaveBeenCalledTimes(1)
        })

        it('should not save payment id in order if status is not paid', async () => {
            const mockedPaymentId = '2'
            const status = { status: 'Success' }
            const mockedOrder = Order.createMock()
            const paymentData: Payment = {
                order: mockedOrder,
                paymentId: '2',
                paymentLink: 'some link',
                status: 'STATUS',
                total: 10,
            } as Payment

            PaymentRepository.checkPaymentStatus.mockResolvedValue(status)
            PaymentRepository.getPayment.mockResolvedValue(paymentData)

            OrderRepository.updatePayment.mockResolvedValue()

            await useCase.checkPaymentStatus(mockedPaymentId)

            expect(PaymentRepository.checkPaymentStatus).toHaveBeenCalledWith(
                mockedPaymentId
            )
            expect(PaymentRepository.getPayment).not.toHaveBeenCalled()
            expect(OrderRepository.updatePayment).not.toHaveBeenCalled()
        })
    })
})
