import "express";
import { UserPayload } from "./jwt";

declare global {
  namespace Express {
    // This is declaration merging
    interface Request {
      user?: UserPayload;
    }
  }
}
