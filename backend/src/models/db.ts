/*
This file is responsible for establishing connection between backend (nodejs) and database.
In order to implment connection, following things are done: 
*/

// This line imports 'Pool' from pg package (pg is used to connect postgresql)
import { Pool } from "pg";
// This line imports 'env' from 'env.ts' file where 'zod' package is used to define the schema/structure of environment variables for validation
import { env } from "../config/env";

// Reading from env to setup connection pool as 'pool' instance
const pool = new Pool({
  host: env.DB_HOST,
  port: env.DB_PORT,
  database: env.DB_NAME,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
});

// Exporting 'pool' so that any file that requires it can use it
export default pool;
