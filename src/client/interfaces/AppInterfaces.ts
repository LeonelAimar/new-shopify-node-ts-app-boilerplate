export enum AppMode {
    SANDBOX = 'SANDBOX',
    PRODUCTION = 'PRODUCTION',
    DISABLED = 'DISABLED'
}

export interface IAppConfig {
    _id:                        string;
    mode:                       AppMode;
    apiSandboxUrl:              string;
    apiProductionUrl:           string;
    apiSandboxKey:              string;
    apiProductionKey:           string;
    apiSandboxAccessToken:      string;
    apiProductionAccessToken:   string;
    apiProductionClientId:      string;
    apiProductionClientSecret:  string;
    updatedAt:                  number;
    createdAt:                  number;
}

export interface IActionPayload {
    page:   number;
    query?: reqQuery;
    sort?:  any;
}

export interface reqQuery {
    payed?:             number;
    createdAt?:         number;
    _id?:               string;
    shopifyOrderId?:    string;
    checkoutId?:        string;
    'customer.email'?:  string;
}

// -------------- DUMMY INTERFACE
export enum ResourceStatus {
    PREPARING = 1,
    IN_TRANSIT = 2,
    DELIVERED = 3,
}

export interface IResource {
    _id:               string;
    status:            ResourceStatus;
    orderName:         string;
    createdAt:         number | string | Date;
    transactionAmount: number;
}