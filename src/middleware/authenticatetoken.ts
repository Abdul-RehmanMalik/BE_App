import { NextFunction, RequestHandler, Request, Response } from "express";
import { verifyTokenInDB } from "../util/verifyTokensInDB";
import jwt from "jsonwebtoken";
import { UserRequest } from "../types/UserRequest";
enum TokenType {
  AccessToken = 'accessToken',
  RefreshToken = 'refreshToken',
  ActivationToken = 'activationToken',
  PasswordResetToken = 'passwordResetToken',
}
//authenticateAccessToken
export const authenticateAccessToken: RequestHandler = async (
  req,
  res,
  next
) => {
  await authenticateToken(req, res, next, process.env.JWT_SECRET_ACCESS || "",TokenType.AccessToken);
};
//authenticateRefreshToken
export const authenticateRefreshToken: RequestHandler = async (
  req,
  res,
  next
) => {
  await authenticateToken(req, res, next, process.env.JWT_SECRET_REFRESH || "",TokenType.RefreshToken);
};
//
export const authenticateActivationToken: RequestHandler = async (
  req,
  res,
  next
) => {
  await authActivationToken(req, res, next, process.env.JWT_SECRET_VERIFICATION|| "",TokenType.ActivationToken);
};
export const authenticatePasswordResetToken: RequestHandler = async (
  req,
  res,
  next
) => {
  await authPasswordResetToken(req, res, next, process.env.JWT_SECRET_PASSRESET|| "",TokenType.PasswordResetToken);
};
//authenticateToken
const authenticateToken = async (
  req: UserRequest,
  res: Response,
  next: NextFunction,
  key: string,
  tokenType:TokenType
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];
  try {
    if (!token) {
      throw "Unauthorized";
    }
    const data: any = jwt.verify(token, key);

    const user = await verifyTokenInDB(data?.id, token,tokenType);

    if (!user) {
      throw "Unauthorized";
    }
    req.user = user;
    return next();
  } catch (error) {
    res.sendStatus(401);
  }
};
 const authActivationToken = async (
  req: UserRequest,
  res: Response,
  next: NextFunction,
  key: string,
  tokenType: TokenType

) => {
  const {token,id}= req.body;
  console.log("token:",token,"id:",id);
  console.log("token:",token,"id:",id);

  try {
    if (!token) {
      throw "Unauthorized";
    }    
    const user = await verifyTokenInDB(id,token,tokenType);
    if (!user) {
      throw "Unauthorized";
    }
    req.user = user;
    return next();
  } catch (error) {
    res.sendStatus(401);
  }
};
const authPasswordResetToken = async (
  req: UserRequest,
  res: Response,
  next: NextFunction,
  key: string,
  tokenType: TokenType
) => {
    const {token,id}= req.body;
    console.log("token:",token,"id:",id);

  try {
    if (!token) {
      throw "Unauthorized";
    }    
    const data: any = jwt.verify(token, key);
    const user = await verifyTokenInDB(data?.id, token,tokenType);
    if (!user) {
      throw "Unauthorized";
    }
    req.user = user;
    return next();
  } catch (error) {
    res.sendStatus(401);
  }
};