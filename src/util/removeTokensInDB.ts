import User from "../models/User";

export const removeTokensInDB = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw "User not Found";
  }
  user.set("tokens", undefined);
  await user.save();
  console.log("in removetoken from db");
  return user;
};
