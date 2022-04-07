import axios from 'axios'
import { useEffect, useState } from "react";
import {
  Card,Heading, TextContainer, DisplayText, TextStyle,
  Button, Layout, Page, Stack, Image, Link,
} from "@shopify/polaris";
import { Toast, useAppBridge } from "@shopify/app-bridge-react";
import { gql, useMutation } from "@apollo/client";

import { userLoggedInFetch } from '../hooks/ShopifyApoloHooks';

import trophyImgUrl from "../assets/home-trophy.png";
import { useGlobalState } from '../hooks/useGlobalState';

const PRODUCTS_QUERY = gql`
  mutation populateProduct($input: ProductInput!) {
    productCreate(input: $input) {
        product {
            title
        }
    }
  }
`;

export function ProductsCard() {
    const { has50clicks, state, methods } = useGlobalState()
    const [populateProduct, { loading }] = useMutation(PRODUCTS_QUERY);
    const [productCount, setProductCount] = useState(0);
    const [hasResults, setHasResults] = useState(false);

    const app = useAppBridge();
    const fetch = userLoggedInFetch(app);
    async function updateProductCount() {
        // fix fetchLoggedFunction import to can use axios
        // const { count } = (await axios.get<{ count: number; }>('/products-count')).data;
        const { count } = await fetch("/products-count", {}).then((res) => res.json());
        setProductCount(count);
    }

    useEffect(() => {
        updateProductCount();
    }, []);

    const toastMarkup = hasResults && (
        <Toast
            content="5 products created!"
            onDismiss={() => setHasResults(false)}
        />
    );

    return (
        <Page fullWidth>
            {toastMarkup}
            <Layout>
                <Layout.Section oneHalf>
                    <Card sectioned>
                        <Stack
                            wrap={false}
                            spacing="extraTight"
                            distribution="trailing"
                            alignment="center"
                        >
                        <Stack.Item fill>
                            <TextContainer spacing="loose">
                            <Heading>Nice work on building a Shopify app 🎉</Heading>
                            <p>
                                Your app is ready to explore! It contains everything you
                                need to get started including the{" "}
                                <Link url="https://polaris.shopify.com/" external>
                                Polaris design system
                                </Link>
                                ,{" "}
                                <Link url="https://shopify.dev/api/admin-graphql" external>
                                Shopify Admin API
                                </Link>
                                , and{" "}
                                <Link
                                url="https://shopify.dev/apps/tools/app-bridge"
                                external
                                >
                                App Bridge
                                </Link>{" "}
                                UI library and components.
                            </p>
                            <p>
                                Ready to go? Start populating your app with some sample
                                products to view and test in your store.{" "}
                            </p>
                            <p>
                                Learn more about building out your app in{" "}
                                <Link
                                url="https://shopify.dev/apps/getting-started/add-functionality"
                                external
                                >
                                this Shopify tutorial
                                </Link>{" "}
                                📚{" "}
                            </p>
                            </TextContainer>
                        </Stack.Item>
                        <Stack.Item>
                            <div style={{ padding: "0 20px" }}>
                            <Image
                                source={trophyImgUrl}
                                alt="Nice work on building a Shopify app"
                                width={120}
                            />
                            </div>
                        </Stack.Item>
                        </Stack>
                    </Card>
                </Layout.Section>
                <Layout.Section oneHalf>
                    <Card title="Product Counter" sectioned>
                        <TextContainer spacing="loose">
                        <p>
                            Sample products are created with a default title and price. You can
                            remove them at any time.
                        </p>
                        <Heading element="h4">
                            TOTAL PRODUCTS
                            <DisplayText size="medium">
                            <TextStyle variation="strong">{productCount}</TextStyle>
                            </DisplayText>
                        </Heading>
                        <Button
                            primary
                            loading={loading}
                            onClick={() => {
                            Promise.all(
                                Array.from({ length: 5 }).map(() =>
                                populateProduct({
                                    variables: {
                                    input: {
                                        title: randomTitle(),
                                    },
                                    },
                                })
                                )
                            ).then(() => {
                                updateProductCount();
                                setHasResults(true);
                            });
                            }}
                        >
                            Populate 5 products
                        </Button>
                        </TextContainer>
                    </Card>
                </Layout.Section>
                <Layout.Section>
                    <Card sectioned>
                        <h1>Hello There!!</h1>
                        <h1>APP NAME IS: { state.APP_NAME }</h1>
                        <br />
                        <div style={{ cursor: 'pointer' }} onClick={() => methods.sumClick()}>
                            <span>Clicks reached:</span>
                            <span>{ state.clicks }</span>
                            { state.clicks > 10 && <h2>Yay!! You've more than 10 clicks!!</h2> }
                            { has50clicks && <h2>Yay!! You've more than 50 clicks!!</h2> }
                        </div>
                    </Card>
                </Layout.Section>
            </Layout>
        </Page>
    );
}

function randomTitle() {
  const adjective = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];

  return `${adjective} ${noun}`;
}

const ADJECTIVES = [
  "autumn",
  "hidden",
  "bitter",
  "misty",
  "silent",
  "empty",
  "dry",
  "dark",
  "summer",
  "icy",
  "delicate",
  "quiet",
  "white",
  "cool",
  "spring",
  "winter",
  "patient",
  "twilight",
  "dawn",
  "crimson",
  "wispy",
  "weathered",
  "blue",
  "billowing",
  "broken",
  "cold",
  "damp",
  "falling",
  "frosty",
  "green",
  "long",
  "late",
  "lingering",
  "bold",
  "little",
  "morning",
  "muddy",
  "old",
  "red",
  "rough",
  "still",
  "small",
  "sparkling",
  "throbbing",
  "shy",
  "wandering",
  "withered",
  "wild",
  "black",
  "young",
  "holy",
  "solitary",
  "fragrant",
  "aged",
  "snowy",
  "proud",
  "floral",
  "restless",
  "divine",
  "polished",
  "ancient",
  "purple",
  "lively",
  "nameless",
];

const NOUNS = [
  "waterfall",
  "river",
  "breeze",
  "moon",
  "rain",
  "wind",
  "sea",
  "morning",
  "snow",
  "lake",
  "sunset",
  "pine",
  "shadow",
  "leaf",
  "dawn",
  "glitter",
  "forest",
  "hill",
  "cloud",
  "meadow",
  "sun",
  "glade",
  "bird",
  "brook",
  "butterfly",
  "bush",
  "dew",
  "dust",
  "field",
  "fire",
  "flower",
  "firefly",
  "feather",
  "grass",
  "haze",
  "mountain",
  "night",
  "pond",
  "darkness",
  "snowflake",
  "silence",
  "sound",
  "sky",
  "shape",
  "surf",
  "thunder",
  "violet",
  "water",
  "wildflower",
  "wave",
  "water",
  "resonance",
  "sun",
  "wood",
  "dream",
  "cherry",
  "tree",
  "fog",
  "frost",
  "voice",
  "paper",
  "frog",
  "smoke",
  "star",
];
