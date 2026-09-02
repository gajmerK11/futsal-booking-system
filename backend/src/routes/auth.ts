import express from "express";
// Importing 'register' and 'login' controllers
import { register, login, refresh, logout } from "../controllers/auth";
import { registerSchema } from "../validators/auth";

const router = express.Router();

// wiring up register, login, refresh routes with their respective controllers
router.post("/register", registerSchema, register);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", logout);

export default router;
