import { HealthCheckUseCase } from '../../src/useCases/healthCheck'
import { mockedHealthCheck } from '../domain/health/health'

describe('HealthCheckService', () => {
    let healthCheckService: HealthCheckUseCase

    beforeEach(() => {
        healthCheckService = new HealthCheckUseCase()
    })

    it('should return "Health Check"', () => {
        const result = healthCheckService.healthCheck()

        expect(result).toEqual(mockedHealthCheck)
    })
})
