import { Request, Response } from "express";
import { nanoid } from "nanoid";
import { CreateUserInput, ForgotPasswordInput, ResetPasswordInput, VerifyUserInput } from "../schema/user.schema";
import { createUser, findUserById, findUserByMail } from "../service/user.service";
import log from "../utils/logger";

import sendEmail from "../utils/mailer";


export async function createUserHandler(req: Request<{}, {}, CreateUserInput>, res: Response) {
    const body = req.body;

    try {

        const user = await createUser(body);
        await sendEmail({
            from: 'test@test.com',
            to: user.email,
            subject: 'verification',
            text: `verification code: ${user.verificationCode}. Id: ${user.id}`
        });

        return res.send(200).send("user başarılı şekilde kayıt edildi");

    } catch (e: any) {
        if (e.code == 11000) { //duplicate key error
            return res.status(400).send("Bu kullanılıyor");
        }
        return res.status(500).send(e)
    }

}

export async function verifyUserHandler(req: Request<VerifyUserInput>, res: Response) {
    const id = req.params.id
    const verificationCode = req.params.verificationCode

    //find the user by id
    const user = await findUserById(id);

    if (!user) {
        return res.status(404).send("user not found");
    }

    if (user.verified) {
        return res.send("user already verified");
    }

    if (user.verificationCode != verificationCode) {
        return res.status(400).send("verification code is not valid");
    }

    if (user.verificationCode == verificationCode) {
        user.verified = true;
        await user.save();
        return res.send("user verified");
    }

    return res.send("Could not verify user");

}

export async function forgotPasswordHandler(req: Request<{}, {}, ForgotPasswordInput>, res: Response) {
    const message = "if i can find a user with this email, i will send you passwword reset mail";

    const { email } = req.body;
    const user = await findUserByMail(email);

    if (!user) {

        return res.send(message);
    }

    if (!user.verified) {
        return res.send("user is not verified");
    }

    const passwordResetCode = nanoid();

    user.passwordResetCode = passwordResetCode;

    await user.save();

    await sendEmail({
        to: user.email,
        from: "test@cyberphonex.com",
        subject: "password reset",
        text: `password reset code: ${passwordResetCode}. Id: ${user.id}`

    });

    log.debug("password reset email sent");
    return res.send(message);


}


export async function resetPasswordHandler(req: Request<ResetPasswordInput['params'], {}, ResetPasswordInput["body"]>, res: Response) {
    const { id, passwordResetCode } = req.params;

    const { password } = req.body;

    const user = await findUserById(id);

    if(!user || !user.passwordResetCode || user.passwordResetCode != passwordResetCode) {
        return res.status(400).send("password reset code is not valid");
    }

    user.passwordResetCode = null;

    user.password = password;

    await user.save();

    return res.send("password reset successful"); //usermodel'deki save içindeki @pre komutu bizim için hash işlemini yapacak. hashing yapmaya gerek yok
}

export async function getCurrentUserHandler(req: Request<{}, {}, {}>, res: Response) {
    const user = res.locals.user;

    if (!user) {
        return res.status(401).send("user not found");
    }

    return res.send(user);
}




