import {
    ApolloClient,
    ApolloProvider,
    HttpLink,
    InMemoryCache,
} from "@apollo/client";
import {
    Provider as AppBridgeProvider,
    useAppBridge,
} from "@shopify/app-bridge-react";
import { AppProvider as PolarisProvider } from "@shopify/polaris";
import translations from "@shopify/polaris/locales/en.json";
import { GlobalProvider } from "./contexts/global/GlobalContextProvider";

// Custom Hooks
import { userLoggedInFetch } from "./hooks/ShopifyApoloHooks";

export const Providers: React.FC = ({ children }) => {
    return (
        <PolarisProvider i18n={translations}>
            <AppBridgeProvider
                config={{
                    apiKey: process.env.SHOPIFY_API_KEY,
                    host: new URLSearchParams(location.search).get("host"),
                    forceRedirect: true,
                }}
            >
                <GlobalProvider>
                    <MyProvider>
                        { children }
                    </MyProvider>
                </GlobalProvider>
            </AppBridgeProvider>
        </PolarisProvider>
    )
}

const MyProvider: React.FC = ({ children }) => {
    const app = useAppBridge();

    const client = new ApolloClient({
        cache: new InMemoryCache(),
        link: new HttpLink({
            credentials: "include",
            fetch: userLoggedInFetch(app),
        }),
    });

    return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
