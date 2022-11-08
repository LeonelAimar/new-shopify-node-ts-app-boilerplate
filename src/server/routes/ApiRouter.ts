import { Router } from 'express'

class ApiRouter {
    public router: Router;

    constructor() {
        this.router = Router()
        this.routes()
    }

    routes() {
        // App config routes
        this.router.get('/', (req, res) => res.json({ message: 'NICE, YOU\'RE ON THE API ROUTES!' }))
    }
}

const apiRouter = new ApiRouter()

export default apiRouter.router