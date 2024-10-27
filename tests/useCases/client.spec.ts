import { clientUseCase } from '../../src/useCases/client';
import { ClientRepository } from '../../src/domain/interface/clientRepository';
import { Client } from '../domain/entities/client';

describe('clientUseCase', () => {
    let clientRepository: jest.Mocked<ClientRepository>;
    let useCase: clientUseCase;

    beforeEach(() => {
        clientRepository = {
            list: jest.fn(),
            findByEmail: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            findById: jest.fn(),
        };
        useCase = new clientUseCase(clientRepository);
    });

    describe('listClients', () => {
        it('should return a list of clients', async () => {
            const clients: Client[] = [{ idClient: '1', email: 'test@example.com' } as Client];
            clientRepository.list.mockResolvedValue(clients);

            const result = await useCase.listClients();

            expect(result).toEqual(clients);
            expect(clientRepository.list).toHaveBeenCalledTimes(1);
        });
    });

    describe('createClient', () => {
        it('should save a new client if not already exists', async () => {
            const clientData: Client = { idClient: '1', email: 'new@example.com' } as Client;
            clientRepository.findByEmail.mockResolvedValue(null);

            await useCase.createClient(clientData);

            expect(clientRepository.findByEmail).toHaveBeenCalledWith(clientData.email);
            expect(clientRepository.save).toHaveBeenCalledWith(clientData);
        });

        it('should throw an error if client already exists', async () => {
            const clientData: Client = { idClient: '1', email: 'existing@example.com' } as Client;
            clientRepository.findByEmail.mockResolvedValue(clientData);

            await expect(useCase.createClient(clientData)).rejects.toThrow('Client already exists');
            expect(clientRepository.save).not.toHaveBeenCalled();
        });
    });

    describe('updateClient', () => {
        it('should update client data', async () => {
            const clientId = '1';
            const updatedClientData: Client = { idClient: '1', email: 'updated@example.com' } as Client;

            await useCase.updateClient(clientId, updatedClientData);

            expect(clientRepository.update).toHaveBeenCalledWith(clientId, updatedClientData);
        });
    });

    describe('deleteClient', () => {
        it('should delete a client by id', async () => {
            const clientId = '1';

            await useCase.deleteClient(clientId);

            expect(clientRepository.delete).toHaveBeenCalledWith(clientId);
        });
    });

    describe('getClient', () => {
        it('should return a client by id', async () => {
            const clientId = '1';
            const clientData: Client = { idClient: '1', email: 'test@example.com' } as Client;
            clientRepository.findById.mockResolvedValue(clientData);

            const result = await useCase.getClient(clientId);

            expect(result).toEqual(clientData);
            expect(clientRepository.findById).toHaveBeenCalledWith(clientId);
        });

        it('should return null if client does not exist', async () => {
            const clientId = '1';
            clientRepository.findById.mockResolvedValue(null);

            const result = await useCase.getClient(clientId);

            expect(result).toBeNull();
            expect(clientRepository.findById).toHaveBeenCalledWith(clientId);
        });
    });
});
