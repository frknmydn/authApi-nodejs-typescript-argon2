import { Request, Response } from "express";
import { get } from "lodash";
import { Session } from "../model/session.model";
import { createSessionInput } from "../schema/auth.schema";
import { findSessionById, signAccessToken, signRefreshToken } from "../service/auth.service";
import { findUserById, findUserByMail } from "../service/user.service";
import { verifyJwt } from "../utils/jwt";


export async function createSessionHandler(req: Request<{},{},createSessionInput>, res: Response){
    const { email, password } = req.body;
    const user = await findUserByMail(email);

    if(!user) {
        return res.send("email or password not found");
    }

    if(!user.verified) {
        return res.send("user is not verified");
    }

    const isValidPass = await user.validatePassword(password);

    if(!isValidPass){
        return res.send("email or password not found");
    }


    //access token
    const accessToken = signAccessToken(user);

    //refresh token

    const refreshToken = await signRefreshToken({
        userId: user._id
    });

    return res.send({
        accessToken, refreshToken
    });
}

export async function refreshAccesstokenHandler(req: Request,res: Response){
    const refreshToken = get(req, 'headers.x-refresh');

    const decodedRefresh = verifyJwt<{session: string}>(refreshToken,"refreshTokenPublicKey");

    if(!decodedRefresh) {
        return res.send("invalid refresh token");
    }

    const session = await findSessionById(decodedRefresh.session);

    if(!session || !session.valid) {
        return res.send("invalid refresh token");
    }

    const user = await findUserById(String(session.user));

    if(!user) {
        return res.send("user not found");
    }

    const accessToken = signAccessToken(user);

    return res.send({accessToken});

}