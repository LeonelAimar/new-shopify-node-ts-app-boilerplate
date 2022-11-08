import AppBridge from '@shopify/app-bridge'

const ShopifyApp = AppBridge({
    apiKey: process.env.SHOPIFY_API_KEY,
    host: new URLSearchParams(location.search).get("host"),
    forceRedirect: true,
})

export default ShopifyApp