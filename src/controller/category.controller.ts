import { validationResult } from "express-validator";
import { clientError, errorMessage } from "../helper/ErrorMessage";
import { response } from "../helper/commonResponseHandler";
import { Category, CategoryDocument } from "../model/category.model";


var activity = "Category"

/**
 * @author Ponjothi S
 * @date 22-11-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to get all Category.
 */
export let getAllCategory = async (req, res, next) => {
    try {
        const data = await Category.find({ isDeleted: false });
        response(req, res, activity, 'Level-1', 'GetAll-Category', true, 200, data, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'GetAll-Category', false, 500, {}, errorMessage.internalServer, err.message);
    }
};

/**
 * @author Ponjothi S
 * @date 22-11-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to save Category.
 */
export let saveCategory = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const categoryDetails: CategoryDocument = req.body;
            const createData = new Category(categoryDetails);
            let insertData = await createData.save();
            response(req, res, activity, 'Level-2', 'Save-Category', true, 200, insertData, clientError.success.savedSuccessfully);

        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Save-Category', false, 500, {}, errorMessage.internalServer, err.message);
        }
    } else {
        response(req, res, activity, 'Level-3', 'Save-Category', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};


/**
 * @author Ponjothi S
 * @date 22-11-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to update Category.
 */
export let updateCategory = async (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        try {
            const categoryDetails: CategoryDocument = req.body;
            let updateData = await Category.findByIdAndUpdate({ _id: categoryDetails._id }, {
                $set: {
                    category:categoryDetails.category,
                    modifiedOn: categoryDetails.modifiedOn,
                    modifiedBy: categoryDetails.modifiedBy
                }
            });
            response(req, res, activity, 'Level-2', 'Update-Category', true, 200, updateData, clientError.success.updateSuccess)
        } catch (err: any) {
            response(req, res, activity, 'Level-3', 'Update-Category', false, 500, {}, errorMessage.internalServer, err.message)
        }
    } else {
        response(req, res, activity, 'Level-3', 'Update-Category', false, 422, {}, errorMessage.fieldValidation, JSON.stringify(errors.mapped()));
    }
};

/**
 * @author Ponjothi S
 * @date 22-11-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to delete Category.
 */
export let deleteCategory = async (req, res, next) => {
    try {
        let { modifiedOn, modifiedBy } = req.body;
        let id = req.query._id;
        const data = await Category.findByIdAndUpdate({ _id: id }, {
            $set: {
                isDeleted: true,
                modifiedOn: modifiedOn,
                modifiedBy: modifiedBy,
            }
        })
        response(req, res, activity, 'Level-2', 'Delete-Category', true, 200, data, clientError.success.deleteSuccess)
    }
    catch (err: any) {
        response(req, res, activity, 'Level-3', 'Delete-Category', true, 500, {}, errorMessage.internalServer, err.message)
    }
};



/**
 * @author Ponjothi S
 * @date 22-11-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to get single Category.
 */
export let getSingleCategory = async (req, res, next) => {
    try {
        const data = await Category.findById({ _id: req.query._id })
        response(req, res, activity, 'Level-1', 'Get-SingleCategory', true, 200, data, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-SingleCategory', false, 500, {}, errorMessage.internalServer, err.message);
    }
}



/**
@author Ponjothi S
 * @date 22-11-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next 
 * @description This Function is used to get filter Category.
 */
export let getFilterCategory = async (req, res, next) => {
    try {

        var findQuery;
        var andList: any = []
        var limit = req.body.limit ? req.body.limit : 0;
        var page = req.body.page ? req.body.page : 0;
        andList.push({ isDeleted: false })
        findQuery = (andList.length > 0) ? { $and: andList } : {}
        const categoryList = await Category.find(findQuery).sort({ createdOn: -1 }).limit(limit).skip(page)
        const categoryCount = await Category.find(findQuery).count()
        response(req, res, activity, 'Level-1', 'Get-FilterCategory', true, 200, { categoryList, categoryCount }, clientError.success.fetchedSuccessfully);
    } catch (err: any) {
        response(req, res, activity, 'Level-3', 'Get-FilterCategory', false, 500, {}, errorMessage.internalServer, err.message);
    }
};
