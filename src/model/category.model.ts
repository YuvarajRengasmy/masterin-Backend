import mongoose, { model } from "mongoose";

export interface CategoryDocument extends mongoose.Document {
    _id?: any;
    category?: string;
    isDeleted?: boolean;
    status?: number;
    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;
}

const categorySchema = new mongoose.Schema({
    _id: { type: mongoose.Types.ObjectId, reuired: true, auto: true },
    category: { type: String },
    status: { type: Number, default: 1 },
    isDeleted: { type: Boolean, default: false },
    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String }
})

export const Category = mongoose.model('Category', categorySchema)