import { Request, Response } from 'express'
import { ORDER_STATUS } from '../../../src/constants/order'
import { OrderController } from '../../../src/drivers/web/orderController'
import { OrderUseCase } from '../../../src/useCases/order'

const orderRepository = {
    getOrder: jest.fn(),
    createOrder: jest.fn(),
    updateOrder: jest.fn(),
    deleteOrder: jest.fn(),
    updateOrderStatus: jest.fn(),
    listOrders: jest.fn(),
}
const orderUseCase = new OrderUseCase(orderRepository)
const orderController = new OrderController(orderUseCase)
const response: Partial<Response> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
    send: jest.fn(),
}

describe('OrderController', () => {
    describe('When update order status', () => {
        it('should update valid status with success', async () => {
            const orderMock = { id: '123', status: ORDER_STATUS.IN_PREPARATION }

            const requestMock: Partial<Request> = {
                params: { id: orderMock.id },
                body: { status: orderMock.status },
            }

            await orderController.updateOrderStatus(
                requestMock as Request,
                response as unknown as Response
            )

            expect(orderRepository.updateOrderStatus).toHaveBeenCalledWith(
                orderMock.id,
                orderMock.status
            )
            expect(response.status).toHaveBeenCalledWith(200)
            expect(response.send).toHaveBeenCalledWith(
                `Order status ${orderMock.id} updated successfully`
            )
        })

        it('should return 400 for invalid status', async () => {
            const orderMock = { id: '123', status: 'INVALID' }

            const request: Partial<Request> = {
                params: { id: orderMock.id },
                body: { status: orderMock.status },
            }

            await orderController.updateOrderStatus(
                request as Request,
                response as Response
            )

            expect(response.status).toHaveBeenCalledWith(400)
            expect(response.json).toHaveBeenCalledWith({
                error: 'Invalid status provided',
            })
        })
    })
})
