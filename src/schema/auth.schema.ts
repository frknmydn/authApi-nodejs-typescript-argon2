import {object, string, TypeOf} from "zod"

export const createSessionSchema = object({
    body: object({
        email: string({
            required_error: "email required",
        }).email("e mail should be valid"),
        password: string({
            required_error: "password required",
        }).min(6,"password at least 6 chac"),
    }),
});

export type createSessionInput = TypeOf<typeof createSessionSchema>["body"];