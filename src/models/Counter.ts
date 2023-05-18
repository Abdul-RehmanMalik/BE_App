import mongoose, { Schema, Document } from "mongoose";

export interface CounterModel extends Document {
  id: string;
  seq: number;
}

const counterSchema = new Schema<CounterModel>({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  seq: {
    type: Number,
    required: true,
  },
});

const Counter = mongoose.model<CounterModel>("Counter", counterSchema);

export default Counter;
