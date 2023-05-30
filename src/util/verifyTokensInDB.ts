import User from "../models/User";
import { RequestUser } from "../types/RequestUser";

export const verifyTokenInDB = async (
  id: Number,
  token: string,
  tokenType: 'accessToken'|'refreshToken'|'activationToken'|'passwordResetToken',
  //tokenType: string
): Promise<RequestUser | undefined> => {
  const dbUser = await User.findOne({ id });
  console.log("USerid:",id)
  console.log("DbUser:",dbUser)
  if (!dbUser) {
    return undefined;
  }
    if (dbUser.tokens.hasOwnProperty(tokenType) && dbUser.tokens[tokenType] === token)
    {
      console.log("tokenmatched")
    return {
      id: dbUser.id,
      name: dbUser.name,
      isActivated: dbUser.isActivated,
    };
  }
  return undefined;
};
