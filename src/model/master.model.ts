import mongoose, { model } from "mongoose";

export interface MasterDocument extends mongoose.Document {
    _id?: any;
    email?: string;
    password?: string;
    name?: string;
    userName?: string;
    category?: any;
    coins?: number;
    sessionCoins?:number;
    position?: string;
    location?: string;
    recoveryEmail?: string;
    link?: string;
    image?: string;
    descryption?: string;
    backgroundImage?: string;
    experience?: any;
    education?: any;
    mobile?: number;
    connectedUsers?: any;
    connectedCount?: number;
    isPublic?: Boolean;
    primarySkill?: string;
    secondarySkill?: string;
    referralLink?: String;
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

const masterSchema = new mongoose.Schema({
    _id: { type: mongoose.Types.ObjectId, reuired: true, auto: true },
    email: { type: String },
    password: { type: String },
    name: { type: String },
    userName: { type: String },
    category: [{ type: mongoose.Types.ObjectId, ref: 'Category' }],
    coins: { type: Number, default: 0 },
    sessionCoins: { type: Number, default: 0 },
    position: { type: String },
    location: { type: String },
    recoveryEmail: { type: String },
    link: { type: String },
    image: { type: String },
    descryption: { type: String },
    backgroundImage: { type: String },
    experience: [{
        title: { type: String },
        workMode: { type: String },
        companyName: { type: String },
        location: { type: String },
        currentlyWorking: { type: Boolean },
        startDate: { type: String },
        endDate: { type: String },
        skills: { type: String },
    }],
    education: [{
        institute: { type: String },
        qualification: { type: String },
        fieldOfStudy: { type: String },
        currentlyStudying: { type: Boolean },
        startDate: { type: String },
        endDate: { type: String },
        grade: { type: Number },
        extraCurricular: { type: String },
    }],
    mobile: { type: Number },
    connectedUsers: [{ type: mongoose.Types.ObjectId, ref: 'Company' }],
    connectedCount: { type: Number },
    isPublic: { type: Boolean, default: true },
    primarySkill: { type: String },
    secondarySkill: { type: String },
    referralLink: { type: String },
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

export const Master = mongoose.model('Master', masterSchema)