const express = require("express");
const router = express.Router();
// Importing 'register' and 'login' controllers
const { register, login, refresh, logout } = require("../controllers/auth.js");

// wiring up register, login, refresh routes with their respective controllers
router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", logout);

module.exports = router;
