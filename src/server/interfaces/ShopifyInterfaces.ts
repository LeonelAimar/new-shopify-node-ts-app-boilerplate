import { Customer } from '@shopify/shopify-api/dist/rest-resources/2022-07';
import { ApiVersion, DataType } from '@shopify/shopify-api'

export enum MetafieldOwner {
    CUSTOMER = 'customer',
    ARTICLE = 'article',
    BLOG = 'blog',
    COLLECTION = 'collection',
    ORDER = 'order',
    DRAFT_ORDER = 'draft_order',
    PRODUCT = 'product',
    PRODUCT_VARIANT = 'variant',
    PRODUCT_IMAGE = 'product_image',
    PAGE = 'page',
    SHOP = 'shop',
}

export enum MetafieldType {
    STRING = 'string',
    INTEGER = 'integer',
    BOOLEAN = 'boolean',
    COLOR = 'color',
    JSON = 'json',
    DATE = 'date',
    DATE_TIME = 'date_time',
    FILE_REFERENCE = 'file_reference',
    PRODUCT_REFERENCE = 'product_reference',
    VARIANT_REFERENCE = 'variant_reference',
    PAGE_REFERENCE = 'page_reference',
    DIMENSION = 'dimension',
    NUMBER_DECIMAL = 'number_decimal',
    NUMBER_INTEGER = 'number_integer',
    SINGLE_LINE_TEXT_FIELD = 'single_line_text_field',
    URL = 'URL',
    RATING = 'rating',
    VOLUME = 'volume',
    WEIGHT = 'weight'
}

export type MetafieldTypes = 'string' | 
    'integer' | 'boolean' | 'color' | 'json' | 'date' | 
    'file_reference' | 'date_time' | 'dimension' |
    'multi_line_text_field' | 'number_decimal' | 'number_integer' |
    'page_reference' | 'product_reference' | 'rating' |
    'single_line_text_field' | 'url' | 'variant_reference' |
    'volume' | 'weight'


export interface GetMetafieldByOwnerParams {
    id:             number;
    resourceType:   MetafieldOwner;
    clearSession?:  boolean;
}

export interface CreateTransactionParams {
    fields:                 NewTransactionFields;
    clearSession?:          boolean;
}

export interface CreateCustomerParams {
    fields:                 NewCustomerFields;
    clearSession?:          boolean;
}

export interface UpdateCustomerParams {
    fields:                 NewCustomerFields;
    clearSession?:          boolean;
    customer?:              Customer;
}

export interface NewCustomerFields {
    email:                      string;
    first_name?:                string;
    last_name?:                 string;
    phone?:                     string;
    tags?:                      string[];
    verified_email?:            boolean;
    email_marketing_consent?:   MarketingConsentData;
    sms_marketing_consent?:     MarketingConsentData;
    send_email_invite?:         boolean;
}

export interface NewTransactionFields {
    order_id:                   number;
    kind:                       TransactionType;
    parent_id?:                 number;
    currency?:                  string;
    amount?:                    string;
    status?:                    string;
}

type MarketingOptInLevels = 'single_opt_in' | 'confirmed_opt_in' | 'unknown'

interface MarketingConsentData {
    state:                      'subscribed' | 'unsuscribed';
    opt_in_level:               MarketingOptInLevels;
    consent_updated_at:         Date | number | string;
    consent_collected_from?:    'OTHER';
}

export enum WebhookTopics {
    ORDERS_CREATE = 'ORDERS_CREATE',
    ORDERS_CANCELLED = 'ORDERS_CANCELLED',
    ORDERS_PAID = 'ORDERS_PAID',
    ORDERS_UPDATED = 'ORDERS_UPDATED'
}

export enum FinancialStatus {
    ANY = 'any',
    PAID = 'paid',
    VOIDED = 'voided',
    PENDING = 'pending',
    REFUNDED = 'refunded',
    AUTHORIZED = 'authorized'
}

export interface IShopifyOrder {
    id:                         number;
    email:                      string;
    closed_at:                  null;
    created_at:                 string;
    updated_at:                 string;
    number:                     number;
    note:                       null;
    token:                      string;
    gateway:                    null;
    test:                       boolean;
    total_price:                string;
    subtotal_price:             string;
    total_weight:               number;
    total_tax:                  string;
    taxes_included:             boolean;
    currency:                   Currency;
    financial_status:           string;
    confirmed:                  boolean;
    total_discounts:            string;
    total_line_items_price:     string;
    cart_token:                 null;
    buyer_accepts_marketing:    boolean;
    name:                       string;
    referring_site:             null;
    landing_site:               null;
    cancelled_at:               string;
    cancel_reason:              string;
    total_price_usd:            null;
    checkout_token:             null;
    reference:                  null;
    user_id:                    null;
    location_id:                null;
    source_identifier:          null;
    source_url:                 null;
    processed_at:               null;
    device_id:                  null;
    phone:                      null;
    customer_locale:            string;
    app_id:                     null;
    browser_ip:                 null;
    landing_site_ref:           null;
    order_number:               number;
    discount_applications:      DiscountApplication[];
    discount_codes:             any[];
    note_attributes:            any[];
    payment_gateway_names:      string[];
    processing_method:          string;
    checkout_id:                null;
    source_name:                string;
    fulfillment_status:         string;
    tax_lines:                  any[];
    tags:                       string;
    contact_email:              string;
    order_status_url:           string;
    presentment_currency:       Currency;
    total_line_items_price_set: Set;
    total_discounts_set:        Set;
    total_shipping_price_set:   Set;
    subtotal_price_set:         Set;
    total_price_set:            Set;
    total_tax_set:              Set;
    line_items:                 LineItem[];
    fulfillments:               any[];
    refunds:                    any[];
    total_tip_received:         string;
    original_total_duties_set:  null;
    current_total_duties_set:   null;
    payment_terms:              null;
    admin_graphql_api_id:       string;
    shipping_lines:             ShippingLine[];
    billing_address:            Address;
    shipping_address:           Address;
    customer:                   Customer;
}

export interface Address {
    first_name:    null | string;
    address1:      string;
    phone:         string;
    city:          string;
    zip:           string;
    province:      string;
    country:       string;
    last_name:     null | string;
    address2:      null;
    company:       null | string;
    latitude?:     null;
    longitude?:    null;
    name:          string;
    country_code:  string;
    province_code: string;
    id?:           number;
    customer_id?:  number;
    country_name?: string;
    default?:      boolean;
}

export enum Currency {
    Pyg = "PYG",
}

export interface DiscountApplication {
    type:              string;
    value:             string;
    value_type:        string;
    allocation_method: string;
    target_selection:  string;
    target_type:       string;
    description:       string;
    title:             string;
}

export interface LineItem {
    id:                           number;
    variant_id:                   number;
    title:                        string;
    quantity:                     number;
    sku:                          string;
    variant_title:                null;
    vendor:                       null;
    fulfillment_service:          string;
    product_id:                   number;
    requires_shipping:            boolean;
    taxable:                      boolean;
    gift_card:                    boolean;
    name:                         string;
    variant_inventory_management: string;
    properties:                   any[];
    product_exists:               boolean;
    fulfillable_quantity:         number;
    grams:                        number;
    price:                        string;
    total_discount:               string;
    fulfillment_status:           null;
    price_set:                    string[];
    total_discount_set:           string[];
    discount_allocations:         string[];
    duties:                       any[];
    admin_graphql_api_id:         string;
    tax_lines:                    any[];
}

export interface ShippingLine {
    id:                               number;
    title:                            string;
    price:                            string;
    code:                             null;
    source:                           string;
    phone:                            null;
    requested_fulfillment_service_id: null;
    delivery_category:                null;
    carrier_identifier:               null;
    discounted_price:                 string;
    price_set:                        string[];
    discounted_price_set:             string[];
    discount_allocations:             any[];
    tax_lines:                        any[];
}

export interface Set {
    shop_money:        Money;
    presentment_money: Money;
}

export interface Money {
    amount:        string;
    currency_code: Currency;
}

export enum CancelOrderReason {
    CUSTOMER = 'customer', 
    INVENTORY = 'inventory', 
    FRAUD = 'fraud', 
    DECLINED = 'declined', 
    OTHER = 'other'
}

export enum TransactionType {
    AUTHORIZATION = 'authorization', // Money that the customer has agreed to pay. The authorization period can be between 7 and 30 days (depending on your payment service) while a store waits for a payment to be captured.
    CAPTURE = 'capture', // A transfer of money that was reserved during the authorization of a shop.
    SALE = 'sale', // The authorization and capture of a payment performed in one single step.
    VOID = 'void', // The cancellation of a pending authorization or capture.
    REFUND = 'refund' // The partial or full return of captured money to the customer.
}

export interface OrderTransactionsResponse {
    transactions: Transaction[];
}

export interface Transaction {
    id:                   number;
    order_id:             number;
    kind:                 TransactionType;
    gateway:              string;
    status:               string;
    message:              string;
    created_at:           string;
    test:                 boolean;
    authorization:        null;
    location_id:          null;
    user_id:              null;
    parent_id:            number | null;
    processed_at:         string;
    device_id:            null;
    error_code:           null;
    source_name:          string;
    receipt:              Receipt;
    amount:               string;
    currency:             string;
    admin_graphql_api_id: string;
}

export interface Receipt {
}

export interface OrderTransactionCreateRequest extends Record<string, unknown> {
    transaction: TransactionCreate;
}

export interface Location {
    id:                      number;
    name:                    string;
    address1:                string;
    address2:                null;
    city:                    string;
    zip:                     string;
    province:                string;
    country:                 string;
    phone:                   null;
    created_at:              string;
    updated_at:              string;
    country_code:            string;
    country_name:            string;
    province_code:           string;
    legacy:                  boolean;
    active:                  boolean;
    admin_graphql_api_id:    string;
    localized_country_name:  string;
    localized_province_name: string;
}


export interface Webhook {
    id:                             number;
    address:                        string;
    topic:                          string;
    created_at:                     string;
    updated_at:                     string;
    format:                         string;
    fields:                         any[];
    metafield_namespaces:           any[];
    api_version:                    ApiVersion;
    private_metafield_namespaces:   any[];
}

export interface TransactionCreate {
    amount?:              string;
    kind:                 TransactionType;
    status?:              string;
    currency:             string;
    parent_id:            number | null;
}

export interface RestClientOrderTransactionCreateRequest {
    path:   string;
    data:   OrderTransactionCreateRequest;
    type:   DataType;
}

export interface ModifyWebhookParams {
    webhookId: number | string;
    newData: { address: string }
}

export interface RegisterWebhookParams {
    topic:          WebhookTopics;
    uri:            string;
}

export interface NewFulfillmentParams {
    orderId:                number | string;
    trackingNumber:         string;
    locationId?:            number;
    trackingUrls?:          string[];
}

export interface TransactionCreate {
    amount?:              string;
    kind:                 TransactionType;
    status?:              string;
    currency:             string;
    parent_id:            number | null;
}

export interface Fulfillment {
    id:                   number;
    order_id:             number;
    status:               string;
    created_at:           string;
    service:              string;
    updated_at:           string;
    tracking_company:     string;
    shipment_status:      null;
    location_id:          number;
    origin_address:       null;
    line_items:           LineItem[];
    tracking_number:      string;
    tracking_numbers:     string[];
    tracking_url:         string;
    tracking_urls:        string[];
    receipt:              Receipt;
    name:                 string;
    admin_graphql_api_id: string;
}

interface GqlMoneyInput {
    amount:             number;
    currencyCode:       string;
}

export interface GqlDiscountInput {
    description?:                string;
    fixedValue?:                 GqlMoneyInput;
    percentValue?:               number;
}

export interface GqlRemoveOrderItemParams {
    calculatedLineItemId:           string;
    calculatedOrderId:              string;
}

export interface GqlAddOrderItemParams {
    quantity:                       number;
    variantId:                      string;
    calculatedOrderId:              string;
}

export interface GqlAddOrderItemDiscountParams {
    discount:                       GqlDiscountInput;
    lineItemId:                     string;
    calculatedOrderId:              string;
}