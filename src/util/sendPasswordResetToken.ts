import User from "../models/User";
import { generatePasswordResetToken } from "./generatePasswordResetToken";
import { sendPasswordResetMail } from "./passwordResetmail";
export const sendPasswordResetToken = async (user : any) => {
    const passwordResetToken = generatePasswordResetToken(user.id);
    console.log("userid", user.id);
    user.tokens = {
      accessToken: "",
      refreshToken: "",
      activationToken: "",
      passwordResetToken: passwordResetToken,
    };
    await user.save();
    const passwordResetLink = `${process.env.FRONTEND_SERVER}:${process.env.FRONTEND_PORT}/resetpassword?token=${user.tokens.passwordResetToken}&id=${user.id}`;
    sendPasswordResetMail(user.email,user.name,passwordResetLink);
    return user;
  };