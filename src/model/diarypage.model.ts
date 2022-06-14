import { getModelForClass, modelOptions, prop, Severity, pre, DocumentType, index, Ref } from "@typegoose/typegoose";
import { nanoid } from "nanoid";
import { User } from "./user.model";
import { boolean, string } from "zod";
import { property } from 'lodash';

//const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 10);

@modelOptions({
    schemaOptions:{
        timestamps: true
    },
    options: {
        allowMixed: Severity.ALLOW
    },
})

export class DiaryPage {
    @prop({required: true, default: () => `diaryPage${nanoid()}`, unique: true})
    diaryPageId: string;

    @prop({required : true})
    title: string;

    @prop({required: true})
    description: string;

    @prop({required : true})
    image: string;

    @prop()
    createdAt: Date;

    @prop({required: true})
    userId: Ref<User>;

    @prop({required: true, default: () => false})
    approved: boolean;
}

    //@prop({type: () => string, ref: () => User})
    //user: Ref<User>



const diaryPageModel = getModelForClass(DiaryPage);

export default diaryPageModel;