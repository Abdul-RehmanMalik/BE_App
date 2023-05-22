import User from "../models/User";
import { RequestUser } from "../types/RequestUser";

export const verifyTokenInDB = async (
  id: Number,
  token: string
): Promise<RequestUser | undefined> => {
  const dbUser = await User.findOne({ id });
  if (!dbUser) {
    return undefined;
  }
  if (
    dbUser.tokens.accessToken === token ||
    dbUser.tokens.refreshToken === token||
    dbUser.tokens.activationToken===token
  ) {
    return {
      id: dbUser.id,
    };
  }

  return undefined;
};
