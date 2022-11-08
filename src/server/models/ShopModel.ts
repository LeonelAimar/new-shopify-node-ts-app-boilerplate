import { Schema, model } from 'mongoose';
import { IShop } from '../interfaces/ShopInterface';

const ShopSchema = new Schema<IShop>({
    domain: { 
        type: String, 
        required: true 
    },
    accessToken: { 
        type: String, 
        required: true, 
    },
    createdAt: { 
        type: Date, 
        required: true, 
        default: Date.now 
    },
    ip: {
        type: String
    }
})

export default model<IShop>('Shop', ShopSchema)