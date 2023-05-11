import mongoose, { Document, Schema } from "mongoose";

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
  name: string;
  email: string;
  password: string;
  address: string;
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
});
export default mongoose.model<UserDocument>("User", userSchema);
