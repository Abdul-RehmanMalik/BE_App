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
      console.log("hi");
      throw "Unauthorized";
    }
    const data: any = jwt.verify(token, key);
    console.log(data);
    const user = await verifyTokenInDB(data?.userId, token);
    console.log(data.userId);
    if (!user) {
      console.log("hi2");
      throw "Unauthorized";
    }
    req.user = user;
    return next();
  } catch (error) {
    res.sendStatus(401);
  }
};
