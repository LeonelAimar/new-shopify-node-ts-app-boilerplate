import { Application, Request, Response, NextFunction } from 'express'
import { Shopify, ApiVersion } from "@shopify/shopify-api";
import { server } from '../index.js'

export const reqLogger = ( req: Request, res: Response, next: NextFunction ): void => {
    const AVOID_LOG_KEYWORDS = ['/client', '/node_modules', 'vite', 'react']
    const { path, method } = req
    const someMatch = AVOID_LOG_KEYWORDS
        .map( keyword => path.includes(keyword) )
        .some( match => match === true )

    if ( server.IS_TEST && !someMatch ) console.log(`PATH REQUESTED: ${method} | ${path}`)
    next()
}