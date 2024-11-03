import { Router, Request, Response } from 'express'
import { HealthCheckUseCase } from '../../useCases/healthCheck'

export class HealthCheckController {
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

    private healthCheck(req: Request, res: Response): void {
        const result = this.healthUseCase.healthCheck()
        res.status(200).json(result)
    }
}
