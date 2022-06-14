import {object, string, TypeOf} from "zod"

export const createUserSchema = object({
    body: object({
        firstName: string({
            required_error: "firstName required",
        }),

        lastName: string({
            required_error: "lastName required",
        }),
        password: string({
            required_error: "password required",
        }).min(6,"password at least 6 chac"),

        passwordConfirmation: string({
            required_error: "passwordConfirmationrequired",
        }),

        email: string({
            required_error: "email required",
        }).email("e mail should be valid"),
    }).refine((data) => data.password === data.passwordConfirmation, {message: "passwordConfirmation and pass not match",path: ["passwordConfirmation"]}),
});

export const verifyUserSchema = object({
    params: object({
        id: string(),
        verificationCode: string(),

    })
});

export const forgotPasswordSchema = object({
    body: object({
        email: string({
            required_error: "email required",
        }).email("e mail should be valid"),
    })
})

export const resetPasswordSchema= object({
    params: object({
        id: string(),
        passwordResetCode: string(),
    }),
    body: object({
        password: string({
            required_error: "password required",
        }).min(6,"password at least 6 chac"),
        passwordConfirmation: string({
            required_error: "passwordConfirmationrequired",
        }),
    }).refine((data) => data.password === data.passwordConfirmation, {message: "passwordConfirmation and pass not match",path: ["passwordConfirmation"]}),
})

export type CreateUserInput = TypeOf<typeof createUserSchema>["body"];

export type VerifyUserInput = TypeOf<typeof verifyUserSchema>["params"];

export type ForgotPasswordInput = TypeOf<typeof forgotPasswordSchema>["body"];

export type ResetPasswordInput = TypeOf<typeof resetPasswordSchema>;
