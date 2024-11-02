import { Request, Response } from 'express'
import { PaymentUseCase } from '../../../src/useCases/payment'
import { PaymentController } from '../../../src/drivers/web/paymentController'

describe('PaymentController', () => {
    let paymentController: PaymentController
    let mockPaymentUseCase: jest.Mocked<PaymentUseCase>
    let req: Partial<Request>
    let res: Partial<Response>

    beforeEach(() => {
        mockPaymentUseCase = {
            processPayment: jest.fn(),
            confirmPayment: jest.fn(),
        } as unknown as jest.Mocked<PaymentUseCase>

        paymentController = new PaymentController(mockPaymentUseCase)

        req = {
            body: {},
            params: {},
        }
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            send: jest.fn(),
        }
    })

    describe('createPaymentLink', () => {
        it('should create a payment link successfully', async () => {
            req.body = {
                orderData: {
                    idOrder: '12345',
                    idClient: '67890',
                    cpf: '12345678901',
                    name: 'John Doe',
                    email: 'john.doe@example.com',
                    status: 'PENDING',
                    value: 100,
                    itens: ['prod-1', 'prod-2'],
                },
                total: 100,
            }

            await paymentController.createPaymentLink(
                req as Request,
                res as Response
            )

            expect(res.status).toHaveBeenCalledWith(201)
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    success: true,
                    paymentLink: expect.any(String),
                    orderId: '12345',
                    total: 100,
                })
            )
        })

        it('should return 500 if there is an error creating payment link', async () => {
            mockPaymentUseCase.processPayment.mockRejectedValue(
                new Error('Failed to create payment link')
            )

            await paymentController.createPaymentLink(
                req as Request,
                res as Response
            )

            expect(res.status).toHaveBeenCalledWith(500)
            expect(res.json).toHaveBeenCalledWith({
                error: 'Failed to create payment link',
            })
        })
    })

    describe('checkPaymentStatus', () => {
        it('should confirm payment status successfully', async () => {
            req.body = { paymentLinkId: 'https://fake-payment-link.com/12345' }
            mockPaymentUseCase.confirmPayment.mockResolvedValue(true)

            await paymentController.checkPaymentStatus(
                req as Request,
                res as Response
            )

            expect(mockPaymentUseCase.confirmPayment).toHaveBeenCalledWith(
                'https://fake-payment-link.com/12345'
            )
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: 'Payment confirmed. Order sent to the kitchen.',
            })
        })

        it('should return 200 with message if payment is not confirmed', async () => {
            req.body = { paymentLinkId: 'https://fake-payment-link.com/12345' }
            mockPaymentUseCase.confirmPayment.mockResolvedValue(false)

            await paymentController.checkPaymentStatus(
                req as Request,
                res as Response
            )

            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: 'Payment not confirmed yet.',
            })
        })

        it('should return 500 if there is an error checking payment status', async () => {
            req.body = { paymentLinkId: 'https://fake-payment-link.com/12345' }
            mockPaymentUseCase.confirmPayment.mockRejectedValue(
                new Error('Failed to check payment status')
            )

            await paymentController.checkPaymentStatus(
                req as Request,
                res as Response
            )

            expect(res.status).toHaveBeenCalledWith(500)
            expect(res.json).toHaveBeenCalledWith({
                error: 'Failed to check payment status',
            })
        })
    })
})
