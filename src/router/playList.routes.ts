import { Router } from "express";
import { checkQuery, checkRequestBodyParams } from "../middleware/Validators";
import { basicAuthUser } from "../middleware/checkAuth";
import { checkSession } from "../utils/tokenManager";
import {savePlayList, getAllPlayList, getSinglePlayList, addPlayList, removePlayList,updatePlayList, deletePlayList, getFilterPlayList, getAllPlayListByUser} from "../controller/playList.controller";


const router = Router();

router.get('/', //get all users
    basicAuthUser,
    checkSession,
    getAllPlayList
);

router.post('/', //save playList
    basicAuthUser,
    checkSession,
    savePlayList
);

router.put("/",  //update playList
    basicAuthUser,
    checkSession,
    updatePlayList
);

router.delete('/', //delete playList
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    deletePlayList
);

router.put("/addPlayList",  //add playList
    basicAuthUser,
    checkSession,
    checkRequestBodyParams('_id'),
    checkRequestBodyParams('post'),
    addPlayList
);

router.put("/removePlayList",  //remove playList
    basicAuthUser,
    checkSession,
    checkRequestBodyParams('_id'),
    checkRequestBodyParams('post'),
    removePlayList
);

router.get("/getSinglePlayList",  //update playList
    basicAuthUser,
    checkSession,
    checkQuery('_id'),
    getSinglePlayList
);

router.put('/getFilterPlayList',
    basicAuthUser,
    checkSession,
    getFilterPlayList)

router.get('/getAllPlayListByUser',
    basicAuthUser,
    checkSession,
    getAllPlayListByUser)

export default router;