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
    const location = req.body.location;
    const latitude = req.body.lat;
    const longitude = req.body.lon;

    // validating input (input validation)
    if (
      !username ||
      !email ||
      !password ||
      !phone_number ||
      !role ||
      !location ||
      !latitude ||
      !longitude
    ) {
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
      `INSERT INTO users (username, email, password, phone_number, role, location, latitude, longitude) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING user_id, username, email, role`,
      [
        username,
        email,
        hashedPassword,
        phone_number,
        role,
        location,
        latitude,
        longitude,
      ],
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

// This function is for the logic of '/login' route
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
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
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

    // generating access token which is a jwt token ('jwt.sign()' is the method that both generates and signs the token in one step)
    const accessToken = jwt.sign(
      { id: user.user_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "15m" },
    );
    // generating refresh token
    const refreshToken = jwt.sign(
      { id: user.user_id, role: user.role },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" },
    );

    // sets cookie in response headers
    // here we don't do 'return' because it doesn't send the reponse - it just adds the cookie to the response headers
    // the actual response is sent by line after this block
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true, // JS cannot read this cookie (XSS protection)
      secure: false, // for development only (true in production (HTTPS only))
      sameSite: "strict", // blocks cross-site requests (CSRF protection)
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
    });

    // sends response
    // i.e.
    // sending token to frontend as a response and also when everything is correct i.e. when user provided email and password is correct, we send these things from backend
    return res.status(200).json({
      message: "Login successful",
      accessToken, // similar to writing 'accessToken: accessToken' - instead of this, used something called 'object shorthand' of js (this way of writing is used if both key and value have same name)
      username: user.username,
      role: user.role,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
}

// refreshToken function
function refresh(req, res) {
  // Step-1: reading refreshToken from cookie
  const refreshToken = req.cookies.refreshToken;
  // This is for 'what if no cookies exist - browser never logged in, cookie expired, cleared?'. So - if no cookie (no cookie means no refreshToken), return 401
  if (!refreshToken) {
    return res.status(401).json({ message: "No cookie found." });
  }

  try {
    // Step-2: verify the token
    const verifiedToken = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
    );
    // Step-3: sign new access token (create new access token)
    const newAccessToken = jwt.sign(
      { id: verifiedToken.id, role: verifiedToken.role },
      process.env.JWT_SECRET,
      { expiresIn: "15m" },
    );
    // Step-4: send new access token in response/json response
    return res.status(200).json({
      newAccessToken,
    });
  } catch (error) {
    // If refresh token is invalid or expired, 'jwt.verfiy()' throws an error - catch block handles it and sends back 403
    return res.status(403).json({ message: "Invalid or expired token." });
  }
}

function logout(req, res) {
  res.clearCookie("refreshToken");
  return res.status(200).json({ message: "Logged out successfully" });
}

module.exports = { register, login, refresh, logout };
