import { Document } from 'mongoose';

export enum Role { ADMIN, READ_ONLY, READ_WRITE }

export interface IUser extends Document {
    _id?: number | string;
    userName: string;
    role: Role;
    password: string;
    ip?: string;
    createdAt: Date;
    comparePassword: ( password: string ) => Promise<boolean>
}

export interface IUserJWT {
    id:       string;
    userName: string;
    role:     Role;
}
