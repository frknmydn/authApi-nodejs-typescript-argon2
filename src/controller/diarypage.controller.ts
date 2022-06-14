import {Request, Response, NextFunction} from "express";
import { CreateDiaryPage, UpdateDiaryPage, GetDiaryPage, DeleteDiaryPage, ApproveDiaryPage } from "../schema/diarypage.schema";
import { createDiaryPage, findAndUpdateDiaryPage, findDiaryPage, deleteDiaryPage } from "../service/diarypage.service";

export async function createDiaryPageHandler(req: Request<{}, {}, CreateDiaryPage>, res: Response) {
    const userId = res.locals.user._id;

    const body = req.body;
    const post = await createDiaryPage({...body, userId});
    if(post){
        res.status(200)
    }
    res.send("başarılı şekilde eklendi.")

}

export async function updateDiaryPageHandler(req: Request<UpdateDiaryPage["params"], {}, UpdateDiaryPage["body"]>, res: Response) {
    const userId = res.locals.user._id;
    const diaryPageId = req.params.diaryPageId;
    const update = req.body;
     
    const diarypage = await findDiaryPage({ diaryPageId});

    if(!diarypage){
        return res.status(404).send("DiaryPage not found");
    }

    const updatedDiaryPage = await findAndUpdateDiaryPage({diaryPageId}, update,{
        new: true,
    });

    res.send(updatedDiaryPage);

}

export async function approveDiaryPageHandler(req: Request<ApproveDiaryPage["params"], {}, ApproveDiaryPage["body"]>, res: Response) {
    const userId = res.locals.user._id;
    const diaryPageId = req.params.diaryPageId;
    const approve = req.body;
     
    const diarypage = await findDiaryPage({ diaryPageId });

    if(!diarypage){
        return res.status(404).send("DiaryPage not found");
    }

    const updatedDiaryPage = await findAndUpdateDiaryPage({diaryPageId}, approve,{
        new: true,
    });

    res.send(updatedDiaryPage);

}

export async function getDiaryPageHandler(req: Request<GetDiaryPage>, res: Response) {

    const diaryPageId = req.params.diaryPageId;
    const diarypage = await findDiaryPage({diaryPageId});

    if(!diarypage){
        return res.status(404).send("DiaryPage not found");
    }

    return res.send(diarypage);


}

export async function deleteDiaryPageHandler(req: Request<DeleteDiaryPage>, res: Response) {

    const userId = res.locals.user._id;
    const diaryPageId =  req.params.diaryPageId;

    const diaryPage = await findDiaryPage({diaryPageId});

    if(!diaryPage){
        return res.status(404).send("DiaryPage not found");
    }

    await deleteDiaryPage({diaryPageId});

    return res.status(200).send("DiaryPage deleted");
    
}
