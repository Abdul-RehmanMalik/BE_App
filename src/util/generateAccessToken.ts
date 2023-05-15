import jwt from "jsonwebtoken";
export const generateAccessTokenken = (userId: string) =>
  jwt.sign({ userId }, process.env.JWT_SECRET_ACCESS!, {});
