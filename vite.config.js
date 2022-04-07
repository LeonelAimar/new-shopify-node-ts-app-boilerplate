import react from "@vitejs/plugin-react";
import path, { resolve } from 'path'
import "dotenv/config";

/**
 * @type {import('vite').UserConfig}
 */
export default {
    define: {
        "process.env.SHOPIFY_API_KEY": JSON.stringify(process.env.SHOPIFY_API_KEY),
    },
    plugins: [react()],
    // resolve: {
    //     alias: [
    //         { find: '@', replacement: resolve(__dirname, 'src/client') }
    //     ]
    // }
};
