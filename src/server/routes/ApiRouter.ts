import { Router } from 'express'
import ConfigController from '../controllers/ConfigController';
import ApiController from '../controllers/ApiController'
import WebhookController from '../controllers/WebhookController';

class ApiRouter {
    public router: Router;

    constructor() {
        this.router = Router()
        this.routes()
    }

    routes() {
        // App config routes
        this.router.get('/', (req, res) => res.json({ message: 'NICE, YOU\'RE ON THE API ROUTES!' }))
        this.router.post('/', (req, res) => res.json(req.body))
        this.router.post('/post', (req, res) => res.json(req.body))

        // App config routes
        this.router.get('/config', ConfigController.getConfig)
        this.router.post('/config', ConfigController.setConfig)
        this.router.put('/config/:configId', ConfigController.updateConfig)
    }
}

const apiRouter = new ApiRouter()

export default apiRouter.router