import jwt from "jsonwebtoken";
export const generateAccessTokenken = (id: Number) =>
  jwt.sign({ id }, process.env.JWT_SECRET_ACCESS!, {});
