import { ProductRepository } from '../../domain/interface/productRepository'
import { Product } from '../../domain/entities/product'
import { MongoConnection } from '../../config/mongoConfig'
import { ObjectId } from 'mongodb'

export class MongoProductRepository implements ProductRepository {
    private collection = 'products'
    private mongoConnection: MongoConnection

    constructor(mongoConnection: MongoConnection) {
        this.mongoConnection = mongoConnection
    }

    private async getDb() {
        return this.mongoConnection.getDatabase()
    }

    async save(product: Product): Promise<void> {
        const db = await this.getDb()
        const result = await db.collection(this.collection).insertOne({
            name: product.name,
            amount: product.amount,
            unitValue: product.unitValue,
            category: product.category,
            observation: product.observation,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt,
            deletedAt: product.deletedAt,
        })

        product.idProduct = result.insertedId.toString()
    }

    async list(): Promise<Product[]> {
        const db = await this.getDb()
        const products = await db.collection(this.collection).find().toArray()
        return products.map(
            (product) =>
                new Product({
                    idProduct: product._id.toString(),
                    name: product.name,
                    amount: product.amount,
                    unitValue: product.unitValue,
                    observation: product.observation,
                    createdAt: product.createdAt,
                    updatedAt: product.updatedAt,
                    deletedAt: product.deletedAt,
                    category: product.category,
                    calculateTotalValue: product.calculateTotalValue,
                })
        )
    }

    async update(
        productId: string,
        updatedProductData: Partial<Product>
    ): Promise<void> {
        const db = await this.getDb()
        await db
            .collection(this.collection)
            .updateOne(
                { _id: new ObjectId(productId) },
                { $set: updatedProductData }
            )
    }

    async delete(productId: string): Promise<void> {
        const db = await this.getDb()
        await db
            .collection(this.collection)
            .deleteOne({ _id: new ObjectId(productId) })
    }

    async findById(idProduct: string): Promise<Product | null> {
        const db = await this.getDb()
        const product = await db
            .collection(this.collection)
            .findOne({ _id: new ObjectId(idProduct) })
        if (product) {
            return new Product({
                idProduct: product._id.toString(),
                name: product.name,
                amount: product.amount,
                unitValue: product.unitValue,
                observation: product.observation,
                createdAt: product.createdAt,
                updatedAt: product.updatedAt,
                deletedAt: product.deletedAt,
                category: product.category,
                calculateTotalValue: product.calculateTotalValue,
            })
        }
        return null
    }

    async findByCategory(category: string): Promise<Product[]> {
        const db = await this.getDb()
        const products = await db
            .collection(this.collection)
            .find({ category })
            .toArray()
        return products.map(
            (product) =>
                new Product({
                    idProduct: product._id.toString(),
                    name: product.name,
                    amount: product.amount,
                    unitValue: product.unitValue,
                    observation: product.observation,
                    createdAt: product.createdAt,
                    updatedAt: product.updatedAt,
                    deletedAt: product.deletedAt,
                    category: product.category,
                    calculateTotalValue: product.calculateTotalValue,
                })
        )
    }
}
