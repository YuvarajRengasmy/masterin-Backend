import { Master } from "../model/master.model";
import { clientError, errorMessage } from "../helper/ErrorMessage";
import { response } from "../helper/commonResponseHandler";
import { BookSession } from "../model/bookSession.model";
import { PlayList } from "../model/playlist.model";
import { Event } from '../model/event.model'
import mongoose from "mongoose";


var activity = "Dashboard"

/**
 * @author Ponjothi S
 * @date 01-02-2024
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to get total counts for master.
 */
export let getMasterDashboardCounts = async (req, res, next) => {
    try {
        const id = new mongoose.Types.ObjectId(req.body.loginId)
        const master = await Master.findById({ _id: id }, { coins: 1, name: 1, image: 1 });
        const bookedSession = await BookSession.find({ $and: [{ master: id }, { isDeleted: false }] }).count()
        const totalPlayList = await PlayList.find({ $and: [{ user: id }, { isDeleted: false }] }).count()
        const events = await Event.aggregate([
            { $match: { $and: [{ master: id }, { isDeleted: false }, { type: 'event' }] } },
            { $project: { bookedUserCount: { $size: '$bookedUsers' } } },
            { $group: { _id: null, totalCount: { $sum: '$bookedUserCount' } } },
        ])
        const bookedEvents = events[0].totalCount
        const workShops = await Event.aggregate([
            { $match: { $and: [{ master: id }, { isDeleted: false }, { type: 'workshop' }] } },
            { $project: { bookedUserCount: { $size: '$bookedUsers' } } },
            { $group: { _id: null, totalCount: { $sum: '$bookedUserCount' } } },
        ])
        const bookedWorkShops = workShops[0].totalCount
        response(req, res, activity, 'Level-1', 'Get-MasterDashboardCounts', true, 200, { master, bookedSession, totalPlayList, bookedEvents, bookedWorkShops }, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-MasterDashboardCounts', false, 500, {}, errorMessage.internalServer, err.message);
    }
};

/**
 * @author Ponjothi S
 * @date 01-02-2024
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to get list for master.
 */
export let getMasterDashboardList = async (req, res, next) => {
    try {
        const id = new mongoose.Types.ObjectId(req.body.loginId)
        const sessionList = await BookSession.find({ $and: [{ master: id }, { isDeleted: false }] }).populate('user', { name: 1, image: 1 })
        const playList = await PlayList.find({ $and: [{ user: id }, { isDeleted: false }] }, { name: 1, thumbnail: 1, createdOn: 1 }).sort({ createdOn: -1 }).limit(4)
        const eventList = await Event.find({ $and: [{ master: id }, { isDeleted: false }] }, { bannerImage: 1, title: 1, createdOn: 1, date: 1 }).sort({ createdOn: -1 }).limit(2).populate('master', { name: 1, image: 1 })
        response(req, res, activity, 'Level-1', 'Get-MasterDashboardList', true, 200, { playList, sessionList, eventList }, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-MasterDashboardList', false, 500, {}, errorMessage.internalServer, err.message);
    }
};


/**
 * @author Ponjothi S
 * @date 13-02-2024
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to get all master events.
 */
export let getAllMasterEvents = async (req, res, next) => {
    try {
        const data = await Event.find({ $and: [{ isDeleted: false }, { master: req.body.loginId }, { type: 'event' }] },{title:1});
        response(req, res, activity, 'Level-1', 'GetAll-MasterEvents', true, 200, data, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'GetAll-MasterEvents', false, 500, {}, errorMessage.internalServer, err.message);
    }
};

/**
 * @author Ponjothi S
 * @date 13-02-2024
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to filter events.
 */
export let getDashboardEventsFilter = async (req, res, next) => {
    try {
        var findQuery;
        var andList: any = []
        var limit = req.body.limit ? req.body.limit : 0;
        var page = req.body.page ? req.body.page : 0;
        andList.push({ isDeleted: false })
        andList.push({ master: req.body.loginId })
        andList.push({ type: 'event' })
        if(req.body.filter){
            andList.push({title:{$in:req.body.filter}}) 
        }        
        findQuery = (andList.length > 0) ? { $and: andList } : {}
        const eventList = await Event.find(findQuery,{date:1,bookedUsers:1}).sort({ createdOn: -1 }).populate('bookedUsers', { name: 1, image: 1 })
        response(req, res, activity, 'Level-1', 'Get-DashboardEventsFilter', true, 200, eventList, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-DashboardEventsFilter', false, 500, {}, errorMessage.internalServer, err.message);
    }
};

/**
 * @author Ponjothi S
 * @date 13-02-2024
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to get all master workshops.
 */
export let getAllMasterWorkShops = async (req, res, next) => {
    try {
        const data = await Event.find({ $and: [{ isDeleted: false }, { master: req.body.loginId }, { type: 'workshop' }] },{title:1});
        response(req, res, activity, 'Level-1', 'GetAll-MasterWorkShops', true, 200, data, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'GetAll-MasterWorkShops', false, 500, {}, errorMessage.internalServer, err.message);
    }
};

/**
 * @author Ponjothi S
 * @date 13-02-2024
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to filter workshops.
 */
export let getDashboardWorkShopsFilter = async (req, res, next) => {
    try {
        var findQuery;
        var andList: any = []
        var limit = req.body.limit ? req.body.limit : 0;
        var page = req.body.page ? req.body.page : 0;
        andList.push({ isDeleted: false })
        andList.push({ master: req.body.loginId })
        andList.push({ type: 'workshop' })
        if(req.body.filter){
            andList.push({title:{$in:req.body.filter}}) 
        }        
        findQuery = (andList.length > 0) ? { $and: andList } : {}
        const eventList = await Event.find(findQuery,{date:1,bookedUsers:1}).sort({ createdOn: -1 }).populate('bookedUsers', { name: 1, image: 1 })
        response(req, res, activity, 'Level-1', 'Get-DashboardWorkShopsFilter', true, 200, eventList, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-DashboardWorkShopsFilter', false, 500, {}, errorMessage.internalServer, err.message);
    }
};
