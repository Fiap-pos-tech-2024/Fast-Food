import { UserRepository } from '../../domain/interface/userRepository';
import { User } from '../../domain/entities/user';
import { MongoConnection } from '../../config/mongoConfig'; // Importa a conexão com o MongoDB
import { ObjectId } from 'mongodb';

export class MongoUserRepository implements UserRepository {

    private collection = 'users'; 
    private mongoConnection: MongoConnection;

    constructor(mongoConnection: MongoConnection) {
        this.mongoConnection = mongoConnection;
    }

    private async getDb() {
        return this.mongoConnection.getDatabase();
    }

    async save(user: User): Promise<void> {
        const db = await this.getDb(); 
        await db.collection(this.collection).insertOne({
            _id: new ObjectId(),
            cpf: user.cpf,
            name: user.name,
            email: user.email,
            status: user.status,
        });
    }

    async list(): Promise<User[]> {
        const db = await this.getDb();
        const users = await db.collection(this.collection).find().toArray();
        return users.map((user: any) => new User(user._id.toString(), user.cpf, user.name, user.email, user.status));
    }
    

    async update(userId: string, updatedUserData: User): Promise<void> {
        const db = await this.getDb();
        await db.collection(this.collection).updateOne(
            { _id: new ObjectId(userId) },
            { $set: updatedUserData }
        );
    }

    async delete(userId: string): Promise<void> {
        const db = await this.getDb();
        await db.collection(this.collection).deleteOne({ _id: new ObjectId(userId) });
    }

    async findById(userId: string): Promise<User | null> {
        const db = await this.getDb();
        const user = await db.collection(this.collection).findOne({ _id: new ObjectId(userId) });
        if (user) {
            return new User(user._id.toString(), user.cpf, user.name, user.email, user.status);
        }
        return null;
    }

    async findByEmail(email: string): Promise<User | null> {
        const db = await this.getDb();
        const user = await db.collection(this.collection).findOne({ email });
        if (user) {
            return new User(user._id.toString(), user.cpf, user.name, user.email, user.status);
        }
        return null;
    }
    
}
