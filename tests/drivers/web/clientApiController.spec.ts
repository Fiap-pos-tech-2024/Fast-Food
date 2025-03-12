import { Request, Response } from 'express'
import { ClientApiController } from '../../../src/drivers/web/clientApiController'
import { ClientUseCase } from '../../../src/useCases/client'
import { Client } from '../../domain/entities/client'

describe('ClientApiController', () => {
    let clientController: ClientApiController
    let mockClientUseCase: jest.Mocked<ClientUseCase>
    let req: Partial<Request>
    let res: Partial<Response>

    beforeEach(() => {
        mockClientUseCase = {
            listClients: jest.fn(),
            createClient: jest.fn(),
            updateClient: jest.fn(),
            deleteClient: jest.fn(),
            getClient: jest.fn(),
            clientRepository: {},
        } as unknown as jest.Mocked<ClientUseCase>

        clientController = new ClientApiController(mockClientUseCase)

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

    describe('listClients', () => {
        it('should return a list of clients', async () => {
            const clients = [Client.createMock()]
            mockClientUseCase.listClients.mockResolvedValue(clients)

            await clientController.listClients(req as Request, res as Response)

            expect(mockClientUseCase.listClients).toHaveBeenCalled()
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.json).toHaveBeenCalledWith(clients)
        })

        it('should return 500 on error', async () => {
            mockClientUseCase.listClients.mockRejectedValue(
                new Error('Error fetching clients')
            )

            await clientController.listClients(req as Request, res as Response)

            expect(res.status).toHaveBeenCalledWith(500)
            expect(res.send).toHaveBeenCalledWith('Error fetching clients')
        })
    })

    describe('createClient', () => {
        it('should create a new client', async () => {
            req.body = Client.createMock()
            mockClientUseCase.createClient.mockResolvedValue('12345')

            await clientController.createClient(req as Request, res as Response)

            expect(mockClientUseCase.createClient).toHaveBeenCalledWith(
                req.body
            )
            expect(res.status).toHaveBeenCalledWith(201)
            expect(res.json).toHaveBeenCalledWith({
                id: '12345',
                message: 'Client created successfully',
            })
        })

        it('should return 409 if client already exists', async () => {
            req.body = Client.createMock()
            const error = new Error('Client already exists')
            mockClientUseCase.createClient.mockRejectedValue(error)

            await clientController.createClient(req as Request, res as Response)

            expect(res.status).toHaveBeenCalledWith(409)
            expect(res.json).toHaveBeenCalledWith({
                error: 'Client already exists',
            })
        })

        it('should return 500 on other errors', async () => {
            req.body = Client.createMock()
            mockClientUseCase.createClient.mockRejectedValue(
                new Error('Unexpected error')
            )

            await clientController.createClient(req as Request, res as Response)

            expect(res.status).toHaveBeenCalledWith(500)
            expect(res.json).toHaveBeenCalledWith({
                error: 'Internal Server Error',
            })
        })
    })

    describe('updateClient', () => {
        it('should update a client', async () => {
            req.params = { id: '1' }
            req.body = Client.createMock()
            mockClientUseCase.updateClient.mockResolvedValue()

            await clientController.updateClient(req as Request, res as Response)

            expect(mockClientUseCase.updateClient).toHaveBeenCalledWith(
                '1',
                req.body
            )
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.send).toHaveBeenCalledWith(
                'Client 1 updated successfully'
            )
        })

        it('should return 500 on error', async () => {
            req.params = { id: '1' }
            req.body = Client.createMock()
            mockClientUseCase.updateClient.mockRejectedValue(
                new Error('Error updating client')
            )

            await clientController.updateClient(req as Request, res as Response)

            expect(res.status).toHaveBeenCalledWith(500)
            expect(res.send).toHaveBeenCalledWith('Error updating client')
        })
    })

    describe('deleteClient', () => {
        it('should delete a client', async () => {
            req.params = { id: '1' }
            mockClientUseCase.deleteClient.mockResolvedValue()

            await clientController.deleteClient(req as Request, res as Response)

            expect(mockClientUseCase.deleteClient).toHaveBeenCalledWith('1')
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.send).toHaveBeenCalledWith(
                'Client 1 deleted successfully'
            )
        })

        it('should return 500 on error', async () => {
            req.params = { id: '1' }
            mockClientUseCase.deleteClient.mockRejectedValue(
                new Error('Error deleting client')
            )

            await clientController.deleteClient(req as Request, res as Response)

            expect(res.status).toHaveBeenCalledWith(500)
            expect(res.send).toHaveBeenCalledWith('Error deleting client')
        })
    })

    describe('getClient', () => {
        it('should return a client by id', async () => {
            req.params = { id: '1' }
            const client = Client.createMock()
            mockClientUseCase.getClient.mockResolvedValue(client)

            await clientController.getClient(req as Request, res as Response)

            expect(mockClientUseCase.getClient).toHaveBeenCalledWith('1')
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.json).toHaveBeenCalledWith(client)
        })
        it('should return 404 if client not found', async () => {
            req.params = { id: '1' }
            const error = new Error('Client not found')
            mockClientUseCase.getClient.mockRejectedValue(error)

            await clientController.getClient(req as Request, res as Response)

            expect(res.status).toHaveBeenCalledWith(404)
            expect(res.json).toHaveBeenCalledWith({
                error: 'Client not found',
            })
        })

        it('should return 500 on error', async () => {
            req.params = { id: '1' }
            const error = new Error('Error fetching client')
            mockClientUseCase.getClient.mockRejectedValue(error)

            await clientController.getClient(req as Request, res as Response)

            expect(res.status).toHaveBeenCalledWith(500)
            expect(res.json).toHaveBeenCalledWith({
                error: 'Error fetching client',
            })
        })
    })
})
