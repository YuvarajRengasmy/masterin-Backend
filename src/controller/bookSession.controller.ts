import { validationResult } from "express-validator";
import { clientError, errorMessage } from "../helper/ErrorMessage";
import { response } from "../helper/commonResponseHandler";
import { BookSession, BookSessionDocument } from "../model/bookSession.model";
import { saveNotification } from "./notification.controller";
import { User } from "../model/user.model";
import { Master } from "../model/master.model";


var activity = "BookSession"

/**
 * @author Ponjothi S
 * @date 19-12-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to get all Book Session.
 */
export let getAllBookSession = async (req, res, next) => {
    try {
        const data = await BookSession.find({ isDeleted: false });
        response(req, res, activity, 'Level-1', 'GetAll-BookSession', true, 200, data, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'GetAll-BookSession', false, 500, {}, errorMessage.internalServer, err.message);
    }
};

/**
 * @author Ponjothi S
 * @date 19-12-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to save Book Session.
 */
export let saveBookSession = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const sessionDetails: BookSessionDocument = req.body;
            const createData = new BookSession(sessionDetails);
            let insertData = await createData.save();
            const reduceUserCoins = await User.findByIdAndUpdate({ _id: sessionDetails.user }, {
                $inc: { coins: -req.body.coins }
            })
            const increaseMasterCoins = await Master.findByIdAndUpdate({ _id: sessionDetails.master }, {
                $inc: { coins: req.body.coins }
            })
            const user = { from: { user: sessionDetails.master, modelType: 'Master' }, to: { user: sessionDetails.user, modelType: 'User' }, description: 'You have successfully booked your session', title: 'Book Session' }
            const master = { from: { user: sessionDetails.user, modelType: 'User' }, to: { user: sessionDetails.master, modelType: 'Master' }, description: `You have been booked for a session.`, title: 'Book Session' }
            saveNotification(user)
            saveNotification(master)
            response(req, res, activity, 'Level-2', 'Save-BookSession', true, 200, insertData, clientError.success.savedSuccessfully);

        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Save-BookSession', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Save-BookSession', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};


/**
 * @author Ponjothi S
 * @date 19-12-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to update Book Session.
 */
export let updateBookSession = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const sessionDetails: BookSessionDocument = req.body;
            let updateData = await BookSession.findByIdAndUpdate({ _id: sessionDetails._id }, {
                $set: {
                    date: sessionDetails.date,
                    time: sessionDetails.time,
                    description: sessionDetails.description,
                    modifiedOn: sessionDetails.modifiedOn,
                    modifiedBy: sessionDetails.modifiedBy
                }
            });
            response(req, res, activity, 'Level-2', 'Update-BookSession', true, 200, updateData, clientError.success.updateSuccess)
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Update-BookSession', false, 500, {}, errorMessage.internalServer, err.message)
        }
    } else {
        response(req, res, activity, 'Level-3', 'Update-BookSession', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};

/**
 * @author Ponjothi S
 * @date 19-12-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to delete Book Session.
 */
export let deleteBookSession = async (req, res, next) => {
    try {
        let { modifiedOn, modifiedBy } = req.body;
        let id = req.query._id;
        const data = await BookSession.findByIdAndUpdate({ _id: id }, {
            $set: {
                isDeleted: true,
                modifiedOn: modifiedOn,
                modifiedBy: modifiedBy,
            }
        })
        response(req, res, activity, 'Level-2', 'Delete-BookSession', true, 200, data, clientError.success.deleteSuccess)
    }
    catch (err: any) {
        response(req, res, activity, 'Level-3', 'Delete-BookSession', true, 500, {}, errorMessage.internalServer, err.message)
    }
};



/**
 * @author Ponjothi S
 * @date 19-12-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to get single Book Session.
 */
export let getSingleBookSession = async (req, res, next) => {
    try {
        const data = await BookSession.findById({ _id: req.query._id }).populate('user', { name: 1, image: 1, description: 1, backgroundImage: 1, email: 1, mobile: 1, position: 1 })
        response(req, res, activity, 'Level-1', 'Get-SingleBookSession', true, 200, data, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-SingleBookSession', false, 500, {}, errorMessage.internalServer, err.message);
    }
}



/**
@author Ponjothi S
 * @date 19-12-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next 
 * @description This Function is used to get filter Book Session.
 */
export let getFilterBookSession = async (req, res, next) => {
    try {
        var findQuery;
        var andList: any = []
        var limit = req.body.limit ? req.body.limit : 0;
        var page = req.body.page ? req.body.page : 0;
        andList.push({ isDeleted: false })
        if (req.body.master) {
            andList.push({ master: req.body.master })
        }
        findQuery = (andList.length > 0) ? { $and: andList } : {}
        const bookSessionList = await BookSession.find(findQuery).sort({ createdOn: -1 }).limit(limit).skip(page).populate('user', { name: 1, image: 1 })
        const bookSessionCount = await BookSession.find(findQuery).count()
        response(req, res, activity, 'Level-1', 'Get-FilterBookSession', true, 200, { bookSessionList, bookSessionCount }, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-FilterBookSession', false, 500, {}, errorMessage.internalServer, err.message);
    }
};

/**
 * @author Ponjothi S
 * @date 27-01-2024
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to get all Upcoming Sessions.
 */
export let getAllUpcomingSessions = async (req, res, next) => {
    try {
        const date = new Date().setUTCHours(0,0,0,0)
        const data = await BookSession.find({ $and: [{ isDeleted: false }, { user: req.body.loginId }, { date: { $gte: date } }] }).populate('master',{name:1,image:1})
        response(req, res, activity, 'Level-1', 'GetAll-UpcomingSessions', true, 200, data, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'GetAll-UpcomingSessions', false, 500, {}, errorMessage.internalServer, err.message);
    }
};