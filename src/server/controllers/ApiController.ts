import { Request, Response } from 'express';
import config from '../config/config';
import Shopify, { RestRequestReturn } from '@shopify/shopify-api';
import Shop from '../models/ShopModel'

// Interfaces
import { IShop } from '../interfaces/ShopInterface'

interface UserRequest extends Request {
    user?: object
}


class ApiController {
    /*  PAGINATED AND QUERIED RESPONSE/REQUEST MONGOOSE PLUGINS EXAMPLE ↓↓↓ */
    // public async getShippings( req: Request, res: Response): Promise<Response> {
    //     if ( !req.query.page ) 
    //         return res.status(400).json({ message: 'Cannot get shippings without pagination' })
        
    //     const page = parseInt(req.query.page as string)
    //     const query = ( req.query.query ) ? JSON.parse(req.query.query as string) : {}
    //     const limit = req.query.limit && Number(req.query.limit) || 10
    //     const sort = req.query.sort ? JSON.parse(req.query.sort as string) : {}

    //     try {
    //         let results = await Shipping.paginate({ query, limit, page, sort })
    //         return res.json(results)
    //     } catch (err) {
    //         return res.status(500).json({ message: err.message })
    //     }
    // }
    
    public async getProducts( req: Request, res: Response): Promise<RestRequestReturn> {
        // Your app should handle the APP_UNINSTALLED webhook to make sure merchants go through OAuth if they reinstall it
        try {
            // Create a new client for the specified shop.
            const existShop = await Shop.findOne({ domain: config.SHOPIFY_APP.SHOP })
            const client = new Shopify.Clients.Rest(existShop.domain, existShop.accessToken);
            // Use `client.get` to request the specified Shopify REST API endpoint, in this case `products`.
            const products = await client.get({
                path: 'products',
            });

            return products
        } catch (err) {
            throw err
        }
    }

    public async getProductsDirect( shopObject: IShop ): Promise<RestRequestReturn> {
        // Your app should handle the APP_UNINSTALLED webhook to make sure merchants go through OAuth if they reinstall it
        try {
            // Create a new client for the specified shop.
            const client = new Shopify.Clients.Rest(shopObject.domain, shopObject.accessToken);
            // Use `client.get` to request the specified Shopify REST API endpoint, in this case `products`.
            const products = await client.get({
                path: 'products',
            });

            return products
        } catch (err) {
            throw err
        }
    }

    public async getProductsTest( req: UserRequest, res: Response ): Promise<Response> {
        if ( req.user ) console.log(req.user)
        const existShop = await Shop.findOne({ domain: config.SHOPIFY_APP.SHOP })
        try {
            // Create a new client for the specified shop.
            const client = new Shopify.Clients.Rest(existShop.domain, existShop.accessToken);
            // Use `client.get` to request the specified Shopify REST API endpoint, in this case `products`.
            const products = await client.get({
                path: 'products',
            });

            return res.json(products)
        } catch (err) {
            throw err
        }
    }
}

export default new ApiController()
