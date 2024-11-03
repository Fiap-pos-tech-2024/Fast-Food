import { ProductController } from '../../../src/drivers/web/productController'
import { ProductUseCase } from '../../../src/useCases/product'
import { Product } from '../../domain/entities/product'
import { Request, Response } from 'express'

describe('ProductController', () => {
    let productController: ProductController
    let mockProductUseCase: jest.Mocked<ProductUseCase>
    let req: Partial<Request>
    let res: Partial<Response>

    beforeEach(() => {
        mockProductUseCase = {
            listProducts: jest.fn(),
            listProductsByCategory: jest.fn(),
            createProduct: jest.fn(),
            updateProduct: jest.fn(),
            deleteProduct: jest.fn(),
            getProduct: jest.fn(),
        } as unknown as jest.Mocked<ProductUseCase>

        productController = new ProductController(mockProductUseCase)

        req = {
            params: {},
            body: {},
        }
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            send: jest.fn(),
        }
    })

    describe('listProducts', () => {
        it('should return a list of products', async () => {
            const products = [Product.createMock()]
            mockProductUseCase.listProducts.mockResolvedValue(products)

            await productController.listProducts(
                req as Request,
                res as Response
            )

            expect(mockProductUseCase.listProducts).toHaveBeenCalled()
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.json).toHaveBeenCalledWith(products)
        })

        it('should return 500 on error', async () => {
            mockProductUseCase.listProducts.mockRejectedValue(
                new Error('Error fetching products')
            )

            await productController.listProducts(
                req as Request,
                res as Response
            )

            expect(res.status).toHaveBeenCalledWith(500)
            expect(res.send).toHaveBeenCalledWith('Error fetching products')
        })
    })

    describe('listProductsByCategory', () => {
        it('should return a list of products by category', async () => {
            const products = [Product.createMock()]
            req.params = { category: 'Electronics' }
            mockProductUseCase.listProductsByCategory.mockResolvedValue(
                products
            )

            await productController.listProductsByCategory(
                req as Request,
                res as Response
            )

            expect(
                mockProductUseCase.listProductsByCategory
            ).toHaveBeenCalledWith('Electronics')
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.json).toHaveBeenCalledWith(products)
        })

        it('should return 500 on error', async () => {
            req.params = { category: 'Electronics' }
            mockProductUseCase.listProductsByCategory.mockRejectedValue(
                new Error('Error fetching products by category')
            )

            await productController.listProductsByCategory(
                req as Request,
                res as Response
            )

            expect(res.status).toHaveBeenCalledWith(500)
            expect(res.send).toHaveBeenCalledWith(
                'Error fetching products by category'
            )
        })
    })

    describe('createProduct', () => {
        it('should create a new product', async () => {
            req.body = Product.createMock()
            mockProductUseCase.createProduct.mockResolvedValue()

            await productController.createProduct(
                req as Request,
                res as Response
            )

            expect(mockProductUseCase.createProduct).toHaveBeenCalledWith(
                req.body
            )
            expect(res.status).toHaveBeenCalledWith(201)
            expect(res.send).toHaveBeenCalledWith(
                'Product created successfully'
            )
        })

        it('should return 409 if product already exists', async () => {
            req.body = Product.createMock()
            const error = new Error('Product already exists')
            mockProductUseCase.createProduct.mockRejectedValue(error)

            await productController.createProduct(
                req as Request,
                res as Response
            )

            expect(res.status).toHaveBeenCalledWith(409)
            expect(res.json).toHaveBeenCalledWith({
                error: 'Product already exists',
            })
        })

        it('should return 500 on other errors', async () => {
            req.body = Product.createMock()
            mockProductUseCase.createProduct.mockRejectedValue(
                new Error('Unexpected error')
            )

            await productController.createProduct(
                req as Request,
                res as Response
            )

            expect(res.status).toHaveBeenCalledWith(500)
            expect(res.json).toHaveBeenCalledWith({
                error: 'Internal Server Error',
            })
        })
    })

    describe('updateProduct', () => {
        it('should update a product', async () => {
            req.params = { id: '1' }
            req.body = Product.createMock()
            mockProductUseCase.updateProduct.mockResolvedValue()

            await productController.updateProduct(
                req as Request,
                res as Response
            )

            expect(mockProductUseCase.updateProduct).toHaveBeenCalledWith(
                '1',
                req.body
            )
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.send).toHaveBeenCalledWith(
                'Product 1 updated successfully'
            )
        })

        it('should return 500 on error', async () => {
            req.params = { id: '1' }
            req.body = Product.createMock()
            mockProductUseCase.updateProduct.mockRejectedValue(
                new Error('Error updating product')
            )

            await productController.updateProduct(
                req as Request,
                res as Response
            )

            expect(res.status).toHaveBeenCalledWith(500)
            expect(res.send).toHaveBeenCalledWith('Error updating product')
        })
    })

    describe('deleteProduct', () => {
        it('should delete a product', async () => {
            req.params = { id: '1' }
            mockProductUseCase.deleteProduct.mockResolvedValue()

            await productController.deleteProduct(
                req as Request,
                res as Response
            )

            expect(mockProductUseCase.deleteProduct).toHaveBeenCalledWith('1')
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.send).toHaveBeenCalledWith(
                'Product 1 deleted successfully'
            )
        })

        it('should return 500 on error', async () => {
            req.params = { id: '1' }
            mockProductUseCase.deleteProduct.mockRejectedValue(
                new Error('Error deleting product')
            )

            await productController.deleteProduct(
                req as Request,
                res as Response
            )

            expect(res.status).toHaveBeenCalledWith(500)
            expect(res.send).toHaveBeenCalledWith('Error deleting product')
        })
    })

    describe('getProduct', () => {
        it('should return a product by id', async () => {
            req.params = { id: '1' }
            const product = Product.createMock()
            mockProductUseCase.getProduct.mockResolvedValue(product)

            await productController.getProduct(req as Request, res as Response)

            expect(mockProductUseCase.getProduct).toHaveBeenCalledWith('1')
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.json).toHaveBeenCalledWith(product)
        })

        it('should return 404 if product not found', async () => {
            req.params = { id: '1' }
            mockProductUseCase.getProduct.mockResolvedValue(null)

            await productController.getProduct(req as Request, res as Response)

            expect(res.status).toHaveBeenCalledWith(404)
            expect(res.send).toHaveBeenCalledWith('Product not found')
        })

        it('should return 500 on error', async () => {
            req.params = { id: '1' }
            mockProductUseCase.getProduct.mockRejectedValue(
                new Error('Error fetching product')
            )

            await productController.getProduct(req as Request, res as Response)

            expect(res.status).toHaveBeenCalledWith(500)
            expect(res.send).toHaveBeenCalledWith('Error fetching product')
        })
    })
})
