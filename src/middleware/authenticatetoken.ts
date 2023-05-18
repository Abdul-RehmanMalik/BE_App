import { NextFunction, RequestHandler, Request, Response } from "express";
import { verifyTokenInDB } from "../util/verifyTokensInDB";
import jwt from "jsonwebtoken";
import { UserRequest } from "../types/UserRequest";
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
  req: UserRequest,
  res: Response,
  next: NextFunction,
  key: string
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];
  try {
    if (!token) {
      throw "Unauthorized";
    }
    const data: any = jwt.verify(token, key);

    const user = await verifyTokenInDB(data?.id, token);

    if (!user) {
      throw "Unauthorized";
    }
    req.user = user;
    return next();
  } catch (error) {
    res.sendStatus(401);
  }
};
