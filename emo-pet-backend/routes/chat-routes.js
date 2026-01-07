import express from "express";
import { chatHandler } from "../controllers/chat-controller.js";
import safetyCheck from "../middlewares/safety-middleware.js";
import authMiddleware from "../middlewares/auth-middleware.js";
import { login,signin} from "../controllers/user-login.js";

const router = express.Router();

router.post("/", authMiddleware, safetyCheck, chatHandler);
router.post("/login",login);
router.post("/singin", signin);
router.post("/signin", signin);
export default router;
