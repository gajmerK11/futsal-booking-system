// Importing express
import express from "express";
// Importing 'searchLocation' controller
import searchLocation from "../controllers/location";

// Creating instance of Router
const router = express.Router();
// wiring 'searchLocation' controller function/logic to route '/search'
router.get("/search", searchLocation);

export default router;
