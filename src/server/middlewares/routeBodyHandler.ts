import { Request, Response, NextFunction, json } from 'express'
import { server } from '../index.js'

export const routeBodyHandler = ( req: Request, res: Response, next: NextFunction ) => {
    const AVOID_JSON_PARSING_ROUTES = ['/webhooks', '/graphql']
    const path = req.path

    if ( !AVOID_JSON_PARSING_ROUTES.includes(path) ) {
        server.app.use(json())
        return next()
    }

    next()
}