import User from "../models/User";

export const removeTokensInDB = async (id: Number) => {
  const user = await User.findOne({ id });
  if (!user) {
    throw "User not Found";
  }
  user.set("tokens", undefined);
  await user.save();
  return user;
};
