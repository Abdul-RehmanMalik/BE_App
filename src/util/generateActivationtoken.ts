import jwt from "jsonwebtoken";
export const generateActivationToken = (id: Number) =>
  jwt.sign({ id }, process.env.JWT_SECRET_VERIFICATION!, {    
    expiresIn: "2h"
  });