import { validationResult } from "express-validator";
import { clientError, errorMessage } from "../helper/ErrorMessage";
import { response, } from "../helper/commonResponseHandler";
import * as TokenManager from "../utils/tokenManager";
import { decrypt, encrypt } from "../helper/Encryption";
import { User, UserDocument } from "../model/user.model";
import { Master } from "../model/master.model";
import { Company } from "../model/company.model";
import { Post } from "../model/post.model";
import { Notification } from "../model/notification.model";

var activity = "User";

/**
 * @author Mohanraj V
 * @date 11-12-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to get all Users.
 */
export let getAllUsers = async (req, res, next) => {
    try {
        const data = await User.find({ isDeleted: false });
        response(req, res, activity, 'Level-1', 'GetAll-User', true, 200, data, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'GetAll-User', false, 500, {}, errorMessage.internalServer, err.message);
    }
};

/**
 * @author Mohanraj V
 * @date 11-12-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to save user.
 */
export let saveUsers = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const company = await Company.findOne({ $and: [{ isDeleted: false }, { email: req.body.email }] });
            const master = await Master.findOne({ $and: [{ isDeleted: false }, { email: req.body.email }] });
            const user = await User.findOne({ $and: [{ isDeleted: false }, { email: req.body.email }] });
            if (!company && !user && !master) {
                req.body.password = await encrypt(req.body.password)
                const userDetails: UserDocument = req.body;
                userDetails.createdOn = new Date();
                let date = new Date();
                userDetails.date = date?.getDate();
                userDetails.month = date?.getMonth() + 1;
                userDetails.year = date?.getFullYear()
                userDetails.coins = 1000
                userDetails.referralLink = "https://masterin.in/UserProfile/" + userDetails.name;
                const createData = new User(userDetails);
                let insertData = await createData.save();
                const token = await TokenManager.CreateJWTToken({
                    id: insertData["_id"],
                    name: insertData["name"],
                    loginType: 'user'
                });
                const result = {}
                result['_id'] = insertData._id
                result['email'] = insertData.email;
                let finalResult = {};
                finalResult["loginType"] = 'user';
                finalResult["userDetails"] = result;
                finalResult["token"] = token;
                response(req, res, activity, 'Level-2', 'Save-User', true, 200, finalResult, clientError.success.registerSuccessfully);
            }
            else {
                response(req, res, activity, 'Level-3', 'Save-User', true, 422, {}, 'Email already registered');
            }

        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Save-User', false, 500, {}, errorMessage.internalServer, err.message);
        }
    }
    else {
        response(req, res, activity, 'Level-3', 'Save-User', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}

/**
 * @author Mohanraj V
 * @date 11-12-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to update user Details
 */
export let updateUsers = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {

            const userDetails: UserDocument = req.body;
            const user = await User.findOne({ $and: [{ isDeleted: false }, { _id: { $ne: userDetails._id } }, { email: userDetails.email }] });
            const company = await Company.findOne({ $and: [{ isDeleted: false }, { email: req.body.email }] });
            const master = await Master.findOne({ $and: [{ isDeleted: false }, { email: req.body.email }] });
            if (!user && !company && !master) {
                const updateUser = new User(userDetails);
                updateUser.modifiedOn = new Date();
                const insertUser = await updateUser.updateOne({
                    $set: {
                        email: userDetails.email,
                        name: userDetails.name,
                        position: userDetails.position,
                        location: userDetails.location,
                        recoveryEmail: userDetails.recoveryEmail,
                        link: userDetails.link,
                        image: userDetails.image,
                        description: userDetails.description,
                        backgroundImage: userDetails.backgroundImage,
                        mobile: userDetails.mobile,
                        primarySkill: userDetails.primarySkill,
                        secondarySkill: userDetails.secondarySkill,
                        modifiedOn: userDetails.modifiedOn,
                        modifiedBy: userDetails.modifiedBy
                    },
                    $addToSet: {
                        experience: userDetails.experience,
                        education: userDetails.education,
                    }
                });
                const userData = await User.findOne({ _id: userDetails._id });
                response(req, res, activity, 'Level-3', 'Update-User', true, 200, userData, clientError.success.updateSuccess);

            } else {
                response(req, res, activity, 'Level-3', 'Update-User', false, 422, {}, errorMessage.fieldValidation, "Email Already Exists");
            }
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Update-User', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Update-User', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}
/**
 * @author Mohanraj V
 * @date 11-12-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to delete user
 */
export let deleteUsers = async (req, res, next) => {
    try {
        let id = req.query._id;
        const user = await User.findByIdAndDelete({ _id: id })
        const notification = await Notification.deleteMany({ $or: [{ to: id }, { from: id }] })
        response(req, res, activity, 'Level-2', 'Delete-User', true, 200, user, 'Successfully Remove User');
    }
    catch (err: any) {
        response(req, res, activity, 'Level-3', 'Delete-User', false, 500, {}, errorMessage.internalServer, err.message);
    }
};

/**
 * @author Mohanraj V
 * @date 11-12-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to get Single User.
 */
export let getSingleUser = async (req, res, next) => {
    try {
        const user = await User.findOne({ _id: req.query._id });
        response(req, res, activity, 'Level-1', 'Get-Single-User', true, 200, user, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-Single-User', false, 500, {}, errorMessage.internalServer, err.message);
    }
}


/**
 * @author Mohanraj V
 * @date 11-12-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to get filter User Details
 */

export let getFilterUser = async (req, res, next) => {
    try {
        var findQuery;
        var andList: any = []
        var limit = req.body.limit ? req.body.limit : 0;
        var page = req.body.page ? req.body.page : 0;
        andList.push({ isDeleted: false })
        andList.push({ _id: { $ne: req.body.loginId } })
        findQuery = (andList.length > 0) ? { $and: andList } : {}
        const userList = await User.find(findQuery).sort({ createdOn: -1 }).limit(limit).skip(page)
        const userCount = await User.find(findQuery).count()
        response(req, res, activity, 'Level-1', 'Get-FilterUser', true, 200, { userList, userCount }, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-FilterUser', false, 500, {}, errorMessage.internalServer, err.message);
    }
};


//----------------------------------------------------------------------------------------------------------------


/**
 @author Mohanraj V
 * @date 13-12-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next   
 * @description This Function is used to update User Education.
 */


export let updateUserEducation = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const userDetails: UserDocument = req.body;
            const userConnect = await User.findOne({ _id: req.body._id })
            if (userConnect) {
                const userData = await User.findByIdAndUpdate(
                    { _id: userDetails._id }, // find User id 
                    {
                        $set: {
                            'education.$[ele].institute': userDetails.education.institute,
                            'education.$[ele].qualification': userDetails.education.qualification,
                            'education.$[ele].fieldOfStudy': userDetails.education.fieldOfStudy,
                            'education.$[ele].currentlyStudying': userDetails.education.currentlyStudying,
                            'education.$[ele].startDate': userDetails.education.startDate,
                            'education.$[ele].endDate': userDetails.education.endDate,
                            'education.$[ele].grade': userDetails.education.grade,
                            'education.$[ele].extraCurricular': userDetails.education.extraCurricular,
                        }
                    },
                    {
                        arrayFilters: [{ 'ele._id': userDetails.education._id }],//find array index filter concept
                        new: true
                    }
                );
                response(req, res, activity, 'Level-2', 'Update-UserEducation', true, 200, userData, 'Successfully Update Education');
            }
            else {
                response(req, res, activity, 'Level-2', 'Update-UserEducation', true, 200, {}, 'user NOt Found');
            }
        }
        catch (err: any) {
            response(req, res, activity, 'Level-3', 'Update-UserEducation', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Update-UserEducation', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}

/**
 @author Mohanraj V
 * @date 13-12-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next    
 * @description This Function is used to update user Experience.
 */

export let updateUserExperience = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const userDetails: UserDocument = req.body;
            const userConnect = await User.findOne({ _id: req.body._id })
            if (userConnect) {
                const userData = await User.findByIdAndUpdate(
                    { _id: userDetails._id },
                    {
                        $set: {
                            'experience.$[ele].title': userDetails.experience.title,
                            'experience.$[ele].workMode': userDetails.experience.workMode,
                            'experience.$[ele].companyName': userDetails.experience.companyName,
                            'experience.$[ele].location': userDetails.experience.location,
                            'experience.$[ele].currentlyWorking': userDetails.experience.currentlyWorking,
                            'experience.$[ele].startDate': userDetails.experience.startDate,
                            'experience.$[ele].endDate': userDetails.experience.endDate,
                            'experience.$[ele].skills': userDetails.experience.skills,
                        } //update inside array index value
                    },
                    {
                        arrayFilters: [{ 'ele._id': userDetails.experience._id },],//find array index filter concep
                        new: true
                    }
                );
                response(req, res, activity, 'Level-2', 'Update-UserExperience', true, 200, userData, 'Successfully Update Experience');
            }
            else {
                response(req, res, activity, 'Level-2', 'Update-UserExperience', true, 200, {}, 'user NOt Found');
            }
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Update-UserExperience', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Update-UserExperience', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}

/**
 @author Mohanraj V
 * @date 13-12-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next   
 * @description This Function is used to update password using user Id.
 */

export let updateUserPassword = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const userConnect = await User.findOne({ _id: req.body._id })
            if (userConnect) {
                const newHash = await decrypt(userConnect["password"]);
                if (newHash !== req.body.currentPassword) {
                    response(req, res, activity, 'Level-2', 'Update-UserPassword', true, 200, {}, 'YOUR CURRENT PASSWORD IS INCORRECT');
                }
                else if (req.body.confirmPassword !== req.body.newPassword) {
                    response(req, res, activity, 'Level-2', 'Update-UserPassword', true, 200, {}, 'YOUR CONFIRM PASSWORD IS INCORRECT');
                }
                else {
                    const hashPassword = await encrypt(req.body.newPassword)// hash a update password                   
                    const userData = await User.findByIdAndUpdate(
                        { _id: req.body._id },  // find user id
                        {
                            $set: { password: hashPassword } //update inside array index value
                        },
                        {
                            new: true
                        }
                    );
                    response(req, res, activity, 'Level-2', 'Update-UserPassword', true, 200, userData, clientError.success.passwordUpdateSuccess);
                }
            } else {
                response(req, res, activity, 'Level-2', 'Update-UserPassword', true, 200, {}, 'user NOt Found');
            }
        }
        catch (err: any) {
            response(req, res, activity, 'Level-3', 'Update-UserPassword', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Update-UserPassword', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
}

/**
 @author Mohanraj V
 * @date 13-12-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next   
 * @description This Function is used to delete user Experience.
 */


export let deleteUserExperience = async (req, res, next) => {
    try {
        const userConnect = await User.findOne({ _id: req.body._id })
        if (userConnect) {
            const userData = await User.updateOne(
                { _id: req.body._id },
                { $pull: { experience: { _id: req.body.experienceId } } }
            );
            response(req, res, activity, 'Level-2', 'Update-UserExperience', true, 200, userData, 'Successfully Remove Experience');
        }
        else {
            response(req, res, activity, 'Level-2', 'Update-UserExperience', true, 200, {}, 'user NOt Found');
        }
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Update-UserExperience', false, 500, {}, errorMessage.internalServer, err.message);
    }
};

/**
 @author Mohanraj V
 * @date 13-12-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next   
 * @description This Function is used to delete user Education.
 */

export let deleteUserEducation = async (req, res, next) => {
    try {
        const userConnect = await User.findOne({ _id: req.body._id })
        if (userConnect) {
            const userData = await User.updateOne(
                { _id: req.body._id },
                { $pull: { education: { _id: req.body.educationId } } }
            );
            response(req, res, activity, 'Level-2', 'Update-UserEducation', true, 200, userData, 'Successfully Remove Education');
        }
        else {
            response(req, res, activity, 'Level-2', 'Update-UserEducation', true, 200, {}, 'user NOt Found');
        }
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Update-UserEducation', false, 500, {}, errorMessage.internalServer, err.message);
    }
};

/**
 @author Ponjothi S
 * @date 13-12-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next   
 * @description This Function is used to update connected Masters.
 */
export let updateConnectedUsers = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const userDetails: UserDocument = req.body;
            const userConnect = await User.findOne({ $and: [{ 'connectedUsers.user': userDetails.connectedUsers.user }, { _id: userDetails._id }] })
            if (userConnect) {
                const removeUsers = await User.findByIdAndUpdate({ _id: userDetails._id },
                    {
                        $pull: { connectedUsers: userDetails.connectedUsers },
                        $inc: { connectedCount: -1 }
                    }
                )
                response(req, res, activity, 'Level-2', 'Update-connectedUsers', true, 200, removeUsers, userDetails.connectedUsers.isConnect ? 'Successfully Remove Connection' : 'Successfully Remove Request');
            } else {
                const updateConnected = await User.findByIdAndUpdate({ _id: userDetails._id },
                    {
                        $push: { connectedUsers: userDetails.connectedUsers },
                        $inc: { connectedCount: 1 }
                    },
                )
                // const data = await User.findOne({ _id: userDetails.connectedUsers.user })
                // sendConnectionNotification(updateConnected?.email, data?.name, data?.image, data?.referralLink)
                response(req, res, activity, 'Level-2', 'Update-connectedUsers', true, 200, updateConnected, userDetails.connectedUsers.isConnect ? 'Successfully Connecting' : 'Successfully send Request');
            }

        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Update-connectedUsers', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Update-connectedUsers', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};

/**
@author Ponjothi S
* @date 14-12-2023
* @param {Object} req 
* @param {Object} res 
* @param {Function} next   
* @description This Function is used to get Users and Posts for Search.
*/
export let getUsersAndPostsForSearch = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            let search = req.query.search
            const masterList = await Master.find({ $and: [{ $or: [{ name: { $regex: search, $options: 'i' } }, { position: { $regex: search, $options: 'i' } }] }, { isDeleted: false }] })
            const userList = await User.find({ $and: [{ $or: [{ name: { $regex: search, $options: 'i' } }, { position: { $regex: search, $options: 'i' } }] }, { isDeleted: false }] })
            const companyList = await Company.find({ $and: [{ name: { $regex: search, $options: 'i' } }, { isDeleted: false }] })
            const postList = await Post.find({ $and: [{ $or: [{ description: { $regex: search, $options: 'i' } }, { hashtag: { $regex: search, $options: 'i' } }] }, { isDeleted: false }, { 'block.user': { $nin: req.body.loginId } }] }).populate('user', { name: 1, image: 1 })
            response(req, res, activity, 'Level-1', 'Get-MastersAndPostsForSeach', true, 200, { masterList, postList, userList, companyList }, clientError.success.fetchedSuccessfully);
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Get-MastersAndPostsForSeach', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Get-MastersAndPostsForSeach', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};