import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcrypt";

export interface UserPayload {
  /**
   * name for user
   * @example "John Snow"
   */
  name: string;
  /**
   * email for user
   * @example "johnSnow01@gmail.com"
   */
  email: string;
  /**
   * Password for user
   */
  password: string;
  /**
   * address for user
   * @example "H#123 Block 2 Sector J, Abc Town, NY"
   */
  address: string;
}
interface UserDocument extends UserPayload, Document {
  tokens: { accessToken: string; refreshToken: string };
}

const userSchema = new Schema<UserDocument>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  tokens: {
    accessToken: { type: String },
    refreshToken: { type: String },
  },
});
export class PasswordUtils {
  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  }
  static async comparePassword(
    password: string,
    user_password: string
  ): Promise<boolean> {
    const isPasswordValid = await bcrypt.compare(password, user_password);

    return isPasswordValid;
  }
}
export default mongoose.model<UserDocument>("User", userSchema);
