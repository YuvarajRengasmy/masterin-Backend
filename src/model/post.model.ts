import mongoose from "mongoose";

export interface PostDocument extends mongoose.Document {
    _id?: any;
    url?: string;
    fileType?: number;
    title?: string;
    description?: string;
    user?: any;
    likes?: any;
    likeCount?: number;
    commentCount?: number;
    shareCount?: number;
    comment?: any[];
    block?: any[];
    report?: any[];
    hashtag?: string;
    mention?: any;
    playList?: Boolean;
    type?: string;
    date?: number;
    month?: number;
    year?: number;
    isDeleted?: boolean;
    status?: number;
    modifiedOn?: Date;
    modifiedBy?: string;
    createdOn?: Date;
    createdBy?: string;
};

const postSchema = new mongoose.Schema({
    _id: { type: mongoose.Types.ObjectId, required: true, auto: true },
    url: { type: String },
    fileType: { type: Number },
    description: { type: String },
    title: { type: String },
    user: { type: mongoose.Types.ObjectId, ref: 'Master' },
    likeCount: { type: Number, default: 0 },
    likes: [{
        user: { type: mongoose.Types.ObjectId, refPath: 'likes.modleType' },
        modelType: { type: String, enum: ['User', 'Master', 'Company'], required: true },
    }],
    commentCount: { type: Number, default: 0 },
    shareCount: { type: Number, default: 0 },
    comment: [
        {
            user: { type: mongoose.Types.ObjectId, refPath: 'comment.modelType' },
            modelType: { type: String, enum: ['User', 'Master', 'Company'], required: true },
            comments: { type: String, default: "" },
            createdOn: { type: Date },
        }
    ],
    block: [{
        user: { type: mongoose.Types.ObjectId, refPath: 'block.modelType' },
        modelType: { type: String, enum: ['User', 'Master', 'Company'], required: true },
    }],
    report: [{
        type: { type: String },
        user: { type: mongoose.Types.ObjectId, ref: 'report.modelType' },
        modelType: { type: String, enum: ['User', 'Master', 'Company'], required: true },
        description: { type: String },
        createdOn: { type: Date }
    }],
    hashtag: { type: String },
    mention: [{ type: mongoose.Types.ObjectId, ref: 'Master' }],
    playList: { type: Boolean, default: false },
    type: { type: String },
    date: { type: Number },
    month: { type: Number },
    year: { type: Number },
    isDeleted: { type: Boolean, default: false },
    status: { type: Number, default: 1 },
    modifiedOn: { type: Date },
    modifiedBy: { type: String },
    createdOn: { type: Date },
    createdBy: { type: String }
})

export const Post = mongoose.model("Post", postSchema)