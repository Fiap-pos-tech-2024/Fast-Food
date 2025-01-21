import { Request, Response } from 'express'
import { OrderController } from '../../../src/drivers/web/orderController'
import { OrderUseCase } from '../../../src/useCases/order'
import { Order } from '../../domain/entities/order'
import { ORDER_STATUS } from '../../../src/constants/order'

describe('OrderController', () => {
    let orderController: OrderController
    let mockOrderUseCase: jest.Mocked<OrderUseCase>
    let req: Partial<Request>
    let res: Partial<Response>

    beforeEach(() => {
        mockOrderUseCase = {
            getOrder: jest.fn(),
            createOrder: jest.fn(),
            updateOrder: jest.fn(),
            deleteOrder: jest.fn(),
            updateOrderStatus: jest.fn(),
            listOrders: jest.fn(),
            orderRepository: {},
        } as unknown as jest.Mocked<OrderUseCase>

        orderController = new OrderController(mockOrderUseCase)

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

    describe('listOrders', () => {
        it('should return a list of orders', async () => {
            const orders = [Order.createMock()]
            mockOrderUseCase.listOrders.mockResolvedValue(orders)

            await orderController.listOrders(req as Request, res as Response)

            expect(mockOrderUseCase.listOrders).toHaveBeenCalled()
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.json).toHaveBeenCalledWith(orders)
        })

        it('should return 500 on error', async () => {
            mockOrderUseCase.listOrders.mockRejectedValue(
                new Error('An unexpected error occurred')
            )

            await orderController.listOrders(req as Request, res as Response)

            expect(res.status).toHaveBeenCalledWith(500)
            expect(res.json).toHaveBeenCalledWith({
                error: 'Error fetching orders',
            })
        })
    })

    describe('createOrder', () => {
        it('should create a new order', async () => {
            req.body = Order.createMock()
            mockOrderUseCase.createOrder.mockResolvedValue('12345')

            await orderController.createOrder(req as Request, res as Response)

            expect(mockOrderUseCase.createOrder).toHaveBeenCalledWith(req.body)
            expect(res.status).toHaveBeenCalledWith(201)
            expect(res.json).toHaveBeenCalledWith({
                id: '12345',
                message: 'Order created successfully',
            })
        })

        it('should return 409 if order already exists', async () => {
            req.body = Order.createMock()
            const error = new Error('Order already exists')
            mockOrderUseCase.createOrder.mockRejectedValue(error)

            await orderController.createOrder(req as Request, res as Response)

            expect(res.status).toHaveBeenCalledWith(409)
            expect(res.json).toHaveBeenCalledWith({
                error: 'Order already exists',
            })
        })

        it('should return 500 on other errors', async () => {
            req.body = Order.createMock()
            mockOrderUseCase.createOrder.mockRejectedValue(
                new Error('An unexpected error occurred')
            )

            await orderController.createOrder(req as Request, res as Response)

            expect(res.status).toHaveBeenCalledWith(500)
            expect(res.json).toHaveBeenCalledWith({
                error: 'An unexpected error occurred',
            })
        })
    })

    describe('updateOrder', () => {
        it('should update a order', async () => {
            req.params = { id: '1' }
            req.body = Order.createMock()
            mockOrderUseCase.updateOrder.mockResolvedValue()

            await orderController.updateOrder(req as Request, res as Response)

            expect(mockOrderUseCase.updateOrder).toHaveBeenCalledWith(
                '1',
                req.body
            )
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.send).toHaveBeenCalledWith(
                'Order 1 updated successfully'
            )
        })

        it('should return 500 on error', async () => {
            req.params = { id: '1' }
            req.body = Order.createMock()
            mockOrderUseCase.updateOrder.mockRejectedValue(
                new Error('An unexpected error occurred')
            )

            await orderController.updateOrder(req as Request, res as Response)

            expect(res.status).toHaveBeenCalledWith(500)
            expect(res.json).toHaveBeenCalledWith({
                error: 'An unexpected error occurred',
            })
        })
    })

    describe('deleteOrder', () => {
        it('should delete a order', async () => {
            req.params = { id: '1' }
            mockOrderUseCase.deleteOrder.mockResolvedValue()

            await orderController.deleteOrder(req as Request, res as Response)

            expect(mockOrderUseCase.deleteOrder).toHaveBeenCalledWith('1')
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.send).toHaveBeenCalledWith(
                'Order 1 deleted successfully'
            )
        })

        it('should return 500 on error', async () => {
            req.params = { id: '1' }
            mockOrderUseCase.deleteOrder.mockRejectedValue(
                new Error('An unexpected error occurred')
            )

            await orderController.deleteOrder(req as Request, res as Response)

            expect(res.status).toHaveBeenCalledWith(500)
            expect(res.json).toHaveBeenCalledWith({
                error: 'An unexpected error occurred',
            })
        })
    })

    describe('getOrder', () => {
        it('should return a order by id', async () => {
            req.params = { id: '1' }
            const order = Order.createMock()
            mockOrderUseCase.getOrder.mockResolvedValue(order)

            await orderController.getOrder(req as Request, res as Response)

            expect(mockOrderUseCase.getOrder).toHaveBeenCalledWith('1')
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.json).toHaveBeenCalledWith(order)
        })

        it('should return 404 if order not found', async () => {
            req.params = { id: '1' }
            mockOrderUseCase.getOrder.mockResolvedValue(null)

            await orderController.getOrder(req as Request, res as Response)

            expect(res.status).toHaveBeenCalledWith(404)
            expect(res.send).toHaveBeenCalledWith('Order not found')
        })

        it('should return 500 on error', async () => {
            req.params = { id: '1' }
            mockOrderUseCase.getOrder.mockRejectedValue(
                new Error('An unexpected error occurred')
            )

            await orderController.getOrder(req as Request, res as Response)

            expect(res.status).toHaveBeenCalledWith(500)
            expect(res.json).toHaveBeenCalledWith({
                error: 'An unexpected error occurred',
            })
        })
    })

    describe('updateOrderStatus', () => {
        it('should update a order status with success', async () => {
            req.params = { id: '1' }
            req.body = { status: ORDER_STATUS.RECEIVED }
            mockOrderUseCase.updateOrderStatus.mockResolvedValue(undefined)

            await orderController.updateOrderStatus(
                req as Request,
                res as Response
            )

            expect(mockOrderUseCase.updateOrderStatus).toHaveBeenCalledWith(
                '1',
                'RECEIVED'
            )
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.send).toHaveBeenCalledWith(
                `Order status 1 updated successfully`
            )
        })

        it('should return 400 for invalid status', async () => {
            req.params = { id: '1' }
            req.body = { status: 'INVALID' }
            mockOrderUseCase.updateOrderStatus.mockResolvedValue(undefined)

            await orderController.updateOrderStatus(
                req as Request,
                res as Response
            )

            expect(res.status).toHaveBeenCalledWith(400)
            expect(res.json).toHaveBeenCalledWith({
                error: 'Invalid status provided',
            })
        })

        it('should return 500 on error', async () => {
            req.params = { id: '1' }
            req.body = { status: ORDER_STATUS.RECEIVED }
            mockOrderUseCase.updateOrder.mockRejectedValue(
                new Error('An unexpected error occurred')
            )

            await orderController.updateOrder(req as Request, res as Response)

            expect(res.status).toHaveBeenCalledWith(500)
            expect(res.json).toHaveBeenCalledWith({
                error: 'An unexpected error occurred',
            })
        })
    })
})
