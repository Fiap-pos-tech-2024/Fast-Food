import { ClientRepository } from '../../domain/interface/clientRepository'
import { Client } from '../../domain/entities/client'
import { MongoConnection } from '../../config/mongoConfig' // Importa a conexão com o MongoDB
import { ObjectId } from 'mongodb'

export class MongoClientRepository implements ClientRepository {
    private collection = 'clients'
    private mongoConnection: MongoConnection

    constructor(mongoConnection: MongoConnection) {
        this.mongoConnection = mongoConnection
    }

    private async getDb() {
        return this.mongoConnection.getDatabase()
    }

    async save(client: Client): Promise<void> {
        const db = await this.getDb()
        await db.collection(this.collection).insertOne({
            _id: new ObjectId(),
            cpf: client.cpf,
            name: client.name,
            email: client.email,
            status: client.status,
        })
    }

    async list(): Promise<Client[]> {
        const db = await this.getDb()
        const clients = await db.collection(this.collection).find().toArray()
        return clients.map(
            (client) =>
                new Client(
                    client._id.toString(),
                    client.cpf,
                    client.name,
                    client.email,
                    client.status
                )
        )
    }

    async update(clientId: string, updatedClientData: Client): Promise<void> {
        const db = await this.getDb()
        await db
            .collection(this.collection)
            .updateOne(
                { _id: new ObjectId(clientId) },
                { $set: updatedClientData }
            )
    }

    async delete(clientId: string): Promise<void> {
        const db = await this.getDb()
        await db
            .collection(this.collection)
            .deleteOne({ _id: new ObjectId(clientId) })
    }

    async findById(clientId: string): Promise<Client | null> {
        const db = await this.getDb()
        const client = await db
            .collection(this.collection)
            .findOne({ _id: new ObjectId(clientId) })
        if (client) {
            return new Client(
                client._id.toString(),
                client.cpf,
                client.name,
                client.email,
                client.status
            )
        }
        return null
    }

    async findByEmail(email: string): Promise<Client | null> {
        const db = await this.getDb()
        const client = await db.collection(this.collection).findOne({ email })
        if (client) {
            return new Client(
                client._id.toString(),
                client.cpf,
                client.name,
                client.email,
                client.status
            )
        }
        return null
    }
}
