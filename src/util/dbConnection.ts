import mongoose, { ConnectOptions } from "mongoose";
export async function connectToMongoDB() {
  await mongoose.connect(`${process.env.MONGODB_URI}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as ConnectOptions);

  console.log("Successfully Connected to MongoDB!");
}
