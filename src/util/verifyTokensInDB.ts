import User from "../models/User";
import { RequestUser } from "../types/RequestUser";

export const verifyTokenInDB = async (
  email: string,
  token: string
): Promise<RequestUser | undefined> => {
  const dbUser = await User.findOne({ email });
  if (!dbUser) {
    console.log(email);
    console.log("in verify token user not found");

    return undefined;
  }
  if (
    dbUser.tokens.accessToken === token ||
    dbUser.tokens.refreshToken === token
  ) {
    return {
      email: dbUser.email,
    };
  }
  console.log("in verify token, token not found");

  return undefined;
};
