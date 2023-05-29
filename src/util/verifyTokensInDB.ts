import User from "../models/User";
import { RequestUser } from "../types/RequestUser";

export const verifyTokenInDB = async (
  id: Number,
  token: string,
  tokenType: 'accessToken'|'refreshToken'|'activationToken'|'passwordResetToken',
  //tokenType: string
): Promise<RequestUser | undefined> => {
  const dbUser = await User.findOne({ id });
  if (!dbUser) {
    return undefined;
  }
    if (dbUser.tokens.hasOwnProperty(tokenType) && dbUser.tokens[tokenType] === token)
    {
    return {
      id: dbUser.id,
      name: dbUser.name,
      isActivated: dbUser.isActivated,
    };
  }
  return undefined;
};
