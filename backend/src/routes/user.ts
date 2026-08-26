import { Router } from "express";
import verifyTokenMiddleware from "../middleware/verifyToken";
import getProfile from "../controllers/user";

const router = Router();
router.get("/profile", verifyTokenMiddleware, getProfile);

export default router;
