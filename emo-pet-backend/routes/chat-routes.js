import express from "express";
import { chatHandler } from "../controllers/chat-controller.js";
import safetyCheck from "../middlewares/safety-middleware.js";
import authMiddleware from "../middlewares/auth-middleware.js";
import { login, register} from "../controllers/user-login.js";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/", authMiddleware, safetyCheck, chatHandler);
router.post("/test", (req, res) => {
  res.json({ message: "Backend is working!", timestamp: new Date() });
});
router.post("/get-token", (req, res) => {
  const testToken = jwt.sign(
    { userId: "695e7a285024a29d66d4f896" },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
  res.json({ token: testToken });
});
router.post("/login",login);
router.post("/signin", register);
export default router;
