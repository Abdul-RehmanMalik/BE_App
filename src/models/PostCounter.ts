import mongoose, { Schema, Document } from "mongoose";

export interface CounterModel extends Document {
  pid: string;
  seq: number;
}

const postCounterSchema = new Schema<CounterModel>({
  pid: {
    type: String,
    required: true,
    unique: true,
  },
  seq: {
    type: Number,
    required: true,
  },
});

const PostCounter = mongoose.model<CounterModel>("PostCounter", postCounterSchema);

export default PostCounter;
