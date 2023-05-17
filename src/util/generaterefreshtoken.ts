import jwt from "jsonwebtoken";
export const generateRefreshToken = (userId: string) =>
  jwt.sign({ userId }, process.env.JWT_SECRET_REFRESH!, {});
