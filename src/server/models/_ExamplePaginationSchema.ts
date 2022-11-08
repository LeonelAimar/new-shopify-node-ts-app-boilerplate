import { Schema, model, Document } from 'mongoose';
import AutoPopulatePlugin from 'mongoose-autopopulate';
import { mongoosePagination, Pagination } from 'mongoose-paginate-ts';
// import { IGiftList } from '../interfaces/GiftListInterface';
interface IGiftList extends Document {
    products:       object[]; // this has to be the final obj populated so IProduct[]
    status:         number;
    owner:          object;
    title:          string;
    createdAt:      number;
    updatedAt:      number;
    category:       object; // aswell on product, this will autopopulate Category
}
// Made this because we dont have that interface on boiler plate.
import path from 'path';
import fs from 'fs';

const GiftListSchema = new Schema<IGiftList>({
    title: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', autopopulate: true },
    status: { type: Number, required: true, default: 0 },
    owner: { type: Object, required: true },
    products: [{
        type: Schema.Types.ObjectId,
        ref: 'Product'
    }],
    createdAt: { type: Date, required: true, default: Date.now },
    updatedAt: { type: Date, required: true, default: Date.now }
}, {
    toObject: {
        virtuals: true
    },
    toJSON: {
        virtuals: true
    }
})
// GiftListSchema.plugin(AutoPopulatePlugin) // call autopopulate plug
GiftListSchema.plugin(mongoosePagination) // call pagination plug

/* this pagination can be later used as:
    GiftList.paginate({ query: {}, limit: 10, page: 1 })
    
    returns this interface:
    export interface PaginationModel<T> {
        totalDocs: number | undefined;
        limit: number | undefined;
        totalPages: number | undefined;
        page: number | undefined;
        pagingCounter: number | undefined;
        hasPrevPage: Boolean | undefined;
        hasNextPage: Boolean | undefined;
        prevPage: number | undefined;
        nextPage: number | undefined;
        hasMore: Boolean | undefined;
        docs: T[];
    } 
*/

GiftListSchema.pre<IGiftList>('updateOne', function(next) {
    this.set({ updatedAt: Date.now() })
    next()
})

GiftListSchema.virtual('imageSrc').get(function() {
    if ( this.image != null ) {
        const nestedPath = path.resolve(__dirname, '../../uploads', this.hash.slice(1), this.image)
        const existOnFolder = fs.existsSync(nestedPath)

        return ( existOnFolder ) 
            ? `/uploads/${this.hash.slice(1)}/${this.image}` 
            : `/uploads/${this.image}`

        // return path.resolve(__dirname, '../../uploads/', this.image)
    }
})

export default model<IGiftList, Pagination<IGiftList>>('GiftList', GiftListSchema)
