import { validationResult } from "express-validator";
import { clientError, errorMessage } from "../helper/ErrorMessage";
import { response } from "../helper/commonResponseHandler";
import { PlayList, PlayListDocument } from "../model/playlist.model";
import { User } from "../model/user.model";
import { Post } from "../model/post.model";

var activity = "PlayList";


/**
 * @author Mohanraj V
 * @date 04-01-2024
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to save PlayList.
 */

export let savePlayList = async (req, res, next) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        try {
            const playListDetails: PlayListDocument = req.body;
            playListDetails.postCount = playListDetails.post.length
            const userDetails = new PlayList(playListDetails)
            const insertData = await userDetails.save();
            if (playListDetails.post.length > 0) {
                playListDetails.post.map(async post =>
                    await Post.findByIdAndUpdate({ _id: post }, { $set: { playList: true } }))
            }
            response(req, res, activity, 'Level-1', 'Save-PlayList', true, 200, insertData, clientError.success.savedSuccessfully)
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Save-PlayList', false, 500, {}, errorMessage.internalServer, err.message)
        }
    } else {
        response(req, res, activity, 'Level-3', 'Save-PlayList', false, 500, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()))
    }
}
/**
 * @author Mohanraj V
 * @date 04-01-2024
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to save PlayList.
 */

export let getAllPlayList = async (req, res, next) => {
    try {
        const data = await PlayList.find({ isDeleted: false });
        response(req, res, activity, 'Level-1', 'GetAll-PlayList', true, 200, data, clientError.success.fetchedSuccessfully)
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'GetAll-PlayList', false, 500, {}, errorMessage.internalServer, err.message)
    }
}
/**
 * @author Mohanraj V
 * @date 04-01-2024
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to save PlayList.
 */
export let addPlayList = async (req, res, next) => {
    try {
        const data = await PlayList.updateOne({ _id: req.body._id },
            {
                $push: { post: req.body.post, },
                $inc: { postCount: 1 },
                $set: { modifiedOn: new Date(), },
            });
        if (data) {
            const data = await Post.findByIdAndUpdate({ _id: req.body.post }, { $set: { playlist: true } })
        }
        response(req, res, activity, 'Level-1', 'Add-PlayList', true, 200, data, clientError.success.fetchedSuccessfully)

    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Add-PlayList', false, 500, {}, errorMessage.internalServer, err.message)
    }
}


/**
 * @author Mohanraj V
 * @date 04-01-2024
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to save PlayList.
 */
export let removePlayList = async (req, res, next) => {
    try {
        const data = await PlayList.updateOne({ _id: req.body._id },
            {
                $pull: { post: req.body.post, },
                $inc: { postCount: -1 },
                $set: { modifiedOn: new Date(), },
            });
        if (data) {
            const data = await Post.findByIdAndUpdate({ _id: req.body.post }, { $set: { playlist: false } })
        }
        response(req, res, activity, 'Level-1', 'Remove-PlayList', true, 200, data, clientError.success.fetchedSuccessfully)

    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Remove-PlayList', false, 500, {}, errorMessage.internalServer, err.message)
    }
}
/**
 * @author Mohanraj V
 * @date 04-01-2024
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to save PlayList.
 */
export let updatePlayList = async (req, res, next) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        try {
            const playListDetails: PlayListDocument = req.body;
            playListDetails.postCount = playListDetails.post.length
            const data = await PlayList.updateOne({ _id: playListDetails._id },
                {
                    $set: {
                        name: playListDetails.name,
                        thumbnail: playListDetails.thumbnail,
                        postCount: playListDetails.postCount,
                        post: playListDetails.post,
                        description: playListDetails.description,
                        category: playListDetails.category,
                        modifiedOn: playListDetails.modifiedOn,
                        modifiedBy: playListDetails.modifiedBy
                    }
                });
            if (req.body.addPost.length > 0) {
                req.body.addPost.map(async post =>
                    await Post.findByIdAndUpdate({ _id: post }, { $set: { playList: true } }))
            }
            if (req.body.removePost.length > 0) {
                req.body.removePost.map(async post =>
                    await Post.findByIdAndUpdate({ _id: post }, { $set: { playList: false } }))
            }
            response(req, res, activity, 'Level-1', 'Update-PlayList', true, 200, data, clientError.success.fetchedSuccessfully)

        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Update-PlayList', false, 500, {}, errorMessage.internalServer, err.message)

        }
    } else {
        response(req, res, activity, 'Level-3', 'Update-PlayList', false, 500, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()))
    }

}

/**
 * @author Mohanraj V
 * @date 04-01-2024
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to save PlayList.
 */
export let deletePlayList = async (req, res, next) => {
    try {
        let { modifiedOn, modifiedBy } = req.body;
        let id = req.query._id;        
        const data = await PlayList.findByIdAndUpdate({ _id: id }, {
            $set: {
                isDeleted: true,
                modifiedOn: modifiedOn,
                modifiedBy: modifiedBy,
            }
        })
        if (data && data.post.length > 0) {
            data.post.map(async x =>
                await Post.findByIdAndUpdate({ _id: x }, {
                    $set: {
                        playList: false,
                        modifiedOn: modifiedOn,
                        modifiedBy: modifiedBy,
                    }
                }))
        }
        response(req, res, activity, 'Level-1', 'Delete-PlayList', true, 200, data, clientError.success.deleteSuccess)

    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Delete-PlayList', false, 500, {}, errorMessage.internalServer, err.message)
    }
}

/**
 * @author Mohanraj V
 * @date 04-01-2024
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to save PlayList.
 */

export let getSinglePlayList = async (req, res, next) => {
    try {
        const data = await PlayList.findById({ _id: req.query._id }).populate({ path: 'post', populate: { path: 'comment.user', select: 'name image' } }).populate('user', { name: 1, image: 1 })
        response(req, res, activity, 'Level-1', 'Get-PlayList', true, 200, data, clientError.success.fetchedSuccessfully)
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-PlayList', false, 500, {}, errorMessage.internalServer, err.message)
    }
}

/**
 * @author Ponjothi S
 * @date 05-01-2024
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next 
 * @description This Function is used to get filter PlayList.
 */
export let getFilterPlayList = async (req, res, next) => {
    try {
        var findQuery;
        var andList: any = []
        var limit = req.body.limit ? req.body.limit : 0;
        var page = req.body.page ? req.body.page : 0;
        andList.push({ isDeleted: false })
        andList.push({ post: { $ne: [] } })
        findQuery = (andList.length > 0) ? { $and: andList } : {}
        const playList = await PlayList.find(findQuery).sort({ createdOn: -1 }).limit(limit).skip(page).populate('user', { name: 1, image: 1 }).populate('category', { category: 1 })
        const playListCount = await PlayList.find(findQuery).count()
        response(req, res, activity, 'Level-1', 'Get-FilterPlayList', true, 200, { playList, playListCount }, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-FilterPlayList', false, 500, {}, errorMessage.internalServer, err.message);
    }
};


/**
 * @author Ponjothi S
 * @date 06-01-2024
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to get all playlist by user.
 */

export let getAllPlayListByUser = async (req, res, next) => {
    try {
        const data = await PlayList.find({ isDeleted: false, user: req.body.loginId });
        response(req, res, activity, 'Level-1', 'GetAll-PlayListByUser', true, 200, data, clientError.success.fetchedSuccessfully)
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'GetAll-PlayListByUser', false, 500, {}, errorMessage.internalServer, err.message)
    }
}