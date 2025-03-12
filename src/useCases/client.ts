import { ClientRepository } from '../domain/interface/clientRepository'
import { Client } from '../domain/entities/client'

export class ClientUseCase {
    private clientRepository: ClientRepository

    constructor(clientRepository: ClientRepository) {
        this.clientRepository = clientRepository
    }

    public async listClients(): Promise<Client[]> {
        const clients = await this.clientRepository.list()
        return clients
    }

    public async createClient(clientData: Client): Promise<string> {
        const client = await this.clientRepository.findByEmail(clientData.email)
        if (client) {
            throw new Error('Client already exists')
        }
        const result = await this.clientRepository.save(clientData)
        return result
    }

    public async updateClient(
        clientId: string,
        updatedClientData: Client
    ): Promise<void> {
        const existingClient = await this.clientRepository.findById(clientId)
        if (!existingClient) {
            throw new Error('Client does not exist')
        }
        await this.clientRepository.update(clientId, updatedClientData)
    }

    public async deleteClient(clientId: string): Promise<void> {
        const existingClient = await this.clientRepository.findById(clientId)
        if (!existingClient) {
            throw new Error('Client does not exist')
        }

        await this.clientRepository.delete(clientId)
    }

    public async getClient(clientId: string): Promise<Client | null> {
        const client = await this.clientRepository.findById(clientId)
        if (!client) {
            throw new Error('Client not found')
        }
        return client
    }
}
