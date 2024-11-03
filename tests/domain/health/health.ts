export const mockedHealthCheck = {
    currentEnv: 'development',
    node: process.version,
    timestamp: new Date().toUTCString(),
    name: process.env.npm_package_name || 'Fast Food',
}
