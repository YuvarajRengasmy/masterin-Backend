import { Router } from 'express';
import { checkQuery, checkRequestBodyParams } from '../middleware/Validators';
import { basicAuthUser } from '../middleware/checkAuth';
import { checkSession } from '../utils/tokenManager';
import {
    getAllUsers, getSingleUser, saveUsers, deleteUsers, getFilterUser, updateUsers,
    updateUserEducation, updateUserExperience, updateUserPassword, deleteUserEducation, deleteUserExperience, updateConnectedUsers, getUsersAndPostsForSearch
} from '../controller/user.controllet';
const router = Router();


router.get('/', //get all users
    basicAuthUser,
    checkSession,
    getAllUsers
);

router.post('/', //save user
    basicAuthUser,
    checkRequestBodyParams('mobile'),
    checkRequestBodyParams('email'),
    saveUsers
);

router.put('/', //update user
    basicAuthUser,
    checkSession,
    checkRequestBodyParams('_id'),
    updateUsers
);

router.delete('/', //delete user
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    deleteUsers
);

router.get('/getSingleUser',
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    getSingleUser,
);

router.put('/getFilterUser',
    basicAuthUser,
    checkSession,
    getFilterUser,
);

router.put('/updateUserEducation', // update User education 
    basicAuthUser,
    checkSession,
    checkRequestBodyParams('_id'),
    updateUserEducation);

router.put('/updateUserExperience', // update User experience
    basicAuthUser,
    checkSession,
    checkRequestBodyParams('_id'),
    updateUserExperience);

router.put('/updateUserPassword', // update Master password
    basicAuthUser,
    checkSession,
    checkRequestBodyParams('_id'),
    checkRequestBodyParams('currentPassword'),
    checkRequestBodyParams('newPassword'),
    checkRequestBodyParams('confirmPassword'),
    updateUserPassword);


router.put('/deleteUserEducation', // delete User education
    basicAuthUser,
    checkSession,
    checkRequestBodyParams('_id'),
    checkRequestBodyParams('educationId'),
    deleteUserEducation);

router.put('/deleteUserExperience', // delete User experience
    basicAuthUser,
    checkSession,
    checkRequestBodyParams('_id'),
    checkRequestBodyParams('experienceId'),
    deleteUserExperience);


router.put('/updateConnectedUser',
    basicAuthUser,
    checkSession,
    updateConnectedUsers)

    router.get('/getUsersAndPostsForSearch',
    basicAuthUser,
    checkSession,
    getUsersAndPostsForSearch);


export default router;

