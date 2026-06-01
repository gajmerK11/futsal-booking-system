const pool = require("../models/db.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// This function is for the logic of '/register' route
async function register(req, res) {
  try {
    // extracting from request body
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const phone_number = req.body.phone_number;
    const role = req.body.role;

    // validating input (input validation)
    if (!username || !email || !password || !phone_number || !role) {
      return res.status(400).json({ message: "Invalid input" });
    }

    // Below is logic for checking if the email already exists for the new user (i.e. checking duplicate email)
    // ---------------------------------------------- //

    // if that email already exists, this query retrieves the row of email that the user has provided while registering ()
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email],
    );

    // since, the Result object of pg has records/rows saved as 'rows' key and as an array so we are checking its length because if the email already exists then above query returns 'rows' with ONE item in array (i.e. with the record of that matching email) which is equivalent to array with length 1
    if (existingUser.rows.length === 1) {
      return res
        .status(409)
        .json({ message: "User with this email already exists." });
    }
    // ---------------logic end----------------- //

    // hashing the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // saving in database
    const result = await pool.query(
      `INSERT INTO users (username, email, password, phone_number, role) VALUES ($1, $2, $3, $4, $5) RETURNING user_id, username, email, role`,
      [username, email, hashedPassword, phone_number, role],
    );

    // returning response to frontend
    return res.status(201).json({
      message: "User registered successfully.",
      // Why here result.rows[0] ?? Look at notion
      user: result.rows[0],
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
}

async function login(req, res) {
  try {
    // extracting from request body
    const email = req.body.email;
    const password = req.body.password;

    // validating input (input validation)
    if (!email || !password) {
      return res.status(400).json({ message: "Invalid input" });
    }

    // checking user typed email exists in the db or not
    // ------------------------------------------------
    const result = await pool.query("SELECT * FROM users where email = $1", [
      email,
    ]);

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    // ----------------------------------------------------

    // checking user typed password is correct or not
    // -----------------------------------------------
    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    // ------------------------------------------------

    // generating jwt token ('jwt.sign()' is the method that both generates and signs the token in one step)
    const token = jwt.sign(
      { id: user.user_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    // sending token to frontend as a response and also when everything is correct i.e. when user inputted email and password is correct, we send these things from backend
    return res.status(200).json({
      message: "Login successful",
      token, // similar to writing 'token: token' - instead of this, used something called 'object shorthand' of js
      username: user.username,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
}

module.exports = { register, login };
