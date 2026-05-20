/*
This file is responsible for establishing connection between backend (nodejs) and database.
In order to implment connection, following things are done: 
*/

// This line imports 'Pool' from pg package (pg is used to connect postgresql)
const { Pool } = require("pg");
// Inorder to read from .env, we are importing 'dotenv' here and using its '.config' function
require("dotenv").config();

// Reading from .env to setup connection pool as 'pool' instance
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// Exporting 'pool' so that any file that requires it can use it
module.exports = pool;
