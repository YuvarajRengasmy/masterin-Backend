import { validationResult } from "express-validator";
import { clientError, errorMessage } from "../helper/ErrorMessage";
import { response } from "../helper/commonResponseHandler";
import { EventDocument, Event } from "../model/event.model";
import { User } from "../model/user.model";
import { Master } from "../model/master.model";
import { saveNotification } from "./notification.controller";


var activity = "Event"

/**
 * @author Ponjothi S
 * @date 06-02-2024
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to get all Events.
 */
export let getAllEvents = async (req, res, next) => {
    try {
        const data = await Event.find({ isDeleted: false });
        response(req, res, activity, 'Level-1', 'GetAll-Event', true, 200, data, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'GetAll-Event', false, 500, {}, errorMessage.internalServer, err.message);
    }
};

/**
 * @author Ponjothi S
 * @date 06-02-2024
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to save event.
 */
export let saveEvent = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const eventDetails: EventDocument = req.body;
            const createData = new Event(eventDetails);
            let insertData = await createData.save();
            response(req, res, activity, 'Level-2', 'Save-Event', true, 200, insertData, clientError.success.savedSuccessfully);

        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Save-Event', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Save-Event', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};


/**
 * @author Ponjothi S
 * @date 06-02-2024
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to update event.
 */
export let updateEvent = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const eventDetails: EventDocument = req.body;
            let updateData = await Event.findByIdAndUpdate({ _id: eventDetails._id }, {
                $set: {
                    date: eventDetails.date,
                    fromTime: eventDetails.fromTime,
                    toTime: eventDetails.toTime,
                    title: eventDetails.title,
                    bannerImage: eventDetails.bannerImage,
                    eventImage1: eventDetails.eventImage1,
                    eventImage2: eventDetails.eventImage2,
                    eventType: eventDetails.eventType,
                    category: eventDetails.category,
                    location: eventDetails.location,
                    coins: eventDetails.coins,
                    isPaid: eventDetails.isPaid,
                    description: eventDetails.description,
                    type: eventDetails?.type,
                    modifiedOn: eventDetails.modifiedOn,
                    modifiedBy: eventDetails.modifiedBy
                }
            });
            response(req, res, activity, 'Level-2', 'Update-Event', true, 200, updateData, clientError.success.updateSuccess)
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Update-Event', false, 500, {}, errorMessage.internalServer, err.message)
        }
    } else {
        response(req, res, activity, 'Level-3', 'Update-Event', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};

/**
 * @author Ponjothi S
 * @date 06-02-2024
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to delete event.
 */
export let deleteEvent = async (req, res, next) => {
    try {
        let { modifiedOn, modifiedBy } = req.body;
        let id = req.query._id;
        const data = await Event.findByIdAndUpdate({ _id: id }, {
            $set: {
                isDeleted: true,
                modifiedOn: modifiedOn,
                modifiedBy: modifiedBy,
            }
        })
        response(req, res, activity, 'Level-2', 'Delete-Event', true, 200, data, clientError.success.deleteSuccess)
    }
    catch (err: any) {
        response(req, res, activity, 'Level-3', 'Delete-Event', true, 500, {}, errorMessage.internalServer, err.message)
    }
};



/**
 * @author Ponjothi S
 * @date 06-02-2024
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to get single event.
 */
export let getSingleEvent = async (req, res, next) => {
    try {
        const data = await Event.findById({ _id: req.query._id })
        response(req, res, activity, 'Level-1', 'Get-SingleEvent', true, 200, data, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-SingleEvent', false, 500, {}, errorMessage.internalServer, err.message);
    }
}


/**
@author Ponjothi S
 * @date 07-02-2024
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next 
 * @description This Function is used to get filter events.
 */
export let getFilterEvents = async (req, res, next) => {
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
        const eventList = await Event.find(findQuery).sort({ createdOn: -1 }).limit(limit).skip(page).populate('master', { name: 1, image: 1 })
        const eventCount = await Event.find(findQuery).count()
        response(req, res, activity, 'Level-1', 'Get-FilterEvents', true, 200, { eventList, eventCount }, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-FilterEvents', false, 500, {}, errorMessage.internalServer, err.message);
    }
};


/**
 * @author Ponjothi S
 * @date 08-02-2024
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to get all Upcoming Events.
 */
export let getAllUpcomingEvents = async (req, res, next) => {
    try {
        const date = new Date().setUTCHours(0, 0, 0, 0)
        const data = await Event.find({ $and: [{ isDeleted: false }, { date: { $gte: date } }] }, { bannerImage: 1, date: 1, title: 1, coins: 1, bookedUsers: 1 })
        response(req, res, activity, 'Level-1', 'GetAll-UpcomingEvents', true, 200, data, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'GetAll-UpcomingEvents', false, 500, {}, errorMessage.internalServer, err.message);
    }
};

/**
 * @author Ponjothi S
 * @date 08-02-2024
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to update event users.
 */
export let updateBookedUsers = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const eventDetails: EventDocument = req.body;
            let updateData = await Event.findByIdAndUpdate({ _id: eventDetails._id }, {
                $addToSet: {
                    bookedUsers: eventDetails.bookedUsers
                }
            });
            if (updateData) {
                const reduceUserCoins = await User.findByIdAndUpdate({ _id: eventDetails.bookedUsers }, {
                    $inc: { coins: -updateData.coins }
                })
                const increaseMasterCoins = await Master.findByIdAndUpdate({ _id: updateData.master }, {
                    $inc: { coins: updateData.coins }
                })

                const user = { from: { user: updateData.master, modelType: 'Master' }, to: { user: eventDetails.bookedUsers, modelType: 'User' }, description: 'You have successfully booked your event', title: 'Event' }
                const master = { from: { user: eventDetails.bookedUsers, modelType: 'User' }, to: { user: updateData.master, modelType: 'Master' }, description: `You have been booked for a event.`, title: 'Event' }
                saveNotification(user)
                saveNotification(master)
            }
            response(req, res, activity, 'Level-2', 'Update-BookedUsers', true, 200, updateData, clientError.success.updateSuccess)
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Update-BookedUsers', false, 500, {}, errorMessage.internalServer, err.message)
        }
    } else {
        response(req, res, activity, 'Level-3', 'Update-BookedUsers', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};


/**
@author Ponjothi S
 * @date 07-02-2024
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next 
 * @description This Function is used to get filter events.
 */
export let getFilterUpComingEvents = async (req, res, next) => {
    try {
        var findQuery;
        var andList: any = []
        const date = new Date().setUTCHours(0, 0, 0, 0)
        var limit = req.body.limit ? req.body.limit : 0;
        var page = req.body.page ? req.body.page : 0;
        andList.push({ isDeleted: false })
        andList.push({ type: req.body.type })
        if (req.body.filter === 'all') {
            andList.push({ date: { $gte: date } })
        }
        if (req.body.filter === 'today') {
            andList.push({ date: { $eq: date } })
        }
        if (req.body.filter === 'tomorrow') {
            const tomorrow = new Date();
           const date = new Date(tomorrow.setDate(tomorrow.getDate() + 1)).setUTCHours(0, 0, 0, 0)
            andList.push({ date: { $eq: date } })
        }
        findQuery = (andList.length > 0) ? { $and: andList } : {}
        const eventList = await Event.find(findQuery).sort({ createdOn: -1 }).limit(limit).skip(page)
        const eventCount = await Event.find(findQuery).count()
        response(req, res, activity, 'Level-1', 'Get-FilterUpComingEvents', true, 200, { eventList, eventCount }, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-FilterUpComingEvents', false, 500, {}, errorMessage.internalServer, err.message);
    }
};