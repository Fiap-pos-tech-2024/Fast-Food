import { Client } from '../entities/client'
export interface ClientRepository {
    save(client: Client): Promise<void>
    update(clientId: string, updatedClientData: Client): Promise<void>
    delete(clientId: string): Promise<void>
    findById(clientId: string): Promise<Client | null>
    list(): Promise<Client[]>
    findByEmail(email: string): Promise<Client | null>
}
