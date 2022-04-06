import { Router } from 'express'
import AuthController from '../controllers/AuthController.js';

class AuthRouter {
    static router: Router; 

    constructor() {
        AuthRouter.router = Router()
        this.routes()
    }

    routes() {
        AuthRouter.router.get('/', AuthController.checkAndBegin)
        AuthRouter.router.get('/toplevel', AuthController.signCookieAndFrontRedirect)
        AuthRouter.router.get('/callback', AuthController.callbackHandling)
    }
}

const authRouter = new AuthRouter()

export default AuthRouter.router