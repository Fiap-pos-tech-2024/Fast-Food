import { Router, Request, Response } from 'express'
import { HealthCheckUseCase } from '../../useCases/healthCheck'

export class HealthCheckApiController {
    private router: Router
    private healthUseCase: HealthCheckUseCase

    constructor(healthUseCase: HealthCheckUseCase) {
        this.router = Router()
        this.healthUseCase = healthUseCase
        this.setupRoutes()
    }

    public setupRoutes(): Router {
        this.router.get('/', this.healthCheck.bind(this))
        return this.router
    }

    /**
     * @swagger
     * /health:
     *   get:
     *     summary: Verifica a saúde do sistema
     *     tags: [Health]
     *     description: Retorna o estado atual do sistema, incluindo informações sobre o ambiente e a versão do Node.js.
     *     responses:
     *       '200':
     *         description: Retorno bem-sucedido com o estado de saúde do sistema.
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 currentEnv:
     *                   type: string
     *                   example: "development"
     *                 node:
     *                   type: string
     *                   example: "v14.17.0"
     *                 timestamp:
     *                   type: string
     *                   format: date-time
     *                   example: "Fri, 03 Nov 2024 10:00:00 GMT"
     *                 name:
     *                   type: string
     *                   example: "Fast Food"
     *       '500':
     *         description: Erro interno do servidor
     */
    private healthCheck(req: Request, res: Response): void {
        const result = this.healthUseCase.healthCheck()
        res.status(200).json(result)
    }
}
