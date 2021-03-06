import { resolve } from "path";
import express from "express";
import cookieParser from "cookie-parser";
import { Shopify, ApiVersion } from "@shopify/shopify-api";
import 'dotenv/config';

// Middlewares
import { 
    setPolicyHeaders, validateIsInstalled,
    verifyRequest
} from './middlewares/authHandlers.js';
import { reqLogger } from "./middlewares/reqLogger.js";

const USE_ONLINE_TOKENS = true;
const TOP_LEVEL_OAUTH_COOKIE = "shopify_top_level_oauth";

const isTest = process.env.NODE_ENV === "test" || !!process.env.VITE_TEST_BUILD;

// Storing the currently active shops in memory will force them to re-login when your server restarts. You should
// persist this object in your app.
const ACTIVE_SHOPIFY_SHOPS: object = {};

// Routers
import AuthRouter from "./routes/AuthRouter.js";
import { routeBodyHandler } from "./middlewares/routeBodyHandler.js";

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
        this.routes()
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

        let vite;
        if (this.IS_TEST) {
            vite = await import("vite").then(({ createServer }) =>
                createServer({
                    root: this.ROOT_DIR,
                    logLevel: isTest ? "error" : "info",
                    server: {
                        port: this.PORT,
                        hmr: {
                            protocol: "ws",
                            host: "localhost",
                            port: 64999,
                            clientPort: 64999,
                        },
                        middlewareMode: "html",
                    },
                })
            );
            this.app.use(vite.middlewares);
        } else {
            const compression = await import("compression").then(
                ({ default: fn }) => fn
            );
            const serveStatic = await import("serve-static").then(
                ({ default: fn }) => fn
            );
            const fs = await import("fs");
            this.app.use(compression());
            this.app.use(serveStatic(resolve("dist/client")));
            this.app.use("/*", (req, res, next) => {
                // Client-side routing will pick up on the correct route to render, so we always render the index here
                res
                    .status(200)
                    .set("Content-Type", "text/html")
                    .send(fs.readFileSync(`${process.cwd()}/dist/client/index.html`));
            });
        }
    }

    shopifyConfig() {
        Shopify.Context.initialize({
            API_KEY: process.env.SHOPIFY_API_KEY,
            API_SECRET_KEY: process.env.SHOPIFY_API_SECRET,
            SCOPES: process.env.SCOPES.split(","),
            HOST_NAME: process.env.HOST.replace(/https:\/\//, ""),
            API_VERSION: ApiVersion.April22,
            IS_EMBEDDED_APP: true,
            // This should be replaced with your preferred storage strategy
            SESSION_STORAGE: new Shopify.Session.MemorySessionStorage(),
        });
    }

    routes() {
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

    start() {
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
