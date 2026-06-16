const express = require("express");
const router = express.Router();
const verifyTokenMiddleware = require("../middleware/verifyToken");
const getNearbyVenues = require("../controllers/venues");

router.get("/nearby", verifyTokenMiddleware, getNearbyVenues);

module.exports = router;
