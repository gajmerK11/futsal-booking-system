import express from "express";
import verifyTokenMiddleware from "../middleware/verifyToken";
import getNearbyVenues from "../controllers/venues";

const router = express.Router();
router.get("/nearby", verifyTokenMiddleware, getNearbyVenues);

export default router;
