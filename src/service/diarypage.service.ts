import diaryPageModel, {DiaryPage} from "../model/diarypage.model";
import {DocumentDefinition, FilterQuery, QueryOptions, UpdateQuery} from "mongoose";
import { dbResponseTimeHistogram } from '../utils/metrics';

export async function createDiaryPage(input: DocumentDefinition<Omit<DiaryPage, 'createdAt' | "diaryPageId" | "approved">>){

    const metricsLabels = {
        operation:  "createDiaryPage",

    };
    const timer = dbResponseTimeHistogram.startTimer();
    try {

        const result = await diaryPageModel.create(input);
        timer({...metricsLabels, success: 1});
        return result;

    } catch (error) {
        timer({...metricsLabels, success: 0});
        throw error;
    }
    
}

export async function findDiaryPage(query: FilterQuery<DiaryPage>, options: QueryOptions= {lean: true}){
    const metricsLabels = {
        operation:  "findDiaryPage",

    };
    const timer = dbResponseTimeHistogram.startTimer();
    try {
        const result = await diaryPageModel.findOne(query,{},options).lean();
        timer({...metricsLabels, success: 1});
        return result;
        
    } catch (error) {
        timer({...metricsLabels, success: 0});
        throw error;
        
    }
    
}

export async function findAndUpdateDiaryPage(query:FilterQuery<DiaryPage>, update:UpdateQuery<DiaryPage>, options: QueryOptions){

    const metricsLabels = {
        operation:  "findAndUpdateDiaryPage",

    };
    const timer = dbResponseTimeHistogram.startTimer();
    try {
        const result = await diaryPageModel.findOneAndUpdate(query,update,options).lean();
        timer({...metricsLabels, success: 1});
        return result;
    } catch (error) {
        timer({...metricsLabels, success: 0});
        throw error;
        
    }
    
}

export async function deleteDiaryPage(query: FilterQuery<DiaryPage>){
    const metricsLabels = {
        operation:  "deleteDiaryPage",

    };
    const timer = dbResponseTimeHistogram.startTimer();
    try {
        const result = await diaryPageModel.deleteOne(query);
        timer({...metricsLabels, success: 1});
        return result;
    } catch (error) {
        timer({...metricsLabels, success: 0});
        throw error;
    }

}