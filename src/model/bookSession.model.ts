import mongoose, { mongo } from "mongoose";

export interface BookSessionDocument extends mongoose.Document {
    _id?: any;
    user?: any;
    master?: any;
    date?: Date;
    coins?: number;
    time?: string;
    description?: string;
    duration?: string;
    isDeleted?: boolean;
    status?: number;
    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;
}

const bookSessionSchema = new mongoose.Schema({
    _id: { type: mongoose.Types.ObjectId, reuired: true, auto: true },
    user: { type: mongoose.Types.ObjectId, ref: 'User' },
    master: { type: mongoose.Types.ObjectId, ref: 'Master' },
    date: { type: Date },
    time: { type: String },
    coins: { type: Number },
    duration: { type: String },
    description: { type: String },
    status: { type: Number, default: 1 },
    isDeleted: { type: Boolean, default: false },
    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String }
})

export const BookSession = mongoose.model('BookSession', bookSessionSchema)