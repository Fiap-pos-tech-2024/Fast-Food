import { ProductRepository } from '../domain/interface/productRepository'
import { Product } from '../domain/entities/product'
export class ProductUseCase {
    private productRepository: ProductRepository;

    constructor(productRepository: ProductRepository) {
        this.productRepository = productRepository;
    }

    public async listProducts(): Promise<Product[]> {
        return await this.productRepository.list();
    }

    public async listProductsByCategory(category: string): Promise<Product[]> { // Novo método para listar por categoria
        return await this.productRepository.findByCategory(category);
    }

    public async createProduct(productData: Product): Promise<void> {
        await this.productRepository.save(productData);
    }

    public async updateProduct(productId: string, updatedProductData: Partial<Product>): Promise<void> {
        const existingProduct = await this.productRepository.findById(productId);
        
        if (!existingProduct) {
            throw new Error('Product does not exist');
        }

        const updatedProduct = new Product({
            idProduct: existingProduct.idProduct,
            name: updatedProductData.name ?? existingProduct.name,
            amount: updatedProductData.amount ?? existingProduct.amount,
            unitValue: updatedProductData.unitValue ?? existingProduct.unitValue,
            observation: updatedProductData.observation ?? existingProduct.observation,
            updatedAt: new Date(),
            createdAt: existingProduct.createdAt,
            category: updatedProductData.category ?? existingProduct.category, // Nova propriedade categoria
            calculateTotalValue: existingProduct.calculateTotalValue,
            deletedAt: existingProduct.deletedAt
        });

        await this.productRepository.update(existingProduct.idProduct, updatedProduct);
    }

    public async deleteProduct(productId: string): Promise<void> {
        const existingProduct = await this.productRepository.findById(productId);
        if (!existingProduct) {
            throw new Error('Product does not exist');
        }
        await this.productRepository.delete(productId);
    }

    public async getProduct(productId: string): Promise<Product | null> {
        return await this.productRepository.findById(productId);
    }
}