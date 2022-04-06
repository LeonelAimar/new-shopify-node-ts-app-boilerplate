import { AuthQuery, Shopify } from '@shopify/shopify-api';
import { Request, Response } from 'express';
import { server } from '../index.js'

// Helpers
import topLevelAuthRedirect from '../helpers/top-level-auth-redirect.js';

class AuthController {
    static async checkAndBegin( req: Request, res: Response ): Promise<void> {
        if (!req.signedCookies[server.app.get("top-level-oauth-cookie")]) {
            return res.redirect(`/auth/toplevel?shop=${req.query.shop}`);
        }
      
        const redirectUrl = await Shopify.Auth.beginAuth(
            req,
            res,
            req.query.shop as string,
            "/auth/callback",
            server.app.get("use-online-tokens")
        );
      
        return res.redirect(redirectUrl);
    }

    static async signCookieAndFrontRedirect( req: Request, res: Response ): Promise<Response> {
        res.cookie(server.app.get("top-level-oauth-cookie"), "1", {
            signed: true,
            httpOnly: true,
            sameSite: "strict",
        });
      
        res.set("Content-Type", "text/html");
      
        return res.send(
            topLevelAuthRedirect({
              apiKey: Shopify.Context.API_KEY,
              hostName: Shopify.Context.HOST_NAME,
              shop: req.query.shop as string,
            })
        );
    }

    static async callbackHandling( req: Request, res: Response ): Promise<void> {
        try {
            const session = await Shopify.Auth.validateAuthCallback(
                req,
                res,
                req.query as unknown as AuthQuery
            );
      
            const host = req.query.host;
            server.app.set(
                "active-shopify-shops",
                Object.assign(server.app.get("active-shopify-shops"), {
                    [session.shop]: session.scope,
                })
            );
      
            const response = await Shopify.Webhooks.Registry.register({
                shop: session.shop,
                accessToken: session.accessToken,
                topic: "APP_UNINSTALLED",
                path: "/webhooks",
            });
      
            if (!response["APP_UNINSTALLED"].success) {
                console.log(
                    `Failed to register APP_UNINSTALLED webhook: ${response.result}`
                );
            }
      
            // Redirect to app with shop parameter upon auth
            return res.redirect(`/?shop=${session.shop}&host=${host}`);
          } catch (e) {
            switch (true) {
                case e instanceof Shopify.Errors.InvalidOAuthError:
                    res.status(400);
                    res.send(e.message);
                    break;
                case e instanceof Shopify.Errors.CookieNotFound:
                case e instanceof Shopify.Errors.SessionNotFound:
                    // This is likely because the OAuth session cookie expired before the merchant approved the request
                    res.redirect(`/auth?shop=${req.query.shop}`);
                    break;
                default:
                    res.status(500);
                    res.send(e.message);
                    break;
            }
        }
    }
}

export default AuthController