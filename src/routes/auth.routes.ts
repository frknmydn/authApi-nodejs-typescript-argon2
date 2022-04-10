import express from "express";
import { createSessionHandler, refreshAccesstokenHandler } from "../controller/auth.controller";
import validateResource from "../middleware/validateResources";
import { createSessionSchema } from "../schema/auth.schema";

const router = express.Router();

router.post("/api/session", validateResource(createSessionSchema),createSessionHandler);

router.post("/api/session/refresh", refreshAccesstokenHandler);

export default router;