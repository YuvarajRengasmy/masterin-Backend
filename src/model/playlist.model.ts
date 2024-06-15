import mongoose from "mongoose";

export interface PlayListDocument extends mongoose.Document {
    _id?: any;
    user?: any;
    name?: string;
    thumbnail?: string;
    post?: any;
    description?: string;
    category?: any;
    postCount?: number;
    createdOn?: Date;
    modifiedOn?: Date;
    modifiedBy?:string;
    createdBy?:string;
    isDeleted?: boolean;
}

const playListSchema = new mongoose.Schema({
    _id: { type: mongoose.Types.ObjectId, reuired: true, auto: true },
    user: { type: mongoose.Types.ObjectId, ref: 'Master' },
    name: { type: String },
    thumbnail: { type: String },
    post: [{ type: mongoose.Types.ObjectId, ref: 'Post' }],
    description: { type: String },
    category: [{ type: mongoose.Types.ObjectId, ref: 'Category' }],
    postCount: { type: Number, default: 0 },
    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
    isDeleted: { type: Boolean, default: false },
})

export const PlayList = mongoose.model('PlayList', playListSchema)