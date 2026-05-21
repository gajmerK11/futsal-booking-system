const pool = require("../models/db.js");
const bcrypt = require("bcrypt");

async function register(req, res) {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  const phone_number = req.body.phone_number;
  const role = req.body.role;
}
