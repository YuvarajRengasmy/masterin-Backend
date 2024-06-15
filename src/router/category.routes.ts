import { Router } from 'express';
import { checkQuery, checkRequestBodyParams } from '../middleware/Validators';
import { basicAuthUser } from '../middleware/checkAuth';
import { checkSession } from '../utils/tokenManager';
import { deleteCategory, getAllCategory, getFilterCategory, getSingleCategory, saveCategory, updateCategory } from '../controller/category.controller';
const router: Router = Router();

router.get('/',
    basicAuthUser,
    getAllCategory
);

router.post('/',
    basicAuthUser,
    checkSession,
    saveCategory
);

router.put('/',
    basicAuthUser,
    checkSession,
    checkRequestBodyParams('_id'),
    updateCategory)

router.delete('/',
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    deleteCategory)

router.get('/getSingleCategory',
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    getSingleCategory)

router.put('/getFilterCategory',
    basicAuthUser,
    checkSession,
    getFilterCategory)




export default router;