import { Document } from 'mongoose';

export interface IShop extends Document {
    _id?: number | string;
    domain: string;
    accessToken: string;
    ip?: string;
    createdAt: Date;
}