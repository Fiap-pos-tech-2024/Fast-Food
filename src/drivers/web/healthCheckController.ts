import { Router } from 'express'

export class healthCheckController {
    private routes: Router

    constructor() {
        this.routes = Router()
    }

    public setupRoutes() {
        this.routes.get('/', this.healthCheck)
        return this.routes
    }

    public healthCheck() {
        console.log('ok')
    }
}
