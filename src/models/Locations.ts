import mongoose, { Document, Schema } from "mongoose";

interface LocationDocument extends Document {
  description: string;
  rating: number;
}

const locationSchema = new Schema<LocationDocument>({
  description: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
});

export default mongoose.model<LocationDocument>("Location", locationSchema);
