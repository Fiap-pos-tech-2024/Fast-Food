import { Router, Request, Response } from 'express'
import { ClientUseCase } from '../../useCases/client'

interface errorType {
    message: string
}
export class ClientController {
    private routes: Router
    private clientUseCase: ClientUseCase

    constructor(clientUseCase: ClientUseCase) {
        this.routes = Router()
        this.clientUseCase = clientUseCase
    }

    public setupRoutes() {
        this.routes.post('/', this.createClient.bind(this))
        this.routes.patch('/:id', this.updateClient.bind(this))
        this.routes.delete('/:id', this.deleteClient.bind(this))
        this.routes.get('/:id', this.getClient.bind(this))
        this.routes.get('/', this.listClients.bind(this))
        return this.routes
    }

    /**
     * @swagger
     * /client:
     *   get:
     *     summary: Lista todos os clientes
     *     tags: [Clients]
     *     responses:
     *       200:
     *         description: Lista de clientes retornada com sucesso
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 type: object
     *                 properties:
     *                   idClient:
     *                     type: string
     *                     description: ID do cliente
     *                   cpf:
     *                     type: string
     *                     description: CPF do cliente
     *                   name:
     *                     type: string
     *                     description: Nome do cliente
     *                   email:
     *                     type: string
     *                     description: E-mail do cliente
     *       500:
     *         description: Erro interno ao buscar os clientes
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   description: Mensagem de erro
     */
    public async listClients(req: Request, res: Response) {
        try {
            const clients = await this.clientUseCase.listClients()
            res.status(200).json(clients)
        } catch (error) {
            res.status(500).send('Error fetching clients')
        }
    }

    /**
     * @swagger
     * /client:
     *   post:
     *     summary: Cria um novo cliente
     *     tags: [Clients]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               idClient:
     *                 type: string
     *                 description: ID do cliente (opcional)
     *               cpf:
     *                 type: string
     *                 description: CPF do cliente
     *               name:
     *                 type: string
     *                 description: Nome do cliente
     *               email:
     *                 type: string
     *                 description: E-mail do cliente
     *     responses:
     *       201:
     *         description: Cliente criado com sucesso
     *         content:
     *           text/plain:
     *             schema:
     *               type: string
     *       409:
     *         description: Cliente já existe
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   description: Mensagem de erro
     *       500:
     *         description: Erro interno do servidor
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   description: Mensagem de erro
     */
    public async createClient(req: Request, res: Response) {
        try {
            const clientData = req.body
            await this.clientUseCase.createClient(clientData)
            res.status(201).send('Client created successfully')
        } catch (error: unknown) {
            const errorData = error as errorType
            const status_error: { [key: string]: number } = {
                'Client already exists': 409,
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
     * /client/{id}:
     *   patch:
     *     summary: Atualiza os dados de um cliente
     *     tags: [Clients]
     *     parameters:
     *       - name: id
     *         in: path
     *         required: true
     *         description: ID do cliente a ser atualizado
     *         schema:
     *           type: string
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               idClient:
     *                 type: string
     *                 description: ID do cliente (opcional)
     *               cpf:
     *                 type: string
     *                 description: CPF do cliente
     *               name:
     *                 type: string
     *                 description: Nome do cliente
     *               email:
     *                 type: string
     *                 description: E-mail do cliente
     *     responses:
     *       200:
     *         description: Cliente atualizado com sucesso
     *         content:
     *           text/plain:
     *             schema:
     *               type: string
     *       404:
     *         description: Cliente não encontrado
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   description: Mensagem de erro
     *       500:
     *         description: Erro interno ao atualizar o cliente
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   description: Mensagem de erro
     */
    public async updateClient(req: Request, res: Response) {
        try {
            const clientId = req.params.id
            const updatedClientData = req.body
            await this.clientUseCase.updateClient(clientId, updatedClientData)
            res.status(200).send(`Client ${clientId} updated successfully`)
        } catch (error) {
            res.status(500).send('Error updating client')
        }
    }

    /**
     * @swagger
     * /client/{id}:
     *   delete:
     *     summary: Deleta um cliente
     *     tags: [Clients]
     *     parameters:
     *       - name: id
     *         in: path
     *         required: true
     *         description: ID do cliente a ser deletado
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Cliente deletado com sucesso
     *         content:
     *           text/plain:
     *             schema:
     *               type: string
     *       404:
     *         description: Cliente não encontrado
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   description: Mensagem de erro
     *       500:
     *         description: Erro interno ao deletar o cliente
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   description: Mensagem de erro
     */
    public async deleteClient(req: Request, res: Response) {
        try {
            const clientId = req.params.id
            await this.clientUseCase.deleteClient(clientId)
            res.status(200).send(`Client ${clientId} deleted successfully`)
        } catch (error) {
            res.status(500).send('Error deleting client')
        }
    }

    /**
     * @swagger
     * /client/{id}:
     *   get:
     *     summary: Obtém os dados de um cliente específico
     *     tags: [Clients]
     *     parameters:
     *       - name: id
     *         in: path
     *         required: true
     *         description: ID do cliente a ser buscado
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Dados do cliente retornados com sucesso
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 idClient:
     *                   type: string
     *                   description: ID do cliente
     *                 cpf:
     *                   type: string
     *                   description: CPF do cliente
     *                 name:
     *                   type: string
     *                   description: Nome do cliente
     *                 email:
     *                   type: string
     *                   description: E-mail do cliente
     *       404:
     *         description: Cliente não encontrado
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   description: Mensagem de erro
     *       500:
     *         description: Erro interno ao buscar o cliente
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     *                   description: Mensagem de erro
     */
    public async getClient(req: Request, res: Response) {
        try {
            const clientId = req.params.id
            const client = await this.clientUseCase.getClient(clientId)
            if (client) {
                res.status(200).json(client)
            } else {
                res.status(404).send('Client not found')
            }
        } catch (error) {
            res.status(500).send('Error fetching client')
        }
    }
}
