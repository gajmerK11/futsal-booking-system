const jwt = require("jsonwebtoken");

function generateToken(userId, role, res) {
  // generating access token which is a jwt token ('jwt.sign()' is the method that both generates and signs the token in one step)
  const accessToken = jwt.sign(
    { id: userId, role: role },
    process.env.JWT_SECRET,
    { expiresIn: "15m" },
  );

  // generating refresh token
  const refreshToken = jwt.sign(
    { id: userId, role: role },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" },
  );

  // sets cookie in response headers
  // here we don't do 'return' because it doesn't send the reponse - it just adds the cookie to the response headers
  // the actual response is sent in login function in auth.js file around lines 128-131
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true, // JS cannot read this cookie (XSS protection)
    secure: false, // for development only (true in production (HTTPS only))
    sameSite: "strict", // blocks cross-site requests (CSRF protection)
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
  });

  return accessToken;
}

module.exports = { generateToken };
