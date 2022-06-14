import { DocumentType } from "@typegoose/typegoose";
import {omit} from 'lodash';
import SesisonModel from "../model/session.model";
import { privateFields, User } from "../model/user.model";
import { signJwt } from "../utils/jwt";
import { dbResponseTimeHistogram } from '../utils/metrics';


export async function createSession({userId}:{
    userId: string 
}){
    const metricsLabels = {
        operation:  "createSession",

    }
    const timer = dbResponseTimeHistogram.startTimer();

    try {
        const result = await SesisonModel.create({user: userId});
        timer({...metricsLabels, success: 1});

        return result
        
    } catch (error) {
        timer({...metricsLabels, success: 0})
        throw(error)
    }
    
}

export async function signRefreshToken({userId}:
    {userId: string}
    ){
        const metricsLabels = {
            operation:  "signRefreshToken",
    
        }
        const timer = dbResponseTimeHistogram.startTimer();
        
        const session = await createSession({
            userId
        });
        try{
            const refreshToken = await signJwt({
                session: session._id,
            },
            "refreshTokenPrivateKey",
            {
                expiresIn: "30 days"
            });
            timer({...metricsLabels, success: 1});

            return refreshToken;
        }catch(error){
            timer({...metricsLabels, success: 0});
        }
    
    
}



export function signAccessToken(user: DocumentType<User>){
    const payload = omit(user.toJSON(),privateFields);

    const accessToken = signJwt(payload, "accessTokenPrivateKey", {
        expiresIn: "30 days"
        });

    return accessToken;
}

export async function findSessionById(id: string){
    return SesisonModel.findById(id);
}

