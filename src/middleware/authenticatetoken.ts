import { NextFunction, RequestHandler, Request, Response } from "express";
import { verifyTokenInDB } from "../util/verifyToken";
import jwt from "jsonwebtoken";
//authenticateAccessToken
export const authenticateAccessToken: RequestHandler = async (
  req,
  res,
  next
) => {
  await authenticateToken(req, res, next, process.env.JWT_SECRET_ACCESS || "");
};
//authenticateRefreshToken
export const authenticateRefreshToken: RequestHandler = async (
  req,
  res,
  next
) => {
  await authenticateToken(req, res, next, process.env.JWT_SECRET_ACCESS || "");
};
//authenticateToken
const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
  key: string
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split("")[1];
  try {
    if (!token) {
      throw "Unauthorized";
    }
    const data: any = jwt.verify(token, key);
    const user = await verifyTokenInDB(data?._id, token);
    if (!user) {
      throw "Unauthorized";
    }
    return next();
  } catch (error) {
    res.sendStatus(401);
  }
};
