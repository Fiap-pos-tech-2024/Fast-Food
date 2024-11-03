import { Product } from '../entities/product'

export interface ProductRepository {
    list(): Promise<Product[]>
    save(product: Product): Promise<void>
    update(productId: string, updatedProduct: Product): Promise<void>
    delete(productId: string): Promise<void>
    findById(idProduct: string): Promise<Product | null>
    findByCategory(category: string): Promise<Product[]>
}
