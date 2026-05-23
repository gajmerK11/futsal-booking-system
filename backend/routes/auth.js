const express = require("express");
const router = express.Router();
// Importing 'register' controller
const { register } = require("../controllers/auth.js");

router.post("/register", register);
router.post("/login", (req, res) => {});

module.exports = router;
