import jwt from "jsonwebtoken";
export const generatePasswordResetToken = (id: Number) =>
  jwt.sign({ id }, process.env.JWT_SECRET_PASSRESET!, {
    expiresIn: "2h"
  });