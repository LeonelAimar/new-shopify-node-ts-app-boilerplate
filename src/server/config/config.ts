import Shop from '../models/ShopModel'

const CONFIG = {
    GLOBAL: {
        APP_NAME: 'APP NAME',
        IS_TESTING: process.env.NODE_ENV.trim() === 'development' ? true : false,
    },
    SHOPIFY_APP: {
        API_KEY: process.env.API_KEY,
        API_SECRET_KEY: process.env.API_SECRET_KEY,
        ACCESS_TOKEN: '',
        SCOPES: process.env.SCOPES.split(','),
        SHOP: process.env.SHOP,
        HOST: process.env.HOST.replace(/https:\/\//, '')
    },
    DB: {
        URI: process.env.MONGODB_URI || 'mongodb://localhost/APP_DB_NAME',
        USER: process.env.MONGODB_USER,
        PASSWORD: process.env.MONGODB_PASSWORD
    },
    CORS: {
        allowedOrigins: [process.env.HOST, `https://${process.env.HOST}`, ...process.env.CORS.split(',')]
    },
    JWT: {
        SECRET_TOKEN: process.env.JWT_SECRET
    }
}

export default CONFIG

export const initChecker = async () => {
    const existShop = await Shop.findOne({ domain: CONFIG.SHOPIFY_APP.SHOP })
    if ( existShop ) CONFIG.SHOPIFY_APP.ACCESS_TOKEN = existShop.accessToken
}