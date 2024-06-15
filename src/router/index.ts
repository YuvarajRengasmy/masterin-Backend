import { Router } from 'express';
const router: Router = Router();

import Master from './master.routes';
import Post from './post.routes';
import Login from './login.routes';
import Category from './category.routes';
import Notification from './notification.routes';
import Company from './company.routes';
import User from './user.routes';
import BookSession from './bookSession.routes';
import PlayList from './playList.routes';
import Dashboard from './dashboard.routes';
import Event from './event.routes';




router.use('/master', Master);
router.use('/post', Post);
router.use('/login', Login);
router.use('/category', Category);
router.use('/notification', Notification);
router.use('/company', Company);
router.use('/user', User);
router.use('/bookSession', BookSession);
router.use('/playList', PlayList);
router.use('/dashboard', Dashboard);
router.use('/event', Event);


export default router;