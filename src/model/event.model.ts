import mongoose, { mongo } from "mongoose";

export interface EventDocument extends mongoose.Document {
    _id?: any;
    master?: any;
    date?: Date;
    coins?: number;
    fromTime?: string;
    toTime?: string;
    description?: string;
    type?:string;
    bookedUsers?: any;
    title?: string;
    category?: any[];
    eventType?: string;
    location?: string;
    isPaid?: Boolean;
    bannerImage?:string;
    eventImage1?: string;
    eventImage2?: string;
    isDeleted?: boolean;
    status?: number;
    createdOn?: Date;
    createdBy?: string;
    modifiedOn?: Date;
    modifiedBy?: string;
}

const eventSchema = new mongoose.Schema({
    _id: { type: mongoose.Types.ObjectId, reuired: true, auto: true },
    master: { type: mongoose.Types.ObjectId, ref: 'Master' },
    date: { type: Date },
    fromTime: { type: String },
    toTime: { type: String },
    coins: { type: Number, default: 0 },
    title: { type: String },
    description: { type: String },
    type:{type:String},
    bookedUsers: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
    eventType: { type: String },
    category: [{ type: mongoose.Types.ObjectId, ref: 'category' }],
    location: { type: String },
    isPaid: { type: Boolean, default: false },
    bannerImage:{type:String},
    eventImage1:{type:String},
    eventImage2:{type:String},
    status: { type: Number, default: 1 },
    isDeleted: { type: Boolean, default: false },
    createdOn: { type: Date },
    createdBy: { type: String },
    modifiedOn: { type: Date },
    modifiedBy: { type: String }
})

export const Event = mongoose.model('Event', eventSchema)