import { Request, Response } from 'express';
import Shopify, { DataType, RegisterReturn } from '@shopify/shopify-api';

import config from '../config/config';

// Models
import Shop from '../models/ShopModel'
import ShopifyProvider from '../providers/ShopifyProvider';

class WebhookController {
    public async registerInitialWebhooks( accessToken: string ): Promise<RegisterReturn[]> {
        const responses: RegisterReturn[] = []
        // Add here the register function for every webhook u want to be registered after app installation
        const uninstallWbkResponse = await this.registerUninstallWebhook( accessToken )
        responses.push(uninstallWbkResponse)
        return responses
    }

    public async processUninstallWebhook( req: Request, res: Response ) {
        console.log('Processing webhook')
        const { domain } = req.body
        const existShop = await Shop.findOne({ domain })
        console.log(existShop)
        if ( existShop ) {
            const removeShop = await Shop.deleteOne({ domain });
            console.log('Deleted => ' + removeShop.deletedCount)
        }
    }

    public async getShopifyWebhooks( req: Request, res: Response): Promise<Response> {
        try {
            const existShop = await Shop.findOne({ domain: process.env.SHOP })
            if ( !existShop ) return res.sendStatus(200)

            const webhooks = await ShopifyProvider.getWebhooks()

            return res.json(webhooks)
        } catch (err) {
            return res.status(500).json({ message: err.message })
        }
    }

    public async getShopifyWebhook( req: Request, res: Response): Promise<Response> {
        try {
            const existShop = await Shop.findOne({ domain: process.env.SHOP })
            if ( !existShop ) return res.sendStatus(200)

            const { webhookId } = req.params

            const rClient = new Shopify.Clients.Rest(existShop.domain, existShop.accessToken)
            const shopifyWebhook = await rClient.get({
                path: `webhooks/${webhookId}`
            })

            return res.json(shopifyWebhook.body)
        } catch (err) {
            return res.status(500).json({ message: err.message })
        }
    }

    public async modifyShopifyWebhook( req: Request, res: Response): Promise<Response> {
        try {
            const existShop = await Shop.findOne({ domain: process.env.SHOP })
            if ( !existShop ) return res.sendStatus(200)

            const { webhookId } = req.params
            const { address } = req.body

            const rClient = new Shopify.Clients.Rest(existShop.domain, existShop.accessToken)
            const updateWebhook = await rClient.put({
                path: `webhooks/${webhookId}`,
                type: DataType.JSON,
                data: {
                    webhook: {
                        id: Number(webhookId),
                        address
                    }
                }
            })

            return res.json(updateWebhook.body)
        } catch (err) {
            return res.status(500).json({ message: err.message })
        }
    }

    // Webhook registration functions ----------------------------------------------
    private async registerUninstallWebhook( accessToken: string ): Promise<RegisterReturn> {
        // Your app should handle the APP_UNINSTALLED webhook to make sure merchants go through OAuth if they reinstall it
        try {
            const response = await Shopify.Webhooks.Registry.register({
                shop: config.SHOPIFY_APP.SHOP,
                accessToken,
                path: '/webhooks/uninstalled',
                topic: 'APP_UNINSTALLED'
            });
            
            console.log('Webhook registered:', response)
            return response
        } catch (err) {
            throw err
        }
    }
}

export default new WebhookController()
