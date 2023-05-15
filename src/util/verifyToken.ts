import User from "../models/User";
import { RequestUser } from "../types/RequestUser";

export const verifyTokenInDB = async (
  userId: string,
  token: string
): Promise<RequestUser | undefined> => {
  const dbUser = await User.findOne({ _id: userId });
  if (!dbUser) {
    return undefined;
  }
  let currentTokenObj;
  if (
    dbUser.tokens.accessToken === token ||
    dbUser.tokens.refreshToken === token
  ) {
    currentTokenObj = token;
  }

  if (!currentTokenObj) return undefined;
  else {
    return {
      userId: dbUser._id,
    };
  }
};
