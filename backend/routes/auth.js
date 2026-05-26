const express = require("express");
const router = express.Router();
// Importing 'register' and 'login' controllers
const { register, login } = require("../controllers/auth.js");

// wiring up register and login routes with their respective controllers
router.post("/register", register);
router.post("/login", login);

module.exports = router;
