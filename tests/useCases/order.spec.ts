import { OrderUseCase } from '../../src/useCases/order'
import { OrderRepository } from '../../src/domain/interface/orderRepository'
import { Order } from '../../src/domain/entities/order'
import { ClientRepository } from '../../src/domain/interface/clientRepository'
import { Client } from '../domain/entities/client'

describe('orderUseCase', () => {
    let OrderRepository: jest.Mocked<OrderRepository>
    let clientRepository: jest.Mocked<ClientRepository>
    let useCase: OrderUseCase

    beforeEach(() => {
        OrderRepository = {
            getOrder: jest.fn(),
            createOrder: jest.fn(),
            updateOrder: jest.fn(),
            deleteOrder: jest.fn(),
            updateOrderStatus: jest.fn(),
            listOrders: jest.fn(),
        }

        clientRepository = {
            list: jest.fn(),
            findByEmail: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            findById: jest.fn(),
        }
        useCase = new OrderUseCase(OrderRepository, clientRepository)
    })

    describe('listOrders', () => {
        it('should return a list of orders', async () => {
            const ordersData: Order[] = [
                {
                    idOrder: '123',
                    idPayment: null,
                    idClient: '1',
                    cpf: '000.000.000-00',
                    name: 'John Doe',
                    email: 'john@example.com',
                    status: 'RECEIVED',
                    value: 10,
                    itens: [{ idProduct: 'Item 1' }, { idProduct: 'Item 2' }],
                } as Order,
            ]
            OrderRepository.listOrders.mockResolvedValue(ordersData)

            const result = await useCase.listOrders()

            expect(result).toEqual(ordersData)
            expect(OrderRepository.listOrders).toHaveBeenCalledTimes(1)
        })
    })

    describe('createOrder', () => {
        it('should save a new order with client info', async () => {
            const orderData: Order = {
                idOrder: null,
                idPayment: null,
                idClient: '1',
                cpf: '000.000.000-00',
                name: 'John Doe',
                email: 'new@example.com',
                status: 'RECEIVED',
                value: 10,
                itens: [{ idProduct: 'Item 1' }, { idProduct: 'Item 2' }],
            } as Order

            const clientData: Client = {
                idClient: '1',
                email: 'new@example.com',
            } as Client

            clientRepository.findById.mockResolvedValue(clientData)

            await useCase.createOrder(orderData)

            expect(OrderRepository.createOrder).toHaveBeenCalledWith(orderData)
            expect(OrderRepository.createOrder).toHaveBeenCalledTimes(1)
        })

        it('should throw an error if order without client registry', async () => {
            const orderData: Order = {
                idOrder: null,
                idPayment: null,
                idClient: '1',
                cpf: '000.000.000-00',
                name: 'John Doe',
                email: 'john@example.com',
                status: 'RECEIVED',
                value: 10,
            } as Order

            clientRepository.findById.mockResolvedValue(null)

            await expect(useCase.createOrder(orderData)).rejects.toThrow(
                'Client does not exist'
            )
            expect(OrderRepository.createOrder).not.toHaveBeenCalled()
        })

        it('should create a anonymous order if there is no client defined', async () => {
            const orderData: Order = {
                idOrder: null,
                idPayment: null,
                idClient: null,
                cpf: null,
                name: null,
                email: null,
                status: 'RECEIVED',
                value: 10,
            } as Order

            clientRepository.findById.mockResolvedValue(null)

            await useCase.createOrder(orderData)

            expect(OrderRepository.createOrder).toHaveBeenCalledWith(orderData)
            expect(OrderRepository.createOrder).toHaveBeenCalledTimes(1)
            expect(clientRepository.findById).not.toHaveBeenCalled()
        })

        it('should not create an order if already exist', async () => {
            const orderData: Order = {
                idOrder: '1',
                idPayment: null,
                idClient: null,
                cpf: null,
                name: null,
                email: null,
                status: 'RECEIVED',
                value: 10,
            } as Order

            clientRepository.findById.mockResolvedValue(null)

            OrderRepository.getOrder.mockResolvedValue(orderData)

            await expect(useCase.createOrder(orderData)).rejects.toThrow(
                'Order already exist'
            )

            expect(OrderRepository.createOrder).not.toHaveBeenCalled()
            expect(OrderRepository.getOrder).toHaveBeenCalledTimes(1)
            expect(clientRepository.findById).not.toHaveBeenCalled()
        })
    })

    describe('updateOrder', () => {
        it('should update order data if order exists', async () => {
            const orderId = '1'
            const updadatedOrderData: Order = {
                idOrder: '1',
                idPayment: null,
                idClient: null,
                cpf: null,
                name: null,
                email: null,
                status: 'RECEIVED',
                value: 10,
            } as Order

            OrderRepository.getOrder.mockResolvedValue(updadatedOrderData)

            await useCase.updateOrder(orderId, updadatedOrderData)

            expect(OrderRepository.getOrder).toHaveBeenCalledWith(orderId)
            expect(OrderRepository.updateOrder).toHaveBeenCalledWith(
                orderId,
                updadatedOrderData
            )
        })

        it('should throw an error if order does not exist', async () => {
            const orderId = '1'
            const updadatedOrderData: Order = {
                idOrder: '1',
                idPayment: null,
                idClient: null,
                cpf: null,
                name: null,
                email: null,
                status: 'RECEIVED',
                value: 10,
            } as Order

            OrderRepository.getOrder.mockResolvedValue(null)

            await expect(
                useCase.updateOrder(orderId, updadatedOrderData)
            ).rejects.toThrow('Order does not exist')
            expect(OrderRepository.updateOrder).not.toHaveBeenCalled()
        })
    })

    describe('deleteOrder', () => {
        it('should delete a order by id if the order exists', async () => {
            const orderId = '1'
            const orderData: Order = {
                idOrder: '1',
                idPayment: null,
                idClient: null,
                cpf: null,
                name: null,
                email: null,
                status: 'RECEIVED',
                value: 10,
            } as Order

            OrderRepository.getOrder.mockResolvedValue(orderData)

            await useCase.deleteOrder(orderId)

            expect(OrderRepository.getOrder).toHaveBeenCalledWith(orderId)
            expect(OrderRepository.deleteOrder).toHaveBeenCalledWith(orderId)
        })

        it('should throw an error if order does not exist', async () => {
            const orderId = '1'
            OrderRepository.getOrder.mockResolvedValue(null)

            await expect(useCase.deleteOrder(orderId)).rejects.toThrow(
                'Order does not exist'
            )
            expect(OrderRepository.deleteOrder).not.toHaveBeenCalled()
        })
    })

    describe('getOrder', () => {
        it('should return a order by id', async () => {
            const orderId = '1'
            const orderData: Order = {
                idOrder: '1',
                idPayment: null,
                idClient: null,
                cpf: null,
                name: null,
                email: null,
                status: 'RECEIVED',
                value: 10,
            } as Order
            OrderRepository.getOrder.mockResolvedValue(orderData)

            const result = await useCase.getOrder(orderId)

            expect(result).toEqual(orderData)
            expect(OrderRepository.getOrder).toHaveBeenCalledWith(orderId)
        })

        it('should return null if order does not exist', async () => {
            const orderId = '1'
            OrderRepository.getOrder.mockResolvedValue(null)

            const result = await useCase.getOrder(orderId)

            expect(result).toBeNull()
            expect(OrderRepository.getOrder).toHaveBeenCalledWith(orderId)
        })
    })
})
