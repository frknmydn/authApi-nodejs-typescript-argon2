import express from "express";
import validateResource from "../middleware/validateResources";
import requireUser from "../middleware/requireUser";
import {approveDiaryPageSchema, createDiaryPageSchema, deleteDiaryPageSchema, getDiaryPageSchema, updateDiaryPageSchema} from "../schema/diarypage.schema";
import { approveDiaryPageHandler, createDiaryPageHandler, deleteDiaryPageHandler, getDiaryPageHandler, updateDiaryPageHandler } from "../controller/diarypage.controller";
import  checkPermission from '../middleware/checkUserPermission';
import userTypes from '../utils/userTypes';


const router = express.Router();

router.post("/api/diarypages",validateResource(createDiaryPageSchema),requireUser, createDiaryPageHandler);

router.put("/api/diarypages/update/:diaryPageId",validateResource(updateDiaryPageSchema),requireUser, checkPermission([userTypes.ADMIN]), updateDiaryPageHandler);

router.put("/api/diarypages/approve/:diaryPageId",validateResource(approveDiaryPageSchema),requireUser, checkPermission([userTypes.ADMIN,userTypes.MODERATOR]), approveDiaryPageHandler);

router.get("/api/diarypages/get/:diaryPageId",validateResource(getDiaryPageSchema),requireUser, getDiaryPageHandler);

router.delete("/api/diarypages/delete/:diaryPageId", validateResource(deleteDiaryPageSchema),requireUser, checkPermission([userTypes.ADMIN]),deleteDiaryPageHandler);

export default router;