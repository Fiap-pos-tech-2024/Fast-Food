import { ClientRepository } from '../domain/interface/clientRepository';
import { Client } from '../domain/entities/client';

export class clientUseCase {
    private clientRepository: ClientRepository;

    constructor(clientRepository: ClientRepository) {
        this.clientRepository = clientRepository;
    }

    public async listClients(): Promise<Client[]> {
        const clients = await this.clientRepository.list();
        return clients;
    }

    public async createClient(clientData: Client): Promise<void> {
        const client = await this.clientRepository.findByEmail(clientData.email);
        if (client) {
            throw new Error('Client already exists');
        }
        await this.clientRepository.save(clientData);
    }

    public async updateClient(clientId: string, updatedClientData: Client): Promise<void> {
        await this.clientRepository.update(clientId, updatedClientData);
    }

    public async deleteClient(clientId: string): Promise<void> {
        await this.clientRepository.delete(clientId);
    }

    public async getClient(clientId: string): Promise<Client | null> {
        const client = await this.clientRepository.findById(clientId);
        return client;
    }
}
