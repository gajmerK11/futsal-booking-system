import { Request, Response } from "express";

async function getProfile(req: Request, res: Response) {
  return res.status(200).json({
    user: req.user,
  });
}
export default getProfile;
