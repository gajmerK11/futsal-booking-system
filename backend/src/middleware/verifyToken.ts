import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { Request, Response, NextFunction } from "express";
import { UserPayload } from "../types/jwt";

function verifyToken(req: Request, res: Response, next: NextFunction) {
  // Step-1: Reading 'Authorization' header from request header
  const authorizationHeader = req.get("Authorization");

  // This is for 'what if request comes with no authorization header?'. So - if no header, return 401
  if (!authorizationHeader)
    return res.status(401).json({ message: "No authorization header." });

  // Step-2: Extracting token
  // Since we need only token part from the header value (which looks like this "Bearer eyJhbGciOiJIUzI1NiJ9" - a string), we are spliting it using split() function - a js function to split string
  const token = authorizationHeader.split(" ")[1];

  if (!token)
    return res.status(401).json({
      message: "Malformed authorization header.",
    });

  // Step-3: Verifying token (jwt.verify)
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    // attching the jwt payload to request so controllers on protected routes know who made the request
    req.user = decoded as UserPayload;
    // this passes request to the route (middleware standard)
    next();
  } catch (error) {
    //   If token is invalid or expired, 'jwt.verify()' throws an error - catch block handles it and sends back 401
    return res.status(401).json({ message: "Invalid or expired token." });
  }
}

export default verifyToken;
