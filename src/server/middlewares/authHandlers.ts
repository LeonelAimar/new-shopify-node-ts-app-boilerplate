import { Application, Request, Response, NextFunction } from 'express'
import { Shopify, ApiVersion } from "@shopify/shopify-api";
import { server } from '../index.js'

export const setPolicyHeaders = ( req: Request, res: Response, next: NextFunction ): void => {
    const shop = req.query.shop;
    if (Shopify.Context.IS_EMBEDDED_APP && shop) {
        res.setHeader(
            "Content-Security-Policy",
            `frame-ancestors https://${shop} https://admin.shopify.com;`
            );
        } else {
        res.setHeader("Content-Security-Policy", `frame-ancestors 'none';`);
    }
    next();
}

export const validateIsInstalled = ( req: Request, res: Response, next: NextFunction ): void => {
    const shop = req.query.shop as string;

    // Detect whether we need to reinstall the app, any request from Shopify will
    // include a shop in the query parameters.
    if (server.app.get("active-shopify-shops")[shop] === undefined && shop) {
        res.redirect(`/auth?shop=${shop}`);
    } else {
        next();
    }
}

export const verifyRequest = (app: Application, { returnHeader = true } = {}) => {
    const TEST_GRAPHQL_QUERY = `
    {
        shop {
            name
        }
    }`;

    return async (req: Request, res: Response, next: NextFunction) => {
        const session = await Shopify.Utils.loadCurrentSession(
            req,
            res,
            app.get("use-online-tokens")
        );
  
        let shop = req.query.shop;
    
        if (session && shop && session.shop !== shop) {
            // The current request is for a different shop. Redirect gracefully.
            return res.redirect(`/auth?shop=${shop}`);
        }
    
        if (session?.isActive()) {
            try {
                // make a request to make sure oauth has succeeded, retry otherwise
                const client = new Shopify.Clients.Graphql(
                    session.shop,
                    session.accessToken
                );
                await client.query({ data: TEST_GRAPHQL_QUERY });
                return next();
            } catch (e) {
                if (
                    e instanceof Shopify.Errors.HttpResponseError &&
                    e.response.code === 401
                ) {
                    // We only want to catch 401s here, anything else should bubble up
                } else {
                    throw e;
                }
            }
        }
    
        if (returnHeader) {
            if (!shop) {
                if (session) {
                    shop = session.shop;
                } else if (Shopify.Context.IS_EMBEDDED_APP) {
                    const authHeader = req.headers.authorization;
                    const matches = authHeader?.match(/Bearer (.*)/);
                    if (matches) {
                        const payload = Shopify.Utils.decodeSessionToken(matches[1]);
                        shop = payload.dest.replace("https://", "");
                    }
                }
            }
    
            if (!shop || shop === "") {
                return res
                    .status(400)
                    .send(
                        `Could not find a shop to authenticate with. Make sure you are making your XHR request with App Bridge's authenticatedFetch method.`
                    );
            }
    
            res.status(403);
            res.header("X-Shopify-API-Request-Failure-Reauthorize", "1");
            res.header(
                "X-Shopify-API-Request-Failure-Reauthorize-Url",
                `/auth?shop=${shop}`
            );
            res.end();
        } else {
            res.redirect(`/auth?shop=${shop}`);
        }
    }
}
  