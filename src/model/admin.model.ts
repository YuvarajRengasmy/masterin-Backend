import * as mongoose from "mongoose";

export interface AdminDocument extends mongoose.Document {
    _id?: any;
    name?: string;
    mobile?: number;
    email?: string;
    password?: string;
    imageUrl?:string;
    isDeleted?: boolean;
    status?: number;
    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;
};

const adminSchema = new mongoose.Schema({
    _id: { type: mongoose.Types.ObjectId, required: true, auto: true },
    name: { type: String },
    mobile: { type: Number },
    email: { type: String, lowercase: true, trim: true },
    password: { type: String },
    imageUrl:{type:String},
    isDeleted: { type: Boolean, default: false },
    status: { type: Number, default: 1 },
    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
});


export const Admin = mongoose.model("Admin", adminSchema);