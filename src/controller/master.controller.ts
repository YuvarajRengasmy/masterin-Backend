import { validationResult } from "express-validator";
import { clientError, errorMessage } from "../helper/ErrorMessage";
import { response, sendConnectionNotification } from "../helper/commonResponseHandler";
import * as TokenManager from "../utils/tokenManager";
import { decrypt, encrypt } from "../helper/Encryption";
import { Master, MasterDocument } from "../model/master.model";
import { Post } from "../model/post.model";
import { Notification } from "../model/notification.model";
import { Company } from "../model/company.model";
import { User } from "../model/user.model";


var activity = "Master"

/**
 * @author Ponjothi S
 * @date 14-11-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to get all Masters.
 */
export let getAllMasters = async (req, res, next) => {
    try {
        const data = await Master.find({ isDeleted: false });
        response(req, res, activity, 'Level-1', 'GetAll-Master', true, 200, data, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'GetAll-Master', false, 500, {}, errorMessage.internalServer, err.message);
    }
};

/**
 * @author Ponjothi S
 * @date 14-11-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to create Masters.
 */
export let saveMasters = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const master = await Master.findOne({ $and: [{ isDeleted: false }, { email: req.body.email }] });
            const company = await Company.findOne({ $and: [{ isDeleted: false }, { email: req.body.email }] });
            const user = await User.findOne({ $and: [{ isDeleted: false }, { email: req.body.email }] });
            if (!master && !company && !user) {
                req.body.password = await encrypt(req.body.password)
                const masterDetails: MasterDocument = req.body;
                masterDetails.createdOn = new Date();
                let date = new Date();
                masterDetails.date = date?.getDate();
                masterDetails.month = date?.getMonth() + 1;
                masterDetails.year = date?.getFullYear()
                const uniqueId = Math.floor(Math.random() * 10000);// generate unique id on Username
                masterDetails.userName = masterDetails.name + "_" + uniqueId
                masterDetails.referralLink = "https://masterin.in/ProfilePage" + masterDetails.userName
                const createData = new Master(masterDetails);
                let insertData = await createData.save();
                const token = await TokenManager.CreateJWTToken({
                    id: insertData["_id"],
                    name: insertData["name"],
                    loginType: 'master'

                });
                const result = {}
                result['_id'] = insertData._id
                result['email'] = insertData.email;
                let finalResult = {};
                finalResult["loginType"] = 'master';
                finalResult["masterDetails"] = result;
                finalResult["token"] = token;
                response(req, res, activity, 'Level-2', 'Save-Master', true, 200, finalResult, clientError.success.registerSuccessfully);
            }
            else {
                response(req, res, activity, 'Level-3', 'Save-Master', true, 422, {}, 'Email already registered');
            }

        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Save-Master', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Save-Master', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};


/**
 * @author Ponjothi S
 * @date 14-11-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to update Master.
 */
export let updateMaster = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const masterDetails: MasterDocument = req.body;
            const master = await Master.findOne({ $and: [{ _id: { $ne: masterDetails._id }, }, { email: masterDetails.email }, { isDeleted: false }] });
            const company = await Company.findOne({ $and: [{ isDeleted: false }, { email: req.body.email }] });
            const user = await User.findOne({ $and: [{ isDeleted: false }, { email: req.body.email }] });
            if (!master && !company && !user) {
                const updateMaster = new Master(masterDetails)
                let insertMaster = await updateMaster.updateOne({
                    $set: {
                        email: masterDetails.email,
                        position: masterDetails.position,
                        location: masterDetails.location,
                        recoveryEmail: masterDetails.recoveryEmail,
                        link: masterDetails.link,
                        image: masterDetails.image,
                        descryption: masterDetails.descryption,
                        backgroundImage: masterDetails.backgroundImage,
                        mobile: masterDetails.mobile,
                        name:masterDetails.name,
                        category:masterDetails.category,
                        sessionCoins:masterDetails.sessionCoins,
                        isPublic:masterDetails.isPublic,
                        primarySkill: masterDetails.primarySkill,
                        secondarySkill: masterDetails.secondarySkill,
                        modifiedOn: masterDetails.modifiedOn,
                        modifiedBy: masterDetails.modifiedBy
                    }, $addToSet: {
                        experience: masterDetails.experience,
                        education: masterDetails.education,
                    }
                })
                response(req, res, activity, 'Level-2', 'Update-Master', true, 200, insertMaster, clientError.success.updateSuccess)
            }
            else {
                response(req, res, activity, 'Level-3', 'Update-Master', true, 422, {}, 'Email already registered');
            }
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Update-Master', false, 500, {}, errorMessage.internalServer, err.message)
        }
    } else {
        response(req, res, activity, 'Level-3', 'Update-Master', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};

/**
 * @author Ponjothi S
 * @date 14-11-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to delete Master.
 */
export let deleteMaster = async (req, res, next) => {
    try {
        let id = req.query._id;
        const master = await Master.findByIdAndDelete({ _id: id })
        const post = await Post.deleteMany({user:id})
        const notification = await Notification.deleteMany({$or:[{to:id},{from:id}]})
        response(req, res, activity, 'Level-2', 'Delete-Master', true, 200, master, clientError.success.deleteSuccess)
    }
    catch (err: any) {
        response(req, res, activity, 'Level-3', 'Delete-Master', true, 500, {}, errorMessage.internalServer, err.message)
    }
};



/**
 * @author Ponjothi S
 * @date 14-11-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to get single Master.
 */
export let getSingleMaster = async (req, res, next) => {
    try {
        const data = await Master.findById({ _id: req.query._id }).populate('category',{category:1})
        response(req, res, activity, 'Level-1', 'Get-SingleMaster', true, 200, data, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-SingleMaster', false, 500, {}, errorMessage.internalServer, err.message);
    }
}


/**
@author Ponjothi S
 * @date 14-11-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next 
 * @description This Function is used to get filter Master.
 */
export let getFilterMaster = async (req, res, next) => {
    try {
        // var master = await Master.findById({ _id: req.body.loginId })
        var findQuery;
        var andList: any = []
        var limit = req.body.limit ? req.body.limit : 0;
        var page = req.body.page ? req.body.page : 0;
        andList.push({ isDeleted: false })
        andList.push({ _id: { $ne: req.body.loginId } })
        // if (master) {
        //     if (master.secondarySkill) {
        //         andList.push({ $or: [{ $or: [{ primarySkill: master.secondarySkill }, { secondarySkill: master.secondarySkill }] }, { $or: [{ primarySkill: master.primarySkill }, { secondarySkill: master.primarySkill }] }] })
        //     }
        //     else {
        //         andList.push({ $or: [{ primarySkill: master.primarySkill }, { secondarySkill: master.primarySkill }] })
        //     }
        // }
        findQuery = (andList.length > 0) ? { $and: andList } : {}
        const masterList = await Master.find(findQuery).sort({ createdOn: -1 }).limit(limit).skip(page).populate('category',{category:1})
        const masterCount = await Master.find(findQuery).count()
        response(req, res, activity, 'Level-1', 'Get-FilterMaster', true, 200, { masterList, masterCount }, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-FilterMaster', false, 500, {}, errorMessage.internalServer, err.message);
    }
};


/**
 @author Ponjothi S
 * @date 27-11-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next   
 * @description This Function is used to update connected Masters.
 */
export let updateConnectedUsers = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const masterDetails: MasterDocument = req.body;
            const masterConnect = await Master.findOne({ $and: [{ connectedUsers: masterDetails.connectedUsers }, { _id: masterDetails._id }] })
            if (masterConnect) {
                const removeMasters = await Master.findByIdAndUpdate({ _id: masterDetails._id },
                    {
                        $pull: { connectedUsers: masterDetails.connectedUsers },
                        $inc: { connectedCount: -1 }
                    }
                )
                response(req, res, activity, 'Level-2', 'Update-connectedUsers', true, 200, removeMasters, 'Successfully Remove Connection');
            } else {
                const updateConnected = await Master.findByIdAndUpdate({ _id: masterDetails._id },
                    {
                        $push: { connectedUsers: masterDetails.connectedUsers },
                        $inc: { connectedCount: 1 }
                    },
                )
                const data = await Master.findOne({ _id: masterDetails.connectedUsers })
                sendConnectionNotification(updateConnected?.email, data?.name, data?.image, data?.referralLink)
                response(req, res, activity, 'Level-2', 'Update-connectedUsers', true, 200, updateConnected, 'Successfully Connecting');
            }

        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Update-connectedUsers', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Update-connectedUsers', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};


/**
 @author Mohanraj V
 * @date 29-11-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next   
 * @description This Function is used to update Master Education.
 */


export let updateMasterEducation = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const masterDetails: MasterDocument = req.body;
            const masterConnect = await Master.findOne({ _id: req.body._id })
            if (masterConnect) {
                const masterData = await Master.findByIdAndUpdate(
                    { _id: masterDetails._id }, // find Master id 
                    {$set:{
                        'education.$[ele].institute': masterDetails.education.institute,
                        'education.$[ele].qualification': masterDetails.education.qualification,
                        'education.$[ele].fieldOfStudy': masterDetails.education.fieldOfStudy,
                        'education.$[ele].currentlyStudying': masterDetails.education.currentlyStudying,
                        'education.$[ele].startDate': masterDetails.education.startDate,
                        'education.$[ele].endDate': masterDetails.education.endDate,
                        'education.$[ele].grade': masterDetails.education.grade,
                        'education.$[ele].extraCurricular': masterDetails.education.extraCurricular,
                      }},
                    {
                        arrayFilters: [{ 'ele._id': masterDetails.education._id },],//find array index filter concept
                        new: true
                    }
                );
                response(req, res, activity, 'Level-2', 'Update-MasterEducation', true, 200, masterData, 'Successfully Add Education');
            }
            else {
                response(req, res, activity, 'Level-2', 'Update-MasterEducation', true, 200, {}, 'Master NOt Found');
            }
        }
        catch (err: any) {
            response(req, res, activity, 'Level-3', 'Update-MasterEducation', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Update-MasterEducation', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}

/**
 @author Mohanraj V
 * @date 29-11-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next   
 * @description This Function is used to update Master Experience.
 */

export let updateMasterExperience = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const masterDetails: MasterDocument = req.body;
            const masterConnect = await Master.findOne({ _id: req.body._id })
            if (masterConnect) {

                const masterData = await Master.findByIdAndUpdate(
                    { _id: masterDetails._id },
                    {
                        $set: { 
                            'experience.$[ele].title': masterDetails.experience.title,
                            'experience.$[ele].workMode': masterDetails.experience.workMode,
                            'experience.$[ele].companyName': masterDetails.experience.companyName,
                            'experience.$[ele].location': masterDetails.experience.location,
                            'experience.$[ele].currentlyWorking': masterDetails.experience.currentlyWorking,
                            'experience.$[ele].startDate': masterDetails.experience.startDate,
                            'experience.$[ele].endDate': masterDetails.experience.endDate,
                            'experience.$[ele].skills': masterDetails.experience.skills,
                        } //update inside array index value
                    },
                    {
                        arrayFilters: [{ 'ele._id': masterDetails.experience._id },],//find array index filter concep
                        new: true
                    }
                );
                response(req, res, activity, 'Level-2', 'Update-MasterExperience', true, 200, masterData, 'Successfully Add Experience');
            }
            else {
                response(req, res, activity, 'Level-2', 'Update-MasterExperience', true, 200, {}, 'Master NOt Found');
            }
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Update-MasterExperience', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Update-MasterExperience', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}

/**
 @author Mohanraj V
 * @date 01-01-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next   
 * @description This Function is used to update password using Master Id.
 */

export let updateMasterPassword = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const masterConnect = await Master.findOne({ _id: req.body._id })
            if (masterConnect) {
                const newHash = await decrypt(masterConnect["password"]);
                if (newHash !== req.body.currentPassword) {
                    response(req, res, activity, 'Level-2', 'Update-MasterPassword', true, 200, {}, 'YOUR CURRENT PASSWORD IS INCORRECT');
                }
                else if (req.body.confirmPassword !== req.body.newPassword) {
                    response(req, res, activity, 'Level-2', 'Update-MasterPassword', true, 200, {}, 'YOUR CONFIRM PASSWORD IS INCORRECT');
                }
                else {
                    const hashPassword = await encrypt(req.body.newPassword)// hash a update password                   
                    const MasterData = await Master.findByIdAndUpdate(
                        { _id: req.body._id },  // find Master id
                        {
                            $set: { password: hashPassword } //update inside array index value
                        },
                        {
                            new: true
                        }
                    );
                    response(req, res, activity, 'Level-2', 'Update-MasterPassword', true, 200, MasterData, clientError.success.passwordUpdateSuccess);
                }
            } else {
                response(req, res, activity, 'Level-2', 'Update-MasterPassword', true, 200, {}, 'Master NOt Found');
            }
        }
        catch (err: any) {
            response(req, res, activity, 'Level-3', 'Update-MasterPassword', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Update-MasterPassword', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}



/**
@author Ponjothi S
* @date 06-12-2023
* @param {Object} req 
* @param {Object} res 
* @param {Function} next   
* @description This Function is used to get Masters and posts for Search.
*/
export let getMastersAndPostsForSearch = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            let search = req.query.search
            const masterList = await Master.find({ $and: [{ $or: [{ name: { $regex: search, $options: 'i' } }, { position: { $regex: search, $options: 'i' } }] }, { isDeleted: false }] }).populate('category',{category:1})
            const postList = await Post.find({ $and: [{ $or: [{ description: { $regex: search, $options: 'i' } }, { hashtag: { $regex: search, $options: 'i' } }] }, { isDeleted: false }, { 'block.user': { $nin: req.body.loginId } }] }).populate('user', { name: 1, image: 1 })
            response(req, res, activity, 'Level-1', 'Get-MastersAndPostsForSeach', true, 200, { masterList, postList }, clientError.success.fetchedSuccessfully);
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Get-MastersAndPostsForSeach', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Get-MastersAndPostsForSeach', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};

/**
 @author Mohanraj V
 * @date 13-12-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next   
 * @description This Function is used to delete master Experience.
 */


export let deleteMasterExperience = async (req, res, next) => {
    try {
        const masterConnect = await Master.findOne({ _id: req.body._id })
        if (masterConnect) {
            const masterData = await Master.updateOne(
                { _id: req.body._id },
                { $pull: { experience: { _id: req.body.experienceId } } }
            );
            response(req, res, activity, 'Level-2', 'Update-MasterExperience', true, 200, masterData, 'Successfully Remove Experience');
        }
        else {
            response(req, res, activity, 'Level-2', 'Update-MasterExperience', true, 200, {}, 'Master NOt Found');
        }
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Update-MasterExperience', false, 500, {}, errorMessage.internalServer, err.message);
    }
};

/**
 @author Mohanraj V
 * @date 13-12-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next   
 * @description This Function is used to delete master Education.
 */


export let deleteMasterEducation = async (req, res, next) => {
    try {
        const masterConnect = await Master.findOne({ _id: req.body._id })
        if (masterConnect) {
            const masterData = await Master.updateOne(
                { _id: req.body._id },
                { $pull: { education: { _id: req.body.educationId } } }
            );
            response(req, res, activity, 'Level-2', 'Update-MasterEducation', true, 200, masterData, 'Successfully Remove Education');
        }
        else {
            response(req, res, activity, 'Level-2', 'Update-MasterEducation', true, 200, {}, 'Master NOt Found');
        }
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Update-MasterEducation', false, 500, {}, errorMessage.internalServer, err.message);
    }
};

