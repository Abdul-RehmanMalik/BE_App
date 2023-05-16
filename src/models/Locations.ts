import mongoose, { Document, Schema } from "mongoose";

interface LocationDocument extends Document {
  description: string;
  rating: number;
}

// Define the schema
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

// Create the model
export default mongoose.model<LocationDocument>("Location", locationSchema);
