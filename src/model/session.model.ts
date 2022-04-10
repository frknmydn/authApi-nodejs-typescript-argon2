import { getModelForClass, prop, Ref } from "@typegoose/typegoose";

import { User } from "./user.model";

export class Session{
    @prop({ required: true })
    user: Ref<User>;

    @prop({ default: true })
    valid: boolean;
}

const SesisonModel = getModelForClass(Session,{
    schemaOptions: {
        timestamps: true,
    },
});

export default SesisonModel;