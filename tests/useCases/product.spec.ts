import { ProductUseCase } from '../../src/useCases/product'
import { ProductRepository } from '../../src/domain/interface/productRepository'
import { Product } from '../../src/domain/entities/product'

describe('ProductUseCase', () => {
    let productRepository: jest.Mocked<ProductRepository>
    let useCase: ProductUseCase

    beforeEach(() => {
        productRepository = {
            list: jest.fn(),
            findById: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            findByCategory: jest.fn(),
        }
        useCase = new ProductUseCase(productRepository)
    })

    describe('listProducts', () => {
        it('should return a list of products', async () => {
            const products: Product[] = [
                {
                    idProduct: '1',
                    name: 'Product 1',
                    amount: 10,
                    unitValue: 5,
                } as Product,
            ]
            productRepository.list.mockResolvedValue(products)

            const result = await useCase.listProducts()

            expect(result).toEqual(products)
            expect(productRepository.list).toHaveBeenCalledTimes(1)
        })
    })

    describe('listProductsByCategory', () => {
        it('should return a list of products by category', async () => {
            const category = 'Electronics'
            const products: Product[] = [
                {
                    idProduct: '1',
                    name: 'Product 1',
                    category: 'Electronics',
                    amount: 10,
                    unitValue: 5,
                } as Product,
            ]
            productRepository.findByCategory.mockResolvedValue(products)

            const result = await useCase.listProductsByCategory(category)

            expect(result).toEqual(products)
            expect(productRepository.findByCategory).toHaveBeenCalledWith(
                category
            )
            expect(productRepository.findByCategory).toHaveBeenCalledTimes(1)
        })
    })

    describe('createProduct', () => {
        it('should save a new product', async () => {
            const productData: Product = {
                idProduct: '1',
                name: 'New Product',
                amount: 10,
                unitValue: 5,
            } as Product

            await useCase.createProduct(productData)

            expect(productRepository.save).toHaveBeenCalledWith(productData)
            expect(productRepository.save).toHaveBeenCalledTimes(1)
        })
    })

    describe('updateProduct', () => {
        it('should update product data if product exists', async () => {
            const productId = '1'
            const existingProduct = {
                idProduct: '1',
                name: 'Old Product',
                amount: 10,
                unitValue: 5,
            } as Product
            const updatedProductData: Partial<Product> = {
                name: 'Updated Product',
            }

            productRepository.findById.mockResolvedValue(existingProduct)

            await useCase.updateProduct(productId, updatedProductData)

            expect(productRepository.findById).toHaveBeenCalledWith(productId)
            expect(productRepository.update).toHaveBeenCalledWith(
                productId,
                expect.objectContaining(updatedProductData)
            )
        })

        it('should throw an error if product does not exist', async () => {
            const productId = '1'
            const updatedProductData: Partial<Product> = {
                name: 'Updated Product',
            }

            productRepository.findById.mockResolvedValue(null)

            await expect(
                useCase.updateProduct(productId, updatedProductData)
            ).rejects.toThrow('Product does not exist')
            expect(productRepository.update).not.toHaveBeenCalled()
        })
    })

    describe('deleteProduct', () => {
        it('should delete a product by id if the product exists', async () => {
            const productId = '1'
            const productData: Product = {
                idProduct: '1',
                name: 'Test Product',
                amount: 10,
                unitValue: 5,
            } as Product

            productRepository.findById.mockResolvedValue(productData)

            await useCase.deleteProduct(productId)

            expect(productRepository.findById).toHaveBeenCalledWith(productId)
            expect(productRepository.delete).toHaveBeenCalledWith(productId)
        })

        it('should throw an error if product does not exist', async () => {
            const productId = '1'
            productRepository.findById.mockResolvedValue(null)

            await expect(useCase.deleteProduct(productId)).rejects.toThrow(
                'Product does not exist'
            )
            expect(productRepository.delete).not.toHaveBeenCalled()
        })
    })

    describe('getProduct', () => {
        it('should return a product by id', async () => {
            const productId = '1'
            const productData: Product = {
                idProduct: '1',
                name: 'Test Product',
                amount: 10,
                unitValue: 5,
            } as Product
            productRepository.findById.mockResolvedValue(productData)

            const result = await useCase.getProduct(productId)

            expect(result).toEqual(productData)
            expect(productRepository.findById).toHaveBeenCalledWith(productId)
        })

        it('should return error if product does not exist', async () => {
            const productId = '1'
            productRepository.findById.mockResolvedValue(null)

            await expect(useCase.getProduct(productId)).rejects.toThrow(
                'Product not found'
            )
        })
    })
})
