import { Router, Request, Response } from 'express'
import { clientUseCase } from '../../useCases/client'

interface errorType {
    message: string
}
export class ClientController {
    private routes: Router
    private clientUseCase: clientUseCase

    constructor(clientUseCase: clientUseCase) {
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

    public async listClients(req: Request, res: Response) {
        try {
            const clients = await this.clientUseCase.listClients()
            res.status(200).json(clients)
        } catch (error) {
            console.error(error)
            res.status(500).send('Error fetching clients')
        }
    }

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

    public async updateClient(req: Request, res: Response) {
        try {
            const clientId = req.params.id
            const updatedClientData = req.body
            await this.clientUseCase.updateClient(clientId, updatedClientData)
            res.status(200).send(`Client ${clientId} updated successfully`)
        } catch (error) {
            console.error(error)
            res.status(500).send('Error updating client')
        }
    }

    public async deleteClient(req: Request, res: Response) {
        try {
            const clientId = req.params.id
            await this.clientUseCase.deleteClient(clientId)
            res.status(200).send(`Client ${clientId} deleted successfully`)
        } catch (error) {
            console.error(error)
            res.status(500).send('Error deleting client')
        }
    }

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
            console.error(error)
            res.status(500).send('Error fetching client')
        }
    }
}
