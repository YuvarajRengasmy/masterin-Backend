import mongoose, { model } from "mongoose";

export interface CompanyDocument extends mongoose.Document {
    _id?: any;
    email?: string;
    password?: string;
    name?: string;
    category?: any;
    image?: string;
    mobile?: number;
    date?: number;
    month?: number;
    year?: number;
    isDeleted?: boolean;
    status?: number;
    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;
}

const companySchema = new mongoose.Schema({
    _id: { type: mongoose.Types.ObjectId, reuired: true, auto: true },
    email: { type: String },
    password: { type: String },
    name: { type: String },
    category: { type: mongoose.Types.ObjectId, ref: 'Category' },
    image: { type: String },
    mobile: { type: Number },
    date: { type: Number },
    month: { type: Number },
    year: { type: Number },
    status: { type: Number, default: 1 },
    isDeleted: { type: Boolean, default: false },
    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String }
})

export const Company = mongoose.model('Company', companySchema)