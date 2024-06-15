import { Router } from 'express';
import { checkQuery, checkRequestBodyParams } from '../middleware/Validators';
import { basicAuthUser } from '../middleware/checkAuth';
import { checkSession } from '../utils/tokenManager';
import { deleteEvent, getAllEvents, getAllUpcomingEvents, getFilterEvents, getFilterUpComingEvents, getSingleEvent, saveEvent, updateBookedUsers, updateEvent } from '../controller/event.controller';
const router: Router = Router();

router.get('/',
    basicAuthUser,
    checkSession,
    getAllEvents
);

router.post('/',
    basicAuthUser,
    checkSession,
    saveEvent
);

router.put('/',
    basicAuthUser,
    checkSession,
    checkRequestBodyParams('_id'),
    updateEvent)

router.delete('/',
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    deleteEvent)

router.get('/getSingleEvent',
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    getSingleEvent)

router.put('/getFilterEvents',
    basicAuthUser,
    checkSession,
    getFilterEvents)

router.put('/updateBookedUsers',
    basicAuthUser,
    checkSession,
    updateBookedUsers)

router.get('/getAllUpcomingEvents',
    basicAuthUser,
    checkSession,
    getAllUpcomingEvents)

router.put('/getFilterUpComingEvents',
    basicAuthUser,
    checkSession,
    getFilterUpComingEvents)


export default router;