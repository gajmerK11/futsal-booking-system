// importing 'express'
import express from "express";
// importing 'cors'
import cors from "cors";
// importing 'cookie parser'
import cookieParser from "cookie-parser";
// importing 'pool' which is exported from the file 'db.js'
// './' tells nodejs "look for local file, not a package"
import pool from "./models/db";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/user";
import locationRoutes from "./routes/location";
import venueRoutes from "./routes/venues";

const app = express();
// cors configuration object for allowing cookies to be sent for cross-origin requests
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};

// global middlewares (runs for every request)
app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());

// Routes
// Authentication Routes
app.use("/auth", authRoutes);

// Profile Routes
app.use("/user", userRoutes);

// Location routes
// this appends '/location' at beginning of '/search' i.e. '/location/search
app.use("/location", locationRoutes);

// Venue routes
app.use("/venues", venueRoutes);

app.listen(3000, () => {
  console.log("Server started");
});

// testing db connection
async function testDBConnection() {
  try {
    const testResult = await pool.query("SELECT NOW()");
    console.log("DB connected successfully:", testResult.rows[0].now);
  } catch (error) {
    console.log("Something went wrong.", error);
  }
}

testDBConnection();
