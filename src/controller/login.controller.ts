import { validationResult } from "express-validator";
import { decrypt, encrypt } from "../helper/Encryption";
import { clientError, errorMessage } from "../helper/ErrorMessage";
import { response, sendEmail } from "../helper/commonResponseHandler";
import * as TokenManager from "../utils/tokenManager";
import { Master } from "../model/master.model";
import { Company } from "../model/company.model";
import { User } from "../model/user.model";


var activity = "Login"

/**
 * @author Ponjothi S
 * @date 14-11-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used to Login.
 */
export let loginEmail = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            let { email, password } = req.body;
            const master = await Master.findOne({ $and: [{ email: email }, { isDeleted: false }] }, { email: 1, password: 1,name:1, status: 1 })
            const company = await Company.findOne({ $and: [{ email: email }, { isDeleted: false }] }, { email: 1, password: 1,name:1, status: 1 })
            const user = await User.findOne({ $and: [{ email: email }, { isDeleted: false }] }, { email: 1, password: 1,name:1, status: 1 })
            if (master) {
                const newHash = await decrypt(master["password"]);
                if (master["status"] === 2) {
                    response(req, res, activity, 'Level-3', 'Login-Email', false, 499, {}, clientError.account.inActive);
                } else if (newHash != password) {
                    response(req, res, activity, 'Level-3', 'Login-Email', false, 403, {}, "Invalid Password !");
                } else {
                    const token = await TokenManager.CreateJWTToken({
                        id: master["_id"],
                        name: master["name"],
                        loginType: 'master'
                    });
                    const details = {}
                    details['_id'] = master._id
                    details['email'] = master.email;
                    let finalResult = {};
                    finalResult["loginType"] = 'master';
                    finalResult["masterDetails"] = details;
                    finalResult["token"] = token;
                    response(req, res, activity, 'Level-2', 'Login-Email', true, 200, finalResult, clientError.success.loginSuccess);
                }
            }
            else if (company) {
                const newHash = await decrypt(company["password"]);
                if (company["status"] === 2) {
                    response(req, res, activity, 'Level-3', 'Login-Email', false, 499, {}, clientError.account.inActive);
                } else if (newHash != password) {
                    response(req, res, activity, 'Level-3', 'Login-Email', false, 403, {}, "Invalid Password !");
                } else {
                    const token = await TokenManager.CreateJWTToken({
                        id: company["_id"],
                        name: company["name"],
                        loginType: 'company'
                    });
                    const details = {}
                    details['_id'] = company._id
                    details['email'] = company.email;
                    let finalResult = {};
                    finalResult["loginType"] = 'company';
                    finalResult["companyDetails"] = details;
                    finalResult["token"] = token;
                    response(req, res, activity, 'Level-2', 'Login-Email', true, 200, finalResult, clientError.success.loginSuccess);
                }
            }
            else if (user) {
                const newHash = await decrypt(user["password"]);
                if (user["status"] === 2) {
                    response(req, res, activity, 'Level-3', 'Login-Email', false, 499, {}, clientError.account.inActive);
                } else if (newHash != password) {
                    response(req, res, activity, 'Level-3', 'Login-Email', false, 403, {}, "Invalid Password !");
                } else {
                    const token = await TokenManager.CreateJWTToken({
                        id: user["_id"],
                        name: user["name"],
                        loginType: 'user'
                    });
                    const details = {}
                    details['_id'] = user._id
                    details['email'] = user.email;
                    let finalResult = {};
                    finalResult["loginType"] = 'user';
                    finalResult["userDetails"] = details;
                    finalResult["token"] = token;
                    response(req, res, activity, 'Level-2', 'Login-Email', true, 200, finalResult, clientError.success.loginSuccess);
                }
            }
            else {
                response(req, res, activity, 'Level-3', 'Login-Email', true, 422, {}, 'Invalid Email Id');
            }
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Login-Email', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
        }
    }
};


/**
 * @author Ponjothi S
 * @date 14-11-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used for Forget Password.
 */
export let forgotPassword = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            if (req.body.recoveryEmail) {
                let master = await Master.findOne({ recoveryEmail: req.body.recoveryEmail })
                if (master) {
                    var _id = master._id
                    sendEmail(req, req.body.recoveryEmail, 'Reset Password', req.body.link + _id)
                        .then(doc => {
                            response(req, res, activity, 'Level-2', 'Forgot-Password', true, 200, doc, clientError.email.emailSend)
                        })
                        .catch(error => {
                            console.error(error)
                        })
                }
                else {
                    response(req, res, activity, 'Level-3', 'Forgot-Password', true, 422, {}, clientError.user.userDontExist);
                }
            } else if (req.body.email) {
                let master = await Master.findOne({$and:[{ email: req.body.email },{isDeleted:false}]})
                let company = await Company.findOne({$and:[{ email: req.body.email },{isDeleted:false}]})
                let user = await User.findOne({$and:[{ email: req.body.email },{isDeleted:false}]})
                if (master) {
                    const _id = master._id
                    sendEmail(req, req.body.email, 'Reset Password', req.body.link + _id)
                        .then(doc => {
                            response(req, res, activity, 'Level-2', 'Forgot-Password', true, 200, doc, clientError.email.emailSend)
                        })
                        .catch(error => {
                            console.error(error)
                        })
                }
                else if (company) {
                    const _id = company._id
                    sendEmail(req, req.body.email, 'Reset Password', req.body.link + _id)
                        .then(doc => {
                            response(req, res, activity, 'Level-2', 'Forgot-Password', true, 200, doc, clientError.email.emailSend)
                        })
                        .catch(error => {
                            console.error(error)
                        })
                }
                else if (user) {
                    const _id = user._id
                    sendEmail(req, req.body.email, 'Reset Password', req.body.link + _id)
                        .then(doc => {
                            response(req, res, activity, 'Level-2', 'Forgot-Password', true, 200, doc, clientError.email.emailSend)
                        })
                        .catch(error => {
                            console.error(error)
                        })
                }
                else {
                    response(req, res, activity, 'Level-3', 'Forgot-Password', true, 422, {}, clientError.user.userDontExist);
                }
            }
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Forgot-Password', false, 500, {}, errorMessage.internalServer, err.message);
        }
    }
}




/**
 * @author Ponjothi S
 * @date 14-11-2023
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @description This Function is used for Update Password.
 */
export let resetPassword = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            let company = await Company.findById({ _id: req.body._id })
            let master = await Master.findById({ _id: req.body._id })
            let { modifiedOn, modifiedBy } = req.body
            let id = req.body._id
            req.body.password = await encrypt(req.body.password);
            if (master) {
                const data = await Master.findByIdAndUpdate({ _id: id }, {
                    $set: {
                        password: req.body.password,
                        modifiedOn: modifiedOn,
                        modifiedBy: modifiedBy
                    }
                })
                response(req, res, activity, 'Level-2', 'Update-Password', true, 200, data, clientError.success.updateSuccess)
            }
            else if (company) {
                const data = await Company.findByIdAndUpdate({ _id: id }, {
                    $set: {
                        password: req.body.password,
                        modifiedOn: modifiedOn,
                        modifiedBy: modifiedBy
                    }
                })
                response(req, res, activity, 'Level-2', 'Update-Password', true, 200, data, clientError.success.updateSuccess)
            }
            else {
                const data = await Company.findByIdAndUpdate({ _id: id }, {
                    $set: {
                        password: req.body.password,
                        modifiedOn: modifiedOn,
                        modifiedBy: modifiedBy
                    }
                })
                response(req, res, activity, 'Level-2', 'Update-Password', true, 200, data, clientError.success.updateSuccess)
            }

        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Update-Password', true, 500, {}, errorMessage.internalServer, err.message)
        }
    } else {
        response(req, res, activity, 'Level-3', 'Update-Password', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()))
    }
}

