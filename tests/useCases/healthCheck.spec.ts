import { HealthCheckUseCase } from '../../src/useCases/healthCheck';

describe('HealthCheckService', () => {
    let healthCheckService: HealthCheckUseCase;

    beforeEach(() => {
        healthCheckService = new HealthCheckUseCase();
    });

    it('should log "Health Check"', () => {
        const consoleSpy = jest.spyOn(console, 'log');
        healthCheckService.healthCheck();
        expect(consoleSpy).toHaveBeenCalledWith('Health Check');
        consoleSpy.mockRestore();
    });
});