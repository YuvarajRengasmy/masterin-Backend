import { validationResult } from "express-validator";
import { clientError, errorMessage } from "../helper/ErrorMessage";
import { response } from "../helper/commonResponseHandler";
import * as TokenManager from "../utils/tokenManager";
import { decrypt, encrypt } from "../helper/Encryption";
import { Company, CompanyDocument } from "../model/company.model";
import { Master } from "../model/master.model";
import { User } from "../model/user.model";


var activity = "Company"

/**
 * @author Ponjothi S
 * @date 11-12-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to get all Company.
 */
export let getAllCompany = async (req, res, next) => {
    try {
        const data = await Company.find({ isDeleted: false });
        response(req, res, activity, 'Level-1', 'GetAll-Company', true, 200, data, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'GetAll-Company', false, 500, {}, errorMessage.internalServer, err.message);
    }
};

/**
 * @author Ponjothi S
 * @date 11-12-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to create Company .
 */
export let saveCompany = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const company = await Company.findOne({ $and: [{ isDeleted: false }, { email: req.body.email }] });
            const master = await Master.findOne({ $and: [{ isDeleted: false }, { email: req.body.email }] });
            const user = await User.findOne({ $and: [{ isDeleted: false }, { email: req.body.email }] });
            if (!company && !master && !user) {
                req.body.password = await encrypt(req.body.password)
                const companyDetails: CompanyDocument = req.body;
                companyDetails.createdOn = new Date();
                let date = new Date();
                companyDetails.date = date?.getDate();
                companyDetails.month = date?.getMonth() + 1;
                companyDetails.year = date?.getFullYear()
                const createData = new Company(companyDetails);
                let insertData = await createData.save();
                const token = await TokenManager.CreateJWTToken({
                    id: insertData["_id"],
                    name: insertData["name"],
                    loginType: 'company'

                });
                const result = {}
                result['_id'] = insertData._id
                result['email'] = insertData.email;
                let finalResult = {};
                finalResult["loginType"] = 'company';
                finalResult["companyDetails"] = result;
                finalResult["token"] = token;
                response(req, res, activity, 'Level-2', 'Save-Company', true, 200, finalResult, clientError.success.registerSuccessfully);
            }
            else {
                response(req, res, activity, 'Level-3', 'Save-Company', true, 422, {}, 'Email already registered');
            }

        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Save-Company', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Save-Company', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};


/**
 * @author Ponjothi S
 * @date 11-12-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to update Company.
 */
export let updateCompany = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const companyDetails: CompanyDocument = req.body;
            const company = await Company.findOne({ $and: [{ _id: { $ne: companyDetails._id }, }, { email: companyDetails.email }, { isDeleted: false }] });
            const master = await Master.findOne({ $and: [{ isDeleted: false }, { email: req.body.email }] });
            const user = await User.findOne({ $and: [{ isDeleted: false }, { email: req.body.email }] });
            if (!company && !master && !user) {
                const updateCompany = new Company(companyDetails)
                let insertCompany = await updateCompany.updateOne({
                    $set: {
                        email: companyDetails.email,
                        image: companyDetails.image,
                        mobile: companyDetails.mobile,
                        name: companyDetails.name,
                        category: companyDetails.category,
                        modifiedOn: companyDetails.modifiedOn,
                        modifiedBy: companyDetails.modifiedBy
                    }
                })
                response(req, res, activity, 'Level-2', 'Update-Company', true, 200, insertCompany, clientError.success.updateSuccess)
            }
            else {
                response(req, res, activity, 'Level-3', 'Update-Company', true, 422, {}, 'Email already registered');
            }
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Update-Company', false, 500, {}, errorMessage.internalServer, err.message)
        }
    } else {
        response(req, res, activity, 'Level-3', 'Update-Company', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};

/**
 * @author Ponjothi S
 * @date 11-12-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to delete Company.
 */
export let deleteCompany = async (req, res, next) => {
    try {
        let { modifiedOn, modifiedBy } = req.body;
        let id = req.query._id;
        const data = await Company.findByIdAndUpdate({ _id: id }, {
            $set: {
                isDeleted: true,
                modifiedOn: modifiedOn,
                modifiedBy: modifiedBy,
            }
        })
        response(req, res, activity, 'Level-2', 'Delete-Company', true, 200, data, clientError.success.deleteSuccess)
    }
    catch (err: any) {
        response(req, res, activity, 'Level-3', 'Delete-Company', true, 500, {}, errorMessage.internalServer, err.message)
    }
};



/**
 * @author Ponjothi S
 * @date 11-12-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to get single Company.
 */
export let getSingleCompany = async (req, res, next) => {
    try {
        const data = await Company.findById({ _id: req.query._id })
        response(req, res, activity, 'Level-1', 'Get-SingleCompany', true, 200, data, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-SingleCompany', false, 500, {}, errorMessage.internalServer, err.message);
    }
}


/**
@author Ponjothi S
 * @date 11-12-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next 
 * @description This Function is used to get filter Company.
 */
export let getFilterCompany = async (req, res, next) => {
    try {
        var findQuery;
        var andList: any = []
        var limit = req.body.limit ? req.body.limit : 0;
        var page = req.body.page ? req.body.page : 0;
        andList.push({ isDeleted: false })
        andList.push({ _id: { $ne: req.body.loginId } })
        findQuery = (andList.length > 0) ? { $and: andList } : {}
        const companyList = await Company.find(findQuery).sort({ createdOn: -1 }).limit(limit).skip(page)
        const companyCount = await Company.find(findQuery).count()
        response(req, res, activity, 'Level-1', 'Get-FilterCompany', true, 200, { companyList, companyCount }, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-FilterCompany', false, 500, {}, errorMessage.internalServer, err.message);
    }
};
