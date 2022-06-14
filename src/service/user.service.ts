import UserModel, {User} from "../model/user.model";
import { dbResponseTimeHistogram } from '../utils/metrics';

export async function createUser(input: Partial<User>){
    const metricsLabels = {
        operation:  "createUser",

    };
    const timer = dbResponseTimeHistogram.startTimer();
    try {
        const result = await UserModel.create(input);
        timer({...metricsLabels, success: 1});
        return result;
    } catch (error) {
        timer({...metricsLabels, success: 0});
        throw error;
    }
    
}

export async function findUserById(id: string){
    const metricsLabels = {
        operation:  "findUserById",

    };
    const timer = dbResponseTimeHistogram.startTimer();
    try {
        const result = await UserModel.findById(id);
        timer({...metricsLabels, success: 1});
        return result
    } catch (error) {

        timer({...metricsLabels, success: 0});
        throw error;
    }
}

export async function findUserByMail(email: string){

    const metricsLabels = {
        operation:  "findUserByMail",

    };
    const timer = dbResponseTimeHistogram.startTimer();
    try {

        const result = await UserModel.findOne({email});
        timer({...metricsLabels, success: 1});
        return result

    } catch (error) {

        timer({...metricsLabels, success: 0});
        throw error;
    }
}