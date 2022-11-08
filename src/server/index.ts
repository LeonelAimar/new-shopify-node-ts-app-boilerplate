import { resolve } from 'path';
import express from 'express';
import cookieParser from "cookie-parser";
import mongoose from 'mongoose';
import { Shopify, LATEST_API_VERSION } from "@shopify/shopify-api";
import 'dotenv/config';

import config, { initChecker } from './config/config'
// Middlewares
import { 
    setPolicyHeaders, validateIsInstalled,
    verifyRequest
} from './middlewares/authHandlers';
import { reqLogger } from "./middlewares/reqLogger";

const USE_ONLINE_TOKENS = false;
const TOP_LEVEL_OAUTH_COOKIE = "shopify_top_level_oauth";

const isTest = process.env.NODE_ENV === "test" || !!process.env.VITE_TEST_BUILD;

// Storing the currently active shops in memory will force them to re-login when your server restarts. You should
// persist this object in your app.
const ACTIVE_SHOPIFY_SHOPS: object = {};

// Routers
import AuthRouter from "./routes/AuthRouter.js";
import { routeBodyHandler } from "./middlewares/routeBodyHandler.js";
import { ViteDevServer } from "vite";
import ApiRouter from "./routes/ApiRouter.js";

class Server {
    public app: express.Application;
    public IS_TEST: boolean;
    private PORT: number;
    private ROOT_DIR: string;
    
    constructor() {
        this.app = express()
        this.ROOT_DIR = process.cwd()
        this.IS_TEST = process.env.NODE_ENV === 'development'
        this.PORT = Number(process.env.PORT || '8081')
        this.shopifyConfig()
        this.config()
    }

    async config() {
        this.app.set('port', this.PORT);
        this.app.set('top-level-oauth-cookie', TOP_LEVEL_OAUTH_COOKIE);
        this.app.set('active-shopify-shops', ACTIVE_SHOPIFY_SHOPS);
        this.app.set('use-online-tokens', USE_ONLINE_TOKENS);

        this.app.use(cookieParser(Shopify.Context.API_SECRET_KEY));

        this.app.use('/auth', AuthRouter)

        this.app.use(routeBodyHandler)
        
        this.app.use(reqLogger)

        Shopify.Webhooks.Registry.addHandler("APP_UNINSTALLED", {
            path: "/webhooks",
            webhookHandler: async (topic, shop: keyof typeof ACTIVE_SHOPIFY_SHOPS, body) => {
              delete ACTIVE_SHOPIFY_SHOPS[shop]
            },
        });

        this.app.use(setPolicyHeaders);
        this.app.use("/*", validateIsInstalled);

        this.app.use(express.json())
        this.app.use(express.urlencoded({ extended: false }))
        this.routes()

        await this.viteConfig()
    }

    async viteConfig() {
        if ( !this.IS_TEST ) {
            this.app.use(express.static(resolve(__dirname, 'public/')))
            return
        }
        
        let vite: ViteDevServer;
        vite = await import("vite").then(({ createServer }) =>
            createServer({
                root: this.ROOT_DIR,
                logLevel: this.IS_TEST ? "error" : "info",
                server: {
                    port: Number(this.app.get('port')),
                    hmr: {
                        protocol: "ws",
                        host: "localhost",
                        port: 64999,
                        clientPort: 64999,
                    },
                    middlewareMode: true,
                },
            })
        );
        this.app.use(vite.middlewares);
    }

    shopifyConfig() {
        Shopify.Context.initialize({
            API_KEY: config.SHOPIFY_APP.API_KEY,
            API_SECRET_KEY: config.SHOPIFY_APP.API_SECRET_KEY,
            SCOPES: config.SHOPIFY_APP.SCOPES,
            HOST_NAME: config.SHOPIFY_APP.HOST,
            IS_EMBEDDED_APP: true,
            API_VERSION: LATEST_API_VERSION, // all supported versions are available, as well as "unstable" and "unversioned"
            SESSION_STORAGE: new Shopify.Session.MemorySessionStorage()
        });
    }

    routes() {
        this.app.use('/api/v1', ApiRouter);
        this.app.post("/graphql", verifyRequest(this.app), async (req, res) => {
            try {
                const response = await Shopify.Utils.graphqlProxy(req, res);
                res.status(200).send(response.body);
            } catch (error) {
                res.status(500).send(error.message);
            }
        });

        this.app.post("/webhooks", async (req, res) => {
            try {
              await Shopify.Webhooks.Registry.process(req, res);
              console.log(`Webhook processed, returned status code 200`);
            } catch (error) {
              console.log(`Failed to process webhook: ${error}`);
              res.status(500).send(error.message);
            }
        });
        
        this.app.get("/products-count", verifyRequest(this.app), async (req, res) => {
            const session = await Shopify.Utils.loadCurrentSession(req, res, this.app.get("use-online-tokens"));
            const { Product } = await import(
                `@shopify/shopify-api/dist/rest-resources/${Shopify.Context.API_VERSION}/index.js`
            );
        
            const countData = await Product.count({ session });
            res.status(200).send(countData);
        });
    }

    mongodbConfig() {
        // MongoDB settings
        mongoose.connect(config.DB.URI)
        const db = mongoose.connection
        db.on('error', error => console.error(error) )
        db.on('open', async () => {
            console.log('DB is connected from mongoose') 
            await initChecker()
        })
    }

    start() {
        this.mongodbConfig()
        this.app.listen(this.app.get('port'), () => {
            console.log('Environment => ', process.env.NODE_ENV)
            console.log('Server running on port: ', this.app.get('port'))
        })
    }
}

if (!isTest) {
//   createServer().then(({ app }) => app.listen(PORT));
}

const server = new Server()
server.start()

export { server }
