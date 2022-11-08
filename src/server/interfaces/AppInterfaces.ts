import { Document, ObjectId } from 'mongoose'

export enum AppMode {
    SANDBOX = 'SANDBOX',
    PRODUCTION = 'PRODUCTION',
    DISABLED = 'DISABLED'
}

export interface IAppConfig extends Document {
    mode:                       AppMode;
    apiSandboxUrl:              string;
    apiProductionUrl:           string;
    apiSandboxKey:              string;
    apiProductionKey:           string;
    apiSandboxAccessToken:      string;
    apiProductionAccessToken:   string;
    apiProductionClientId:      string;
    apiProductionClientSecret:  string;
    updatedAt:                  number | string | Date;
    createdAt:                  number | string | Date;
}
