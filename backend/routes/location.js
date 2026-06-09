// Importing express
const express = require("express");
// Creating instance of Router
const router = express.Router();
// Importing 'searchLocation' controller
const { searchLocation } = require("../controllers/location.js");

// wiring 'searchLocation' controller function/logic to route '/search'
router.get("/search", searchLocation);

module.exports = router;
