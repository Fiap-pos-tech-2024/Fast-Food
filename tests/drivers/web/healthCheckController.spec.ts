import { HealthCheckController } from '../../../src/drivers/web/healthCheckController'
import { HealthCheckUseCase } from '../../../src/useCases/healthCheck'
import { Request, Response } from 'express'

describe('HealthCheckController', () => {
    let healthCheckController: HealthCheckController
    let healthCheckUseCase: HealthCheckUseCase
    let req: Partial<Request>
    let res: Partial<Response>

    beforeEach(() => {
        healthCheckUseCase = new HealthCheckUseCase()
        healthCheckController = new HealthCheckController(healthCheckUseCase)
        req = {}
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        }
    })

    it('should return status UP', () => {
        healthCheckController['healthCheck'](req as Request, res as Response)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({ status: 'UP' })
    })
})