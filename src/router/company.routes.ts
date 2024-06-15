import { Router } from 'express';
import { checkQuery, checkRequestBodyParams } from '../middleware/Validators';
import { basicAuthUser } from '../middleware/checkAuth';
import { checkSession } from '../utils/tokenManager';
import { deleteCompany, getAllCompany, getFilterCompany, getSingleCompany, saveCompany, updateCompany } from '../controller/company.controller';
const router: Router = Router();

router.get('/',
    basicAuthUser,
    checkSession,
    getAllCompany
);

router.post('/',
    basicAuthUser,
    saveCompany
);

router.put('/',
    basicAuthUser,
    checkSession,
    checkRequestBodyParams('_id'),
    updateCompany)

router.delete('/',
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    deleteCompany)

router.get('/getSingleCompany',
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    getSingleCompany)

router.put('/getFilterCompany',
    basicAuthUser,
    checkSession,
    getFilterCompany)




export default router;