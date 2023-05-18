import mongoose, { Document, Schema } from "mongoose";

interface PostDocument extends Document {
  title: string;
  description: string;
  image: string;
  date: Date;
}

const postSchema = new Schema<PostDocument>({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<PostDocument>("Post", postSchema);
