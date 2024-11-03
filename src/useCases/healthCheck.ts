export class HealthCheckUseCase {
    healthCheck(): {
        currentEnv: string
        node: string
        timestamp: string
        name: string
    } {
        return {
            currentEnv: 'development',
            node: process.version,
            timestamp: new Date().toUTCString() || 'N/A',
            name: process.env.npm_package_name || 'Fast Food',
        }
    }
}
