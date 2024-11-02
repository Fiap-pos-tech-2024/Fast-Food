import { ORDER_STATUS } from '../../src/constants/order'
import { OrderRepository } from '../../src/domain/interface/orderRepository'
import { OrderUseCase } from '../../src/useCases/order'

const orderRepository: jest.Mocked<OrderRepository> = {
    getOrder: jest.fn(),
    createOrder: jest.fn(),
    updateOrder: jest.fn(),
    deleteOrder: jest.fn(),
    updateOrderStatus: jest.fn(),
    listOrders: jest.fn(),
}

const orderUseCase = new OrderUseCase(orderRepository)
describe('OrderUseCase', () => {
    describe('When call updateOrderStatus', () => {
        it('should send correctly params', async () => {
            const orderMock = { id: '1', status: ORDER_STATUS.IN_PREPARATION }
            orderRepository.updateOrderStatus.mockResolvedValue()

            await orderUseCase.updateOrderStatus(orderMock.id, orderMock.status)

            expect(orderRepository.updateOrderStatus).toHaveBeenCalledWith(
                orderMock.id,
                orderMock.status
            )
        })
    })
})
