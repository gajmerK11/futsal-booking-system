// Inorder to read from .env, we are importing 'dotenv' here and using its '.config' function
require("dotenv").config();

// importing 'express'
const express = require("express");
const app = express();

// importing 'cors'
const cors = require("cors");
// cors configuration object for allowing cookies to be sent for cross-origin requests
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};

// importing 'cookie parser'
const cookieParser = require("cookie-parser");

// importing 'pool' which is exported from the file 'db.js'
// './' tells nodejs "look for local file, not a package"
const pool = require("./models/db.js");

// middlewares
app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());

// Routes
// Authentication Routes
const authRoutes = require("./routes/auth.js");
app.use("/auth", authRoutes);
// Profile Routes
const userRoutes = require("./routes/user.js");
app.use("/user", userRoutes);
// Location routes
const locationRoutes = require("./routes/location.js");
// this appends '/location' at beginning of '/search' i.e. '/location/search
app.use("/location", locationRoutes);

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
