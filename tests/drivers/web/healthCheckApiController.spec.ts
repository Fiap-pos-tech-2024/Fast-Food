import { HealthCheckApiController } from '../../../src/drivers/web/healthCheckApiController'
import { HealthCheckUseCase } from '../../../src/useCases/healthCheck'
import { Request, Response } from 'express'
import { mockedHealthCheck } from '../../domain/health/health'

describe('HealthCheckApiController', () => {
    let healthCheckController: HealthCheckApiController
    let healthCheckUseCase: HealthCheckUseCase
    let req: Partial<Request>
    let res: Partial<Response>

    beforeEach(() => {
        healthCheckUseCase = new HealthCheckUseCase()
        healthCheckController = new HealthCheckApiController(healthCheckUseCase)
        req = {}
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        }
    })

    it('should return health check status', () => {
        healthCheckController['healthCheck'](req as Request, res as Response)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith(mockedHealthCheck)
    })
})
