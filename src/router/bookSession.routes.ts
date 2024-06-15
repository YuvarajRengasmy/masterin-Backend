import { Router } from 'express';
import { checkQuery, checkRequestBodyParams } from '../middleware/Validators';
import { basicAuthUser } from '../middleware/checkAuth';
import { checkSession } from '../utils/tokenManager';
import { deleteBookSession, getAllBookSession, getAllUpcomingSessions, getFilterBookSession, getSingleBookSession, saveBookSession, updateBookSession } from '../controller/bookSession.controller';
const router: Router = Router();

router.get('/',
    basicAuthUser,
    checkSession,
    getAllBookSession
);

router.post('/',
    basicAuthUser,
    checkSession,
    saveBookSession
);

router.put('/',
    basicAuthUser,
    checkSession,
    checkRequestBodyParams('_id'),
    updateBookSession)

router.delete('/',
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    deleteBookSession)

router.get('/getSingleBookSession',
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    getSingleBookSession)

router.put('/getFilterBookSession',
    basicAuthUser,
    checkSession,
    getFilterBookSession)

router.get('/getAllUpcomingSessions',
    basicAuthUser,
    checkSession,
    getAllUpcomingSessions)



export default router;