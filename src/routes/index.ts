import express from "express"
import auth from './auth.routes'
import user from './user.routes'
import diarypage from './diarypage.routes'

const router = express.Router();


router.get("/healthcheck",(_,res)=>{
    res.sendStatus(200);
});

router.use(user);
router.use(auth);
router.use(diarypage);


export default router;