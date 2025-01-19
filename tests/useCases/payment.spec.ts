import { PaymentRepository } from '../../src/domain/interface/paymentRepository'
import { OrderRepository } from '../../src/domain/interface/orderRepository'
import { MercadoPagoController } from '../../src/drivers/web/mercadoPagoController'
import { Payment } from '../../src/domain/entities/payment'
import { PAYMENT_STATUS } from '../../src/constants/payment'
import { Order } from '../domain/entities/order'
import { PaymentUseCase } from '../../src/useCases/payment'

const existingOrderMock = {
    idOrder: '123',
    value: 100,
    idClient: 'clientId',
    cpf: '123.456.789-00',
    name: 'John Doe',
    email: 'johndoe@example.com',
} as Order
describe('PaymentUseCase', () => {
    let paymentRepository: jest.Mocked<PaymentRepository>
    let orderRepository: jest.Mocked<OrderRepository>
    let mercadoPagoController: jest.Mocked<MercadoPagoController>
    let useCase: PaymentUseCase

    beforeEach(() => {
        paymentRepository = {
            createPayment: jest.fn(),
            getPayment: jest.fn(),
            updatePaymentStatus: jest.fn(),
        }
        orderRepository = {
            getOrder: jest.fn(),
            updateOrder: jest.fn(),
            updateOrderStatus: jest.fn(),
            createOrder: jest.fn(),
            deleteOrder: jest.fn(),
            updatePayment: jest.fn(),
            listOrders: jest.fn(),
        }
        mercadoPagoController = {
            getUserToken: jest.fn(),
            generateQRCodeLink: jest.fn(),
            convertQRCodeToImage: jest.fn(),
            getPaymentStatus: jest.fn(),
        }

        useCase = new PaymentUseCase(
            paymentRepository,
            orderRepository,
            mercadoPagoController
        )
    })

    describe('createPayment', () => {
        it('should create a payment successfully', async () => {
            const payment: Payment = {
                order: {
                    idOrder: '123',
                    value: 100,
                    paymentLink: '',
                    paymentId: '',
                },
            } as Payment

            const accessData = {
                token: 'token',
                userId: 'userId',
            } as unknown as {
                token: string
                userId: number
            }
            const qrCodeLink = { qr_data: 'qr_code_data' }
            const paymentCreated = { id: '1', paymentLink: 'image_link' }

            orderRepository.getOrder.mockResolvedValue(existingOrderMock)
            mercadoPagoController.getUserToken.mockResolvedValue(accessData)
            mercadoPagoController.generateQRCodeLink.mockResolvedValue(
                qrCodeLink
            )
            mercadoPagoController.convertQRCodeToImage.mockResolvedValue(
                'image_link'
            )
            paymentRepository.createPayment.mockResolvedValue(paymentCreated)

            const result = await useCase.createPayment(payment)

            expect(result).toEqual(paymentCreated)
            expect(orderRepository.getOrder).toHaveBeenCalledWith('123')
            expect(mercadoPagoController.getUserToken).toHaveBeenCalledTimes(1)
            expect(mercadoPagoController.generateQRCodeLink).toHaveBeenCalled()
            expect(paymentRepository.createPayment).toHaveBeenCalledWith({
                ...payment,
                paymentLink: 'image_link',
                paymentId: '123',
                status: PAYMENT_STATUS.AWAITING,
                total: 100,
            })
        })

        it('should throw an error if the order does not exist', async () => {
            const payment: Payment = {
                order: {
                    idOrder: '123',
                    value: 100,
                    paymentLink: '',
                    paymentId: '',
                },
            } as Payment

            orderRepository.getOrder.mockResolvedValue(null)

            await expect(useCase.createPayment(payment)).rejects.toThrow(
                'Order does not exist'
            )
        })

        it('should throw an error if fetching user token fails', async () => {
            const payment: Payment = {
                order: {
                    idOrder: '123',
                    value: 100,
                    paymentLink: '',
                    paymentId: '',
                },
            } as Payment

            orderRepository.getOrder.mockResolvedValue(existingOrderMock)
            mercadoPagoController.getUserToken.mockResolvedValue(null)

            await expect(useCase.createPayment(payment)).rejects.toThrow(
                'Failed to fetch QR code token'
            )
        })

        it('should throw an error if the order ID is missing', async () => {
            const payment: Payment = {
                order: {
                    value: 100,
                    paymentLink: '',
                    paymentId: '',
                },
            } as Payment

            await expect(useCase.createPayment(payment)).rejects.toThrow(
                'Order ID is required'
            )
        })
    })

    describe('getPayment', () => {
        it('should return payment data if payment exists', async () => {
            const paymentId = '1'
            const paymentData: Payment = { id: paymentId } as unknown as Payment
            paymentRepository.getPayment.mockResolvedValue(paymentData)

            const result = await useCase.getPayment(paymentId)

            expect(result).toEqual(paymentData)
            expect(paymentRepository.getPayment).toHaveBeenCalledWith(paymentId)
        })

        it('should throw an error if payment does not exist', async () => {
            const paymentId = '1'
            paymentRepository.getPayment.mockResolvedValue(null)

            await expect(useCase.getPayment(paymentId)).rejects.toThrow(
                'Payment not found'
            )
        })
    })

    describe('handlePaymentWebhook', () => {
        it('should update payment and order status on valid webhook', async () => {
            const webhookData = {
                resource: 'resource',
                topic: 'merchant_order',
            }
            const mercadoPagoData = { id: '1', status: PAYMENT_STATUS.PAID }
            const paymentId = '1'
            const payment = { id: paymentId } as unknown as Payment

            paymentRepository.getPayment.mockResolvedValue(payment)
            mercadoPagoController.getPaymentStatus.mockResolvedValue(
                mercadoPagoData
            )
            paymentRepository.updatePaymentStatus.mockResolvedValue(undefined)
            orderRepository.updateOrderStatus.mockResolvedValue(undefined)

            await useCase.handlePaymentWebhook(webhookData)

            expect(paymentRepository.updatePaymentStatus).toHaveBeenCalledWith(
                paymentId,
                PAYMENT_STATUS.PAID
            )
            expect(orderRepository.updateOrderStatus).toHaveBeenCalledWith(
                paymentId,
                PAYMENT_STATUS.PAID
            )
        })

        it('should not do anything if topic is not "merchant_order"', async () => {
            const webhookData = { resource: 'resource', topic: 'other_topic' }

            await useCase.handlePaymentWebhook(webhookData)

            expect(paymentRepository.updatePaymentStatus).not.toHaveBeenCalled()
            expect(orderRepository.updateOrderStatus).not.toHaveBeenCalled()
        })

        it('should throw an error if payment not found during webhook processing', async () => {
            const webhookData = {
                resource: 'resource',
                topic: 'merchant_order',
            }
            paymentRepository.getPayment.mockResolvedValue(null)

            await expect(
                useCase.handlePaymentWebhook(webhookData)
            ).rejects.toThrow('Failed to get MercadoPago data')
        })
    })
})
