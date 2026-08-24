import pool from "../models/db";
import { Request, Response } from "express";

async function getNearbyVenues(req: Request, res: Response) {
  try {
    // Handling type error. Haven't understood it quite
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Step-1: Extract 'user_id' from req.user (req.user is set by 'verifyToken' middleware)
    const user_id = req.user.id;

    // Step-2: DB query
    const result = await pool.query(
      "SELECT latitude, longitude from users WHERE user_id = $1",
      [user_id],
    );

    // Extracting lat/lon from result ('pool.query' returns Result object)
    const latitude = result.rows[0].latitude;
    const longitude = result.rows[0].longitude;

    // Step-3: Haversine subquery
    const haversineExpression = `6371 * acos(
    cos(radians($1)) * cos(radians(latitude)) * cos(radians(longitude) - radians($2)) + sin(radians($1)) * sin(radians(latitude))`;
    const venueResult = await pool.query(
      `SELECT * FROM (SELECT *, ${haversineExpression} AS distance_km FROM futsal_venues) AS venues_with_distance WHERE distance_km <=10 ORDER BY distance_km ASC`,
      [latitude, longitude],
    );

    // Step-4: Return venue results as JSON
    return res.status(200).json({
      message: "Success",
      data: venueResult.rows,
    });
  } catch (error) {
    // Logging error to console so that when something breaks in production, i'll have idea of what went wrong
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

export { getNearbyVenues };
