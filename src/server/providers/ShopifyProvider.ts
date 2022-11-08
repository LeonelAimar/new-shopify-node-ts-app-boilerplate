import { LATEST_API_VERSION, Shopify } from '@shopify/shopify-api'
import { 
    Customer, Metafield, Product, Collection, Order, Transaction,
    Webhook
} from '@shopify/shopify-api/dist/rest-resources/2022-10/index';
import { 
    CreateCustomerParams, CreateTransactionParams, GetMetafieldByOwnerParams, 
    MetafieldOwner, NewTransactionFields, UpdateCustomerParams,
    GqlRemoveOrderItemParams, GqlAddOrderItemParams, GqlAddOrderItemDiscountParams
} from '../interfaces/ShopifyInterfaces';
import config from '../config/config.js'
import HelpersController from '../controllers/HelpersController';
import Shop from '../models/ShopModel'
import { IShop } from '../interfaces/ShopInterface';
import { GraphqlClient } from '@shopify/shopify-api/dist/clients/graphql';
import { GQL_MUTATIONS } from '../utils/ShopifyConstants'

class ShopifyProvider {
    private shop: IShop;
    private API_KEY: string
    private API_PASSWORD: string
    private API_ACCESS_TOKEN: string
    private SCOPES: string[]
    private DOMAIN: string

    constructor( shop?: IShop ) {
        this.API_KEY = config.SHOPIFY_APP.API_KEY
        this.API_PASSWORD = config.SHOPIFY_APP.API_SECRET_KEY
        this.SCOPES = config.SHOPIFY_APP.SCOPES
        this.DOMAIN = config.SHOPIFY_APP.SHOP

        if ( shop ) {
            this.shop = shop
            this.API_ACCESS_TOKEN = shop.accessToken
            // this.ctxConfig()
            return
        }

        if ( !!config.SHOPIFY_APP.ACCESS_TOKEN ) {
            this.shop = { 
                accessToken: config.SHOPIFY_APP.ACCESS_TOKEN,
                domain: config.SHOPIFY_APP.SHOP
            } as IShop

            this.API_ACCESS_TOKEN = config.SHOPIFY_APP.ACCESS_TOKEN
            return
        }

        this.readyChecker()
    }

    static sessionRemover<T>( classArray: T[] ): T[] {
        return classArray.map( (obj: any) => {
            if ( obj.session ) delete obj.session
            Object.keys(obj).forEach( key => {
                if ( Array.isArray( obj[key] ) ) 
                    obj[key] = ShopifyProvider.sessionRemover( obj[key] )
            })

            return obj
        })
    }

    private async readyChecker(): Promise<void> {
        if ( this.shop ) return
        const shop = await Shop.findOne({ domain: config.SHOPIFY_APP.SHOP })
        this.shop = shop
        this.API_KEY = config.SHOPIFY_APP.API_KEY
        this.API_PASSWORD = config.SHOPIFY_APP.API_SECRET_KEY
        this.API_ACCESS_TOKEN = shop.accessToken
        this.SCOPES = config.SHOPIFY_APP.SCOPES
        this.DOMAIN = config.SHOPIFY_APP.SHOP
    }

    private ctxConfig() {
        Shopify.Context.initialize({
            API_KEY: config.SHOPIFY_APP.API_KEY,
            API_SECRET_KEY: config.SHOPIFY_APP.API_SECRET_KEY,
            SCOPES: config.SHOPIFY_APP.SCOPES,
            HOST_NAME: config.SHOPIFY_APP.HOST,
            IS_EMBEDDED_APP: false,
            API_VERSION: LATEST_API_VERSION, // all supported versions are available, as well as "unstable" and "unversioned"
            SESSION_STORAGE: new Shopify.Session.MemorySessionStorage()
        })
    }

    public buildFakeSession() {
        return {
            isOnline: false,
            shop: this.DOMAIN,
            accessToken: this.API_ACCESS_TOKEN,
            id: String(Date.now()),
            isActive: () => true,
            state: ''
        }
    }
    // ---------------------- END PRIVATE

    public async getMetafieldsByOwner({ id, resourceType, clearSession = false }: GetMetafieldByOwnerParams): Promise<Metafield[]> {
        const metafields = await Metafield.all({
            session: this.buildFakeSession(),
            metafield: {
                owner_id: id,
                owner_resource: resourceType
            }
        })

        return clearSession 
            ? ShopifyProvider.sessionRemover<Metafield>(metafields) 
            : metafields
    }

    public async createMetafieldsByOwner( body: any ) {
        const metafield = new Metafield({
            session: this.buildFakeSession(),
            fromData: body
        })

        await metafield.save()

        return metafield
    }

    public async getProductsByHandles( handles: string ) {
        const products = await Product.all({
            session: this.buildFakeSession(),
            handle: handles
        })

        return ShopifyProvider.sessionRemover(products)
    }

    public async getCollectionById( id: string | number, clearSession: boolean = true ) {
        const collection = await Collection.find({
            session: this.buildFakeSession(),
            id
        })

        clearSession && collection.session && delete collection.session
        return collection
    }

    public async getOrderById( id: string | number, clearSession: boolean = true ) {
        const order = await Order.find({
            session: this.buildFakeSession(),
            id
        })

        clearSession && order.session && delete order.session
        return order 
    }

    public async createTransaction({ fields, clearSession = true }: CreateTransactionParams) {
        const session = this.buildFakeSession()
        if ( !!!fields.parent_id ) {
            const lastTransaction = (await Transaction.all({
                session,
                order_id: fields.order_id
            })).pop()

            if ( !!!lastTransaction ) throw { message: 'No last transaction found' }

            fields.parent_id = lastTransaction.id
            fields.currency = lastTransaction.currency
        }

        const transaction = new Transaction({
            session,
            fromData: fields
        }) 

        await transaction.save({ update: true })
        clearSession && transaction.session && delete transaction.session

        return transaction
    }

    public async getCustomerById( customerId: string | number, clearSession: boolean = true ) {
        const customer = await Customer.find({
            session: this.buildFakeSession(),
            id: customerId
        })

        clearSession && customer.session && delete customer.session
        return customer
    }

    public async getCustomerByEmail( email: string, clearSession: boolean = true ) {
        const customer = await Customer.all({
            session: this.buildFakeSession(),
            email
        })

        return clearSession ? ShopifyProvider.sessionRemover(customer) : customer
    }
    
    public async createCustomer(params: CreateCustomerParams) {
        const { clearSession = true, fields } = params

        const customer = new Customer({
            session: this.buildFakeSession(),
            fromData: fields
        })

        await customer.saveAndUpdate()

        clearSession && customer.session && delete customer.session
        return customer
    }

    public async getWebhooks( clearSession: boolean = true ) {
        const webhooks = await Webhook.all({
            session: this.buildFakeSession(),
        })

        return clearSession ? ShopifyProvider.sessionRemover(webhooks) : webhooks
    }

    public async gqlOrderEditBegin( order: Order, gqlClient?: GraphqlClient ) {
        if ( !gqlClient ) {
            gqlClient = new GraphqlClient(this.DOMAIN, this.API_ACCESS_TOKEN)
        }

        try {
            const orderEditBegin = await gqlClient.query({
                data: {
                    query: GQL_MUTATIONS.ORDER_EDIT_BEGIN,
                    variables: {
                        id: order.admin_graphql_api_id
                    }
                }
            })

            const calculatedOrderData = (orderEditBegin.body as any).data.orderEditBegin.calculatedOrder
            
            if ( !!!calculatedOrderData ) {
                throw {
                    response: {
                        errors: (orderEditBegin.body as any).data.orderEditBegin.userErrors
                    }
                }
            }

            const originalOrderData = (orderEditBegin.body as any).data.orderEditBegin.calculatedOrder.originalOrder
    
            return {
                calculatedOrder: {
                    id: calculatedOrderData.id,
                    lineItems: calculatedOrderData.lineItems.edges.map((x: { node: any }) => x.node)
                },
                originalOrderData: {
                    lineItems: originalOrderData.lineItems.edges.map((x: { node: any }) => x.node)
                }
            }
        } catch (err) {
            console.log('ORDER EDIT BEGIN CATCH')
            throw err
        }
    }

    public async gqlOrderRemoveLineItem(
        { calculatedLineItemId, calculatedOrderId }: GqlRemoveOrderItemParams, 
        gqlClient?: GraphqlClient
    ) {
        if ( !gqlClient ) {
            gqlClient = new GraphqlClient(this.DOMAIN, this.API_ACCESS_TOKEN)
        }

        try {
            const changeOrder = await gqlClient.query({
                data: {
                    query: GQL_MUTATIONS.ORDER_EDIT_REMOVE_ITEM,
                    variables: {
                        id: calculatedOrderId,
                        lineItemId: calculatedLineItemId,
                    }
                }
            })

            const calculatedOrderData = (changeOrder.body as any).data.orderEditSetQuantity.calculatedOrder

            if ( !!!calculatedOrderData ) {
                throw {
                    response: {
                        errors: (changeOrder.body as any).data.orderEditSetQuantity.userErrors
                    }
                }
            }
    
            return {
                calculatedOrder: {
                    id: calculatedOrderData.id,
                    modifiedLineItems: calculatedOrderData.addedLineItems.edges.map((x: { node: any }) => x.node)
                },
                extension: (changeOrder.body as any).extension
            }
        } catch (err) {
            console.log('ORDER REMOVE LINE ITEM CATCH')
            throw err
        }
    }

    public async gqlOrderAddLineItem(
        { quantity, calculatedOrderId, variantId}: GqlAddOrderItemParams, 
        gqlClient?: GraphqlClient
    ) {
        if ( !gqlClient ) {
            gqlClient = new GraphqlClient(this.DOMAIN, this.API_ACCESS_TOKEN)
        }

        try {
            const addItem = await gqlClient.query({
                data: {
                    query: GQL_MUTATIONS.ORDER_EDIT_ADD_ITEM,
                    variables: {
                        id: calculatedOrderId,
                        quantity,
                        variantId 
                    }
                }
            })

            const calculatedOrderData = (addItem.body as any).data.orderEditAddVariant.calculatedOrder

            if ( !!!calculatedOrderData ) {
                throw {
                    response: {
                        errors: (addItem as any).data.orderEditAddVariant.userErrors
                    }
                }
            }

            const calculatedLineItem = (addItem.body as any).data.orderEditAddVariant.calculatedLineItem
    
            return {
                calculatedOrder: {
                    id: calculatedOrderData.id,
                    modifiedLineItems: calculatedOrderData.addedLineItems.edges.map((x: { node: any }) => x.node)
                },
                calculatedLineItem: {
                    id: calculatedLineItem.id,
                    quantity: calculatedLineItem.quantity
                }
            }
        } catch (err) {
            console.log('ORDER ADD LINE ITEM CATCH')
            throw err
        }
    }

    public async gqlOrderAddLineItemDiscount(
        { discount, calculatedOrderId, lineItemId}: GqlAddOrderItemDiscountParams, 
        gqlClient?: GraphqlClient
    ) {
        if ( !gqlClient ) {
            gqlClient = new GraphqlClient(this.DOMAIN, this.API_ACCESS_TOKEN)
        }

        try {
            const addItemDiscount = await gqlClient.query({
                data: {
                    query: GQL_MUTATIONS.ORDER_EDIT_ADD_ITEM_DISCOUNT,
                    variables: {
                        id: calculatedOrderId,
                        discount,
                        lineItemId
                    }
                }
            })

            const calculatedOrderData = (addItemDiscount.body as any).data.orderEditAddLineItemDiscount.calculatedOrder

            if ( !!!calculatedOrderData ) {
                throw {
                    response: {
                        errors: (addItemDiscount.body as any).data.orderEditAddLineItemDiscount.userErrors
                    }
                }
            }

            const calculatedLineItem = (addItemDiscount.body as any).data.orderEditAddLineItemDiscount.calculatedLineItem
            const addedDiscountStagedChange = (addItemDiscount.body as any).data.orderEditAddLineItemDiscount.addedDiscountStagedChange

            return {
                calculatedOrder: {
                    id: calculatedOrderData.id,
                    modifiedLineItems: calculatedOrderData.addedLineItems.edges.map((x: { node: any }) => x.node)
                },
                calculatedLineItem: {
                    id: calculatedLineItem.id,
                    quantity: calculatedLineItem.quantity
                },
                addedDiscountStaged: {
                    id: addedDiscountStagedChange.id,
                    value: addedDiscountStagedChange.value,
                    description: addedDiscountStagedChange.description
                }
            }
        } catch (err) {
            console.log('ORDER ADD LINE ITEM DISCOUNT CATCH')
            throw err
        }
    }

    public async gqlOrderEditCommit(
        calculatedOrderId: string, 
        gqlClient?: GraphqlClient
    ) {
        if ( !gqlClient ) {
            gqlClient = new GraphqlClient(this.DOMAIN, this.API_ACCESS_TOKEN)
        }

        try {
            const commitOrder = await gqlClient.query({
                data: {
                    query: GQL_MUTATIONS.ORDER_EDIT_COMMIT,
                    variables: {
                        id: calculatedOrderId,
                    }
                }
            })

            const orderData = (commitOrder.body as any).data.orderEditCommit.order

            return orderData
        } catch (err) {
            console.log('ORDER COMMIT CATCH')
            throw err
        }
    }
}

const shopify = new ShopifyProvider()
export { ShopifyProvider }
export default shopify