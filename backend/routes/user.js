const express = require("express");
const router = express.Router();
const verifyTokenMiddleware = require("../middleware/verifyToken");
const getProfile = require("../controllers/user");

router.get("/profile", verifyTokenMiddleware, getProfile);

module.exports = router;
