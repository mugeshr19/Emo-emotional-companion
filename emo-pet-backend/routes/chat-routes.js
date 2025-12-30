import express from "express";
import { chatHandler } from "../controllers/chat-controller.js";
import safetyCheck from "../middlewares/safety-middleware.js";

const router = express.Router();

router.post("/", safetyCheck, chatHandler);

export default router;
