import { validationResult } from "express-validator";
import { clientError, errorMessage } from "../helper/ErrorMessage";
import { response } from "../helper/commonResponseHandler";
import { Post, PostDocument } from "../model/post.model";
import { Master } from "../model/master.model";
import { saveNotification } from "./notification.controller";
import mongoose from "mongoose";
import { PlayList } from "../model/playlist.model";

var activity = "Post"

/**
 * @author Ponjothi S
 * @date 15-11-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to get all Post.
 */
export let getAllPost = async (req, res, next) => {
    try {
        const data = await Post.find({ isDeleted: false });
        response(req, res, activity, 'Level-1', 'GetAll-Post', true, 200, data, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'GetAll-Post', false, 500, {}, errorMessage.internalServer, err.message);
    }
};

/**
 * @author Ponjothi S
 * @date 15-11-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to create Post.
 */
export let savePost = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const postDetails: PostDocument = req.body;
            let date = new Date();
            postDetails.date = date?.getDate();
            postDetails.month = date?.getMonth() + 1;
            postDetails.year = date?.getFullYear()
            const createData = new Post(postDetails);
            let insertData = await createData.save();
            if (postDetails.playList) { await PlayList.findByIdAndUpdate({ _id: req.body.playListId }, { $addToSet: { post: insertData._id }, $inc: { postCount: 1 } }) }
            if (postDetails.mention) {
                postDetails.mention.map(id => {
                    const data = { from: { user: postDetails.user, modelType: 'Master' }, to: { user: id, modelType: 'Master' }, description: 'Mention your name', title: 'Mention' }
                    saveNotification(data)
                })
            }
            response(req, res, activity, 'Level-2', 'Save-Post', true, 200, insertData, clientError.success.savedSuccessfully);

        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Save-Post', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Save-Post', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};


/**
 * @author Ponjothi S
 * @date 15-11-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to update Post.
 */
export let updatePost = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const postDetails: PostDocument = req.body;
            let updateData = await Post.findByIdAndUpdate({ _id: postDetails._id }, {
                $set: {
                    url: postDetails.url,
                    fileType: postDetails.fileType,
                    description: postDetails.description,
                    title: postDetails.title,
                    hashtag: postDetails.hashtag,
                    mention: postDetails.mention,
                    type: postDetails.type,
                    modifiedOn: postDetails.modifiedOn,
                    modifiedBy: postDetails.modifiedBy
                }
            });
            response(req, res, activity, 'Level-2', 'Update-Post', true, 200, updateData, clientError.success.updateSuccess)
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Update-Post', false, 500, {}, errorMessage.internalServer, err.message)
        }
    } else {
        response(req, res, activity, 'Level-3', 'Update-Post', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};

/**
 * @author Ponjothi S
 * @date 15-11-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to delete Post.
 */
export let deletePost = async (req, res, next) => {
    try {
        let { modifiedOn, modifiedBy } = req.body;
        let id = req.query._id;
        const data = await Post.findByIdAndUpdate({ _id: id }, {
            $set: {
                isDeleted: true,
                modifiedOn: modifiedOn,
                modifiedBy: modifiedBy,
            }
        })
        if (data && data.playList) {
            await PlayList.updateOne({ post: id }, { $pull: { post: id }, $inc: { postCount: -1 } })
        }
        response(req, res, activity, 'Level-2', 'Delete-Post', true, 200, data, clientError.success.deleteSuccess)
    }
    catch (err: any) {
        response(req, res, activity, 'Level-3', 'Delete-Post', true, 500, {}, errorMessage.internalServer, err.message)
    }
};



/**
 * @author Ponjothi S
 * @date 15-11-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to get single Post.
 */
export let getSinglePost = async (req, res, next) => {
    try {
        const data = await Post.findById({ _id: req.query._id }).populate('comment.user', { name: 1, image: 1 }).populate('user', { image: 1 })
        response(req, res, activity, 'Level-1', 'Get-SinglePost', true, 200, data, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-SinglePost', false, 500, {}, errorMessage.internalServer, err.message);
    }
}


/**
@author Ponjothi S
 * @date 15-11-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next 
 * @description This Function is used to get filter Post.
 */
export let getFilterPost = async (req, res, next) => {
    try {
        // var master = await Master.findById({ _id: req.body.loginId });
        var masterList
        // if (master) {
        //     if (master.secondarySkill) {
        //         const result = await Master.find({ $or: [{ $or: [{ primarySkill: master.secondarySkill }, { secondarySkill: master.secondarySkill }] }, { $or: [{ primarySkill: master.primarySkill }, { secondarySkill: master.primarySkill }] }] })
        //         masterList = result.map(x => x._id)
        //     }
        //     else {
        //         const result = await Master.find({ $or: [{ primarySkill: master.primarySkill }, { secondarySkill: master.primarySkill }] })
        //         masterList = result.map(x => x._id)

        //     }
        //     if (master.connectedUsers) {
        //         master.connectedUsers.map(x => {
        //             masterList.push(x)
        //         });
        //     }
        // }
        var findQuery;
        var andList: any = []
        var limit = req.body.limit ? req.body.limit : 0;
        var page = req.body.page ? req.body.page : 0;
        andList.push({ isDeleted: false })
        andList.push({ 'block.user': { $nin: req.body.loginId } })
        andList.push({ playList: false })
        // andList.push({ user: { $in: masterList } })        
        if (req.body.user) {
            andList.push({ user: req.body.user });
        }
        findQuery = (andList.length > 0) ? { $and: andList } : {}
        const postList = await Post.find(findQuery).sort({ createdOn: -1 }).limit(limit).skip(page).populate('user', { name: 1, image: 1 }).populate('comment.user', { name: 1, image: 1 })
        const postCount = await Post.find(findQuery).count()
        response(req, res, activity, 'Level-1', 'Get-FilterPost', true, 200, { postList, postCount }, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-FilterPost', false, 500, {}, errorMessage.internalServer, err.message);
    }
};

/**
@author Ponjothi S
 * @date 15-11-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next 
 * @description This Function is used to get filter Post.
 */
export let getFilterPostByUser = async (req, res, next) => {
    try {
        var findQuery;
        var andList: any = []
        var limit = req.body.limit ? req.body.limit : 0;
        var page = req.body.page ? req.body.page : 0;
        andList.push({ isDeleted: false })
        andList.push({ 'block.user': { $nin: req.body.loginId } })
        if (req.body.user) {
            andList.push({ user: req.body.user });
        }
        findQuery = (andList.length > 0) ? { $and: andList } : {}
        const postList = await Post.find(findQuery).sort({ createdOn: -1 }).limit(limit).skip(page).populate('user', { name: 1, image: 1 }).populate('comment.user', { name: 1, image: 1 })
        const postCount = await Post.find(findQuery).count()
        response(req, res, activity, 'Level-1', 'Get-FilterPostByUser', true, 200, { postList, postCount }, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-FilterPostByUser', false, 500, {}, errorMessage.internalServer, err.message);
    }
};


/**
 @author Ponjothi S
 * @date 25-11-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next   
 * @description This Function is used to create Likes.
 */
export let savePostLikes = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const postDetails: PostDocument = req.body;
            const postLikeDetails = await Post.findOne({ $and: [{ 'likes.user': postDetails.likes.user }, { _id: postDetails._id }] })
            if (postLikeDetails) {
                const deleteLikes = await Post.findByIdAndUpdate({ _id: postDetails._id },
                    {
                        $pull: { likes: postDetails.likes },
                        $inc: { likeCount: -1 }
                    }
                )
                response(req, res, activity, 'Level-2', 'Save-PostLikes', true, 200, deleteLikes, clientError.success.deleteSuccess);
            } else {
                const updateLikes = await Post.findByIdAndUpdate({ _id: postDetails._id },
                    {
                        $push: { likes: postDetails.likes },
                        $inc: { likeCount: 1 }
                    },
                )
                if (updateLikes && updateLikes.user) {
                    if (updateLikes.user.valueOf() !== postDetails.likes.user) {
                        var data
                        if (postDetails.likes.modelType === 'User') {
                            data = { from: { user: postDetails.likes.user, modelType: 'User' }, to: { user: updateLikes.user, modelType: 'Master' }, description: 'Like your post', title: 'Like' }
                        }
                        if (postDetails.likes.modelType === 'Master') {
                            data = { from: { user: postDetails.likes.user, modelType: 'Master' }, to: { user: updateLikes.user, modelType: 'Master' }, description: 'Like your post', title: 'Like' }
                        }
                        saveNotification(data)
                    }
                }
                response(req, res, activity, 'Level-2', 'Save-PostLikes', true, 200, updateLikes, clientError.success.savedSuccessfully);
            }

        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Save-PostLikes', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Save-PostLikes', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};


/**  
@author Ponjothi S
 * @date 25-11-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to save post comments.
 **/
export let createPostComments = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            req.body.comment.createdOn = new Date()
            const postDetails: PostDocument = req.body;
            let updateData = await Post.findByIdAndUpdate({ _id: req.body._id }, {
                $inc: { commentCount: 1 },
                $addToSet: {
                    comment: req.body.comment,
                },
                $set: {
                    modifiedOn: postDetails.modifiedOn,
                    modifiedBy: postDetails.modifiedBy
                }
            })

            if (updateData && updateData.user) {
                if (updateData.user.valueOf() !== req.body.comment.user) {
                    var data
                    if (req.body.comment.modelType === 'User') {
                        data = { from: { user: req.body.comment.user, modelType: 'User' }, to: { user: updateData.user, modelType: 'Master' }, description: 'Comment your post', title: 'Comment' }
                    }
                    if (req.body.comment.modelType === 'Master') {
                        data = { from: { user: req.body.comment.user, modelType: 'Master' }, to: { user: updateData.user, modelType: 'Master' }, description: 'Comment your post', title: 'Comment' }
                    }
                    saveNotification(data)
                }
            }
            response(req, res, activity, 'Level-2', 'Save-PostComments', true, 200, updateData, clientError.success.savedSuccessfully)
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Save-PostComments', false, 500, {}, errorMessage.internalServer, err.message);
        }
    }
    else {
        response(req, res, activity, 'Level-3', 'Save-PostComments', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}

/**
 * @author Ponjothi S
 * @date 25-11-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to update block Users.
 */
export let updatePostBlockUsers = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const postDetails: PostDocument = req.body;
            let updateData = await Post.findByIdAndUpdate({ _id: req.body._id }, {
                $addToSet: {
                    block: postDetails.block,
                },
                $set: {
                    modifiedOn: postDetails.modifiedOn,
                    modifiedBy: postDetails.modifiedBy
                }
            })
            response(req, res, activity, 'Level-2', 'Update-BlockUser', true, 200, updateData, 'Hide successfully')
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Update-BlockUser', false, 500, {}, errorMessage.internalServer, err.message);
        }
    }
    else {
        response(req, res, activity, 'Level-3', 'Update-BlockUser', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}

/**
 * @author Ponjothi S
 * @date 25-11-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to save post report.
 */
export let updatePostReport = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            req.body.report.createdOn = new Date();
            const postDetails: PostDocument = req.body;
            let postReport = await Post.findByIdAndUpdate({ _id: postDetails._id }, {
                $push: {
                    report: postDetails.report,
                },
                $set: {
                    modifiedOn: postDetails.modifiedOn,
                    modifiedBy: postDetails.modifiedBy
                }
            })
            response(req, res, activity, 'Level-2', 'update-PostReport', true, 200, postReport, clientError.success.savedSuccessfully)
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'update-PostReport', false, 500, {}, errorMessage.internalServer, err.message);
        }
    }
    else {
        response(req, res, activity, 'Level-3', 'update-PostReport', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}

/**
 * @author Ponjothi S
 * @date 15-11-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to get all Post.
 */
export let getPostForPlayList = async (req, res, next) => {
    try {
        const data = await Post.find({ isDeleted: false, fileType: 2, user: req.body.loginId, playList: false });
        response(req, res, activity, 'Level-1', 'Get-PostForPlayList', true, 200, data, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-PostForPlayList', false, 500, {}, errorMessage.internalServer, err.message);
    }
};