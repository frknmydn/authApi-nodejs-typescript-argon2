import supertest from 'supertest';
import createServer from "../utils/createServer";
import * as UserService from "../service/user.service";
import * as AuthService from "../service/auth.service";
import * as DiaryService from "../service/diarypage.service";
import * as RequireUser from "../middleware/requireUser";
import UserModel, {User} from "../model/user.model";
import argon2 from 'argon2';
import mongoose from 'mongoose';
import { nanoid } from "nanoid";
import { verifyJwt } from '../utils/jwt';
import connectToDb from '../utils/connectToDb';
import * as JWTService from "../utils/jwt";
import userModel from '../model/user.model';



const app = createServer();

const userId = new mongoose.Types.ObjectId().toString();
const verificationCode = nanoid();


const userPayload = {
    _id : userId,
    email: "erman.kan@example.com",
    firstName : "Erman",
    lastName: "Kan",
    password: "$argon2i$v=19$m=4096,t=3,p=1$qCDIgmG6MiP87ZzuB9EhsQ$WM/1jgzLJDKJ8r3NgxuA2voAop29edGWgVTt1tzKc8g",
    type: "basic",
    verified: true,
    verificationCode: verificationCode,
    createdAt: "2022-04-25T20:21:48.070+00:00",
    updatedAt: "2022-04-25T20:26:20.957+00:00",
    _v: 0
}

const userPayload2 = {
    _id : userId,
    email: "erman.kan@example.com",
    firstName : "Erman",
    lastName: "Kan",
    password: "$argon2i$v=19$m=4096,t=3,p=1$qCDIgmG6MiP87ZzuB9EhsQ$WM/1jgzLJDKJ8r3NgxuA2voAop29edGWgVTt1tzKc8g",
    type: "basic",
    verified: true,
    verificationCode: verificationCode,
    createdAt: "2022-04-25T20:21:48.070+00:00",
    updatedAt: "2022-04-25T20:26:20.957+00:00",
    accessTokenPrivateKey: "ACCESS_TOKEN_PRIVATE_KEY",
    refreshTokenPrivateKey:"REFRESH_PRIVATE_KEY",
    accessTokenPublicKey:"ACCESS_TOKEN_PUBLIC_KEY",
    refreshTokenPublicKey:"REFRESH_PUBLIC_KEY",
    _v: 0,
    save: () => {
        "saved"
    },
    toJSON: () => {
        "json"
    },
    validatePassword: async () => {
        return true
    },
}

const sessionPayload = {

    _id : new mongoose.Types.ObjectId().toString(),
    user: userId,
    valid: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    _v: 0,

}
const diaryPagePayload = {
    _id: userId,
    title: "test diary title",
    description:" test diary description",
    image: "pointer link to the image",
    userId: userId,
    diaryPageId: "diaryid",
    approved: false,
    createdAt: "2022-04-25T20:26:20.957+00:00",
    updatedAt: "2022-04-25T20:27:20.957+00:00",
    _V: 0,

}

const token = "Token";

const diaryPageInput = {
    title: "test diary title input test diary title input",
    description : "test diary description input test diary description input",
    image: "test diary image link input test diary image link input",
}

const userInput = {
        "firstName": "Erman",
        "lastName": "Kan",
        "email": "erman.kan@example.com",
        "password": "123456",
        "passwordConfirmation": "123456"
}

const loginInput= {
    "email": "erman.kan@example.com",
    "password": "123456",
}

jest.useFakeTimers('legacy');

describe("User,", () => {

    //To-do
    //Write test cases for requesting password reset
    
        it('returns 200 OK when signup request is valid', async () => {

            const createUserServiceMock = jest
            .spyOn(UserService,"createUser")
            //@ts-ignore
            .mockReturnValueOnce(userPayload);


            const {status} = await supertest(app).post('/api/users').send(userInput);

            expect(status).toBe(200);

            expect(createUserServiceMock).toHaveBeenCalledWith(userInput);

            }),

        it('returns 400 when passwords do not match', async () => {
        
            const createUserServiceMock = jest
            .spyOn(UserService,"createUser")
            //@ts-ignore
            .mockReturnValueOnce(userPayload);


            const {status} = await supertest(app).post('/api/users').send({...userInput, passwordConfirmation: "123456789"});

            expect(status).toBe(400);

            expect(createUserServiceMock).not.toHaveBeenCalled();
            }),

        it('returns 200 when user logs in ', async () => {
    
            const getUserServiceMock = jest
            .spyOn(UserService,"findUserByMail")
            //@ts-ignore
            .mockReturnValueOnce(userPayload2);

            const sessionServiceMock = jest
            .spyOn(AuthService,"createSession")
            //@ts-ignore
            .mockReturnValue(sessionPayload)

            const sessionServiceMock1 = jest
            .spyOn(AuthService,"signRefreshToken")
            //@ts-ignore
            .mockReturnValue(token)

            const sessionServiceMock2 = jest
            .spyOn(AuthService,"signAccessToken")
            //@ts-ignore
            .mockReturnValue(token)
            
            const jwtMock = jest
            .spyOn(JWTService,"signJwt")
            //@ts-ignore
            .mockReturnValue(token);
            
            const {status,text} = await supertest(app).post('/api/session').send(loginInput);

            expect(status).toBe(200);
            expect(text).not.toEqual("email or password not found");
            expect(getUserServiceMock).toHaveBeenCalledWith(loginInput.email);
            
        

            }),

        it('returns 200 OK when user validates themselves', async () => {

            const findUserServiceMock = jest
            .spyOn(UserService,"findUserById")
            //@ts-ignore
            .mockReturnValue(userPayload2);

            const {status} = await supertest(app)
            .post(`/api/users/verify/${userPayload._id}/${userPayload.verificationCode}`)

            expect(status).toBe(200);

            expect(findUserServiceMock).toHaveBeenCalledWith(userPayload2._id);
            })
            
            
        });

describe("Diary Page,", ()=> {
    //To-do
    //Write test case for getting a diarypage
    //Write test case for updating a diarypage
    //Write test case for approving a diarypage
    //write test case for deleting a diarypage
    it('returns 200 ok when diary page is posted', async () =>{

        const createDiaryMock = jest
            .spyOn(DiaryService,"createDiaryPage")
            //@ts-ignore
            .mockReturnValueOnce(diaryPagePayload);

        const jwtMock = jest
        .spyOn(JWTService,"verifyJwt")
        //@ts-ignore
        .mockReturnValueOnce(token);

        const {status} = await supertest(app).post('/api/diarypages').send(diaryPageInput).set('Authorization', `Bearer ${"token"}`);

        expect(status).toBe(200);
        expect(jwtMock).toHaveBeenCalled();
        expect(createDiaryMock).toHaveBeenLastCalledWith(diaryPageInput);

    });
});

        
        
            
        
