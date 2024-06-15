import { Router } from 'express';
import { checkQuery, checkRequestBodyParams } from '../middleware/Validators';
import { basicAuthUser } from '../middleware/checkAuth';
import { checkSession } from '../utils/tokenManager';
import { getAllMasterEvents, getAllMasterWorkShops, getDashboardEventsFilter, getDashboardWorkShopsFilter, getMasterDashboardCounts, getMasterDashboardList, } from '../controller/dashboard.controller';
const router: Router = Router();

router.get('/',
    basicAuthUser,
    checkSession,
    getMasterDashboardCounts
);

router.get('/getMasterDashboardList',
    basicAuthUser,
    checkSession,
    getMasterDashboardList
);

router.get('/getAllMasterEvents',
    basicAuthUser,
    checkSession,
    getAllMasterEvents
);

router.put('/getDashboardEventsFilter',
    basicAuthUser,
    checkSession,
    getDashboardEventsFilter
);

router.get('/getAllMasterWorkShops',
    basicAuthUser,
    checkSession,
    getAllMasterWorkShops
);

router.put('/getDashboardWorkShopsFilter',
    basicAuthUser,
    checkSession,
    getDashboardWorkShopsFilter
);

export default router;