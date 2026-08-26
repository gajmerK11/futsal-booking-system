import express from "express";
// Importing 'register' and 'login' controllers
import { register, login, refresh, logout } from "../controllers/auth";

const router = express.Router();

// wiring up register, login, refresh routes with their respective controllers
router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", logout);

export default router;
