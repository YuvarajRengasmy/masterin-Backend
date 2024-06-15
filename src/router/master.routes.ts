import { Router } from 'express';
import { checkQuery, checkRequestBodyParams } from '../middleware/Validators';
import { basicAuthUser } from '../middleware/checkAuth';
import { checkSession } from '../utils/tokenManager';
import { deleteMaster, getAllMasters, getFilterMaster, getSingleMaster, getMastersAndPostsForSearch, saveMasters, updateConnectedUsers,
     updateMaster, updateMasterEducation, updateMasterExperience, updateMasterPassword,deleteMasterEducation,deleteMasterExperience } from '../controller/master.controller';
const router: Router = Router();

router.get('/',
    basicAuthUser,
    checkSession,
    getAllMasters
);

router.post('/',
    basicAuthUser,
    checkRequestBodyParams('email'),
    checkRequestBodyParams('password'),
    saveMasters
);

router.put('/',
    basicAuthUser,
    checkSession,
    checkRequestBodyParams('_id'),
    updateMaster)

router.delete('/',
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    deleteMaster)

router.get('/getSingleMaster',
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    getSingleMaster)


router.put('/getFilterMaster',
    basicAuthUser,
    checkSession,
    getFilterMaster)

router.put('/updateConnectedUser',
    basicAuthUser,
    checkSession,
    updateConnectedUsers)

router.put('/updateMasterEducation', // update Master education 
    basicAuthUser,
    checkSession,
    checkRequestBodyParams('_id'),
    updateMasterEducation);

router.put('/updateMasterExperience', // update Master experience
    basicAuthUser,
    checkSession,
    checkRequestBodyParams('_id'),
    updateMasterExperience);

router.put('/updateMasterPassword', // update Master password
    basicAuthUser,
    checkSession,
    checkRequestBodyParams('_id'),
    checkRequestBodyParams('currentPassword'),
    checkRequestBodyParams('newPassword'),
    checkRequestBodyParams('confirmPassword'),
    updateMasterPassword);

router.get('/getMastersAndPostsForSearch',
    basicAuthUser,
    checkSession,
    getMastersAndPostsForSearch);

router.put('/deleteMasterEducation',
    basicAuthUser,
    checkSession,
    checkRequestBodyParams('_id'),
    checkRequestBodyParams('educationId'),
    deleteMasterEducation);

router.put('/deleteMasterExperience',
    basicAuthUser,
    checkSession,
    checkRequestBodyParams('_id'),
    checkRequestBodyParams('experienceId'),
    deleteMasterExperience);

export default router;