import mongoose, { Document, Schema } from "mongoose";

interface UserDocument extends Document {
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
});

const UserModel = mongoose.model<UserDocument>("User", userSchema);

export default UserModel;
