// Inorder to read from .env, we are importing 'dotenv' here and using its '.config' function
require("dotenv").config();

// importing 'express'
const express = require("express");
const app = express();

// importing 'cors'
const cors = require("cors");

// importing 'pool' which is exported from the file 'db.js'
// './' tells nodejs "look for local file, not a package"
const pool = require("./models/db.js");

// middlewares
app.use(express.json());
app.use(cors());

// routes
const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);

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
