import { DocumentType } from "@typegoose/typegoose";
import {omit} from 'lodash';
import SesisonModel from "../model/session.model";
import { privateFields, User } from "../model/user.model";
import { signJwt } from "../utils/jwt";


export async function createSession({userId}:{
    userId: string 
}){
    return SesisonModel.create({user: userId});
}

export async function signRefreshToken({userId}:
    {userId: string}
    ){
        const session = await createSession({
            userId
        });

    const refreshToken = signJwt({
        session: session._id,
    },
    "refreshTokenPrivateKey",
    {
        expiresIn: "30 days"
    });

    return refreshToken;
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

