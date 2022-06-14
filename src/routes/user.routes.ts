import express from "express";
import { createUserHandler, forgotPasswordHandler, getCurrentUserHandler, resetPasswordHandler, verifyUserHandler } from "../controller/user.controller";
import requireUser from "../middleware/requireUser";
import validateResource from "../middleware/validateResources";
import { createUserSchema, forgotPasswordSchema, resetPasswordSchema, verifyUserSchema } from "../schema/user.schema";
import { rateLimit } from 'express-rate-limit';

const router = express.Router();

const passwordResetLimiter = rateLimit({
    windowMs: 60 * 1000,
    max : 5,
    message: "Too many requests are being sent from this IP, please try again later"
})

router.post("/api/users",validateResource(createUserSchema), createUserHandler);

router.post("/api/users/verify/:id/:verificationCode", validateResource(verifyUserSchema), verifyUserHandler);

router.post("/api/users/forgotpassword",passwordResetLimiter,validateResource(forgotPasswordSchema), forgotPasswordHandler);

router.post("/api/users/resetpassword/:id/:passwordResetCode",passwordResetLimiter, validateResource(resetPasswordSchema), resetPasswordHandler);

router.get("/api/users/me",requireUser,getCurrentUserHandler);

export default router;