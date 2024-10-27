import { MongoClient, Db } from 'mongodb';

export class MongoConnection {
    private static instance: MongoConnection;
    private client: MongoClient;
    private db: Db | null = null;
    private readonly url = 'mongodb://mongo:27017';
    private readonly dbName = 'fiap';

    constructor() {
        this.client = new MongoClient(this.url);
    }

    public static getInstance(): MongoConnection {
        if (!MongoConnection.instance) {
            MongoConnection.instance = new MongoConnection();
        }
        return MongoConnection.instance;
    }

    public async connect(): Promise<void> {
        if (!this.db) {
            try {
                await this.client.connect(); 
                this.db = this.client.db(this.dbName); 
                console.log('Connected to MongoDB');
            } catch (error) {
                console.error('Error connecting to MongoDB:', error);
                throw new Error('Failed to connect to MongoDB');
            }
        }
    }

    public getDatabase(): Db {
        if (!this.db) {
            throw new Error('Database not connected');
        }
        return this.db;
    }

    public async close(): Promise<void> {
        if (this.client && this.db) {
            await this.client.close();
            this.db = null;
            console.log('MongoDB connection closed');
        }
    }
}
