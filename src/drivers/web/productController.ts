import { Router, Request, Response } from 'express'
import { ProductUseCase } from '../../useCases/product'

interface ErrorType {
    message: string
}

export class ProductController {
    private routes: Router
    private productUseCase: ProductUseCase

    constructor(productUseCase: ProductUseCase) {
        this.routes = Router()
        this.productUseCase = productUseCase
    }

    public setupRoutes() {
        this.routes.post('/', this.createProduct.bind(this))
        this.routes.patch('/:id', this.updateProduct.bind(this))
        this.routes.delete('/:id', this.deleteProduct.bind(this))
        this.routes.get('/:id', this.getProduct.bind(this))
        this.routes.get('/', this.listProducts.bind(this))
        this.routes.get('/category/:category', this.listProductsByCategory.bind(this)) 
        return this.routes
    }

    /**
     * @swagger
     * /product:
     *   get:
     *     summary: Lista todos os produtos
     *     tags: [Products]
     *     responses:
     *       200:
     *         description: Lista de produtos retornada com sucesso
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 type: object
     *                 properties:
     *                   idProduct:
     *                     type: string
     *                     description: ID do produto
     *                   name:
     *                     type: string
     *                     description: Nome do produto
     *                   amount:
     *                     type: number
     *                     description: Quantidade do produto
     *                   unitValue:
     *                     type: number
     *                     description: Valor unitário do produto
     *                   totalValue:
     *                     type: number
     *                     description: Valor total do produto
     *                   createdAt:
     *                     type: string
     *                     format: date-time
     *                     description: Data de criação do produto
     *       500:
     *         description: Erro interno ao buscar os produtos
     */
    public async listProducts(req: Request, res: Response) {
        try {
            const products = await this.productUseCase.listProducts()
            res.status(200).json(products)
        } catch (error) {
            res.status(500).send('Error fetching products')
        }
    }


    public async listProductsByCategory(req: Request, res: Response) {
        try {
            const category = req.params.category
            const products = await this.productUseCase.listProductsByCategory(category)
            res.status(200).json(products)
        } catch (error) {
            res.status(500).send('Error fetching products by category')
        }
    }


    /**
     * @swagger
     * /product:
     *   post:
     *     summary: Cria um novo produto
     *     tags: [Products]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *                 description: Nome do produto
     *               amount:
     *                 type: number
     *                 description: Quantidade do produto
     *               unitValue:
     *                 type: number
     *                 description: Valor unitário do produto
     *     responses:
     *       201:
     *         description: Produto criado com sucesso
     *       409:
     *         description: Produto já existe
     *       500:
     *         description: Erro interno do servidor
     */
    public async createProduct(req: Request, res: Response) {
        try {
            const productData = req.body
            await this.productUseCase.createProduct(productData)
            res.status(201).send('Product created successfully')
        } catch (error: unknown) {
            const errorData = error as ErrorType
            const status_error: { [key: string]: number } = {
                'Product already exists': 409,
            }

            const status_code = status_error[errorData.message] || 500
            const error_message = status_error[errorData.message]
                ? errorData.message
                : 'Internal Server Error'
            res.status(status_code).json({ error: error_message })
        }
    }

    /**
     * @swagger
     * /product/{id}:
     *   patch:
     *     summary: Atualiza os dados de um produto
     *     tags: [Products]
     *     parameters:
     *       - name: id
     *         in: path
     *         required: true
     *         description: ID do produto a ser atualizado
     *         schema:
     *           type: string
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *                 description: Nome do produto
     *               amount:
     *                 type: number
     *                 description: Quantidade do produto
     *               unitValue:
     *                 type: number
     *                 description: Valor unitário do produto
     *     responses:
     *       200:
     *         description: Produto atualizado com sucesso
     *       404:
     *         description: Produto não encontrado
     *       500:
     *         description: Erro interno ao atualizar o produto
     */
    public async updateProduct(req: Request, res: Response) {
        try {
            const productId = req.params.id
            const updatedProductData = req.body
            await this.productUseCase.updateProduct(productId, updatedProductData)
            res.status(200).send(`Product ${productId} updated successfully`)
        } catch (error) {
            res.status(500).send('Error updating product')
        }
    }

    /**
     * @swagger
     * /product/{id}:
     *   delete:
     *     summary: Deleta um produto
     *     tags: [Products]
     *     parameters:
     *       - name: id
     *         in: path
     *         required: true
     *         description: ID do produto a ser deletado
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Produto deletado com sucesso
     *       404:
     *         description: Produto não encontrado
     *       500:
     *         description: Erro interno ao deletar o produto
     */
    public async deleteProduct(req: Request, res: Response) {
        try {
            const productId = req.params.id
            await this.productUseCase.deleteProduct(productId)
            res.status(200).send(`Product ${productId} deleted successfully`)
        } catch (error) {
            res.status(500).send('Error deleting product')
        }
    }

    /**
     * @swagger
     * /product/{id}:
     *   get:
     *     summary: Obtém os dados de um produto específico
     *     tags: [Products]
     *     parameters:
     *       - name: id
     *         in: path
     *         required: true
     *         description: ID do produto a ser buscado
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Dados do produto retornados com sucesso
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 idProduct:
     *                   type: string
     *                   description: ID do produto
     *                 name:
     *                   type: string
     *                   description: Nome do produto
     *                 amount:
     *                   type: number
     *                   description: Quantidade do produto
     *                 unitValue:
     *                   type: number
     *                   description: Valor unitário do produto
     *                 totalValue:
     *                   type: number
     *                   description: Valor total do produto
     *                 createdAt:
     *                   type: string
     *                   format: date-time
     *                   description: Data de criação do produto
     *       404:
     *         description: Produto não encontrado
     *       500:
     *         description: Erro interno ao buscar o produto
     */
    public async getProduct(req: Request, res: Response) {
        try {
            const productId = req.params.id
            const product = await this.productUseCase.getProduct(productId)
            if (product) {
                res.status(200).json(product)
            } else {
                res.status(404).send('Product not found')
            }
        } catch (error) {
            res.status(500).send('Error fetching product')
        }
    }
}
