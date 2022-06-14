import {boolean, object, string, TypeOf} from "zod"

export const createDiaryPageSchema = object ({
    body: object({
        title: string({
            required_error: "title is required",
        }),
        description: string({
            required_error: "description is required",
        }).min(40,"description must be at least 40 characters long"),
        image: string({
            required_error: "image is required",
        })
    })
});

export const updateDiaryPageSchema = object({
    body: object({
        title: string({
            required_error: "title is required",
        }),
        description: string({
            required_error: "description is required",
        }).min(40,"description must be at least 40 characters long"),
        image: string({
            required_error: "image is required",
        }),

    }),
    params: object({
        diaryPageId: string({
            required_error: "diarypageid is required",
        })
    })
})

export const approveDiaryPageSchema = object({
    body: object({
        approved: boolean({
            required_error: "approval is required",
        }),
    }),
    params: object({
        diaryPageId: string({
            required_error: "diarypageid is required",
        })
    })
})


export const deleteDiaryPageSchema = object({
    params: object({
        diaryPageId: string({
            required_error: "diarypageid is required",
        })
    })
})


export const getDiaryPageSchema = object({
    params: object({
        diaryPageId: string({
            required_error: "diarypageid is required",
        })
    })
})



export type CreateDiaryPage = TypeOf<typeof createDiaryPageSchema>["body"];
export type GetDiaryPage = TypeOf<typeof getDiaryPageSchema>["params"]
export type UpdateDiaryPage = TypeOf<typeof updateDiaryPageSchema>;
export type ApproveDiaryPage = TypeOf<typeof approveDiaryPageSchema>;
export type DeleteDiaryPage = TypeOf<typeof deleteDiaryPageSchema>["params"];
