import vue from "@vitejs/plugin-vue";
import path, { resolve } from 'path'
import "dotenv/config";

/**
 * @type {import('vite').UserConfig}
 */
export default {
    define: {
        "process.env.SHOPIFY_API_KEY": JSON.stringify(process.env.API_KEY),
        "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV)
    },
    plugins: [vue()],
    resolve: {
        alias: [
            { find: '@', replacement: resolve(__dirname, 'src/client') }
        ]
    }
};
