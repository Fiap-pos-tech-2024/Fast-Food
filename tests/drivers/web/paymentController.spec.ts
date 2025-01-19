import { Request, Response } from 'express'
import { PaymentController } from '../../../src/drivers/web/paymentController'
import { PaymentUseCase } from '../../../src/useCases/payment'
import { Payment } from '../../domain/entities/payment'

describe('PaymentController', () => {
    let paymentController: PaymentController
    let mockPaymentUseCase: jest.Mocked<PaymentUseCase>
    let req: Partial<Request>
    let res: Partial<Response>

    beforeEach(() => {
        mockPaymentUseCase = {
            getPayment: jest.fn(),
            createPayment: jest.fn(),
            paymentRepository: {},
        } as unknown as jest.Mocked<PaymentUseCase>

        paymentController = new PaymentController(mockPaymentUseCase)

        req = {
            params: {},
            body: {},
        }
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            send: jest.fn(),
        }
    })

    describe('createPayment', () => {
        it('should create a new payment', async () => {
            const mockedPayment = Payment.createMock()
            req.body = mockedPayment
            const fakePayloadReturn = { id: '1' }
            mockPaymentUseCase.createPayment.mockResolvedValue(
                fakePayloadReturn
            )

            await paymentController.createPayment(
                req as Request,
                res as Response
            )

            expect(mockPaymentUseCase.createPayment).toHaveBeenCalledWith(
                req.body
            )
            expect(res.status).toHaveBeenCalledWith(201)
            expect(res.json).toHaveBeenCalledWith(fakePayloadReturn)
        })

        it('should return 500 if create payment link failed', async () => {
            req.body = Payment.createMock()
            const error = new Error('create payment link failed')
            mockPaymentUseCase.createPayment.mockRejectedValue(error)

            await paymentController.createPayment(
                req as Request,
                res as Response
            )

            expect(res.status).toHaveBeenCalledWith(500)
            expect(res.json).toHaveBeenCalledWith({
                error: 'Failed to create payment link',
            })
        })
    })
    describe('getPayment', () => {
        it('should return a payment by id', async () => {
            req.params = { paymentId: '1' }
            const payment = Payment.createMock()
            mockPaymentUseCase.getPayment.mockResolvedValue(payment)

            await paymentController.getPayment(req as Request, res as Response)

            expect(mockPaymentUseCase.getPayment).toHaveBeenCalledWith('1')
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.json).toHaveBeenCalledWith(payment)
        })

        it('should return 404 if payment not found', async () => {
            req.params = { paymentId: '1' }
            mockPaymentUseCase.getPayment.mockResolvedValue(null)

            await paymentController.getPayment(req as Request, res as Response)

            expect(res.status).toHaveBeenCalledWith(404)
            expect(res.send).toHaveBeenCalledWith('Payment not found')
        })

        it('should return 500 on error', async () => {
            req.params = { paymentId: '1' }
            mockPaymentUseCase.getPayment.mockRejectedValue(
                new Error('Failed to get payment')
            )

            await paymentController.getPayment(req as Request, res as Response)

            expect(res.status).toHaveBeenCalledWith(500)
            expect(res.json).toHaveBeenCalledWith({
                error: 'An unexpected error occurred',
            })
        })
    })
})
