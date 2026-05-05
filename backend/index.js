// importing 'express'
const express = require("express");
const app = express();
// importing 'cors'
const cors = require("cors");

// middlewares
app.use(express.json());
app.use(cors());

// routes
const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);

app.listen(3000, () => {
  console.log("Server started");
});
