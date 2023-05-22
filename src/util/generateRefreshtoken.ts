import jwt from "jsonwebtoken";
export const generateRefreshToken = (id: Number) =>
  jwt.sign({ id }, process.env.JWT_SECRET_REFRESH!, {});
