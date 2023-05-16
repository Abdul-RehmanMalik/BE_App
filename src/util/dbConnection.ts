import mongoose, { ConnectOptions } from "mongoose";
const { AutoIncrementFactory } = require("mongodb-autoincrement");
export async function connectToMongoDB() {
  await mongoose.connect(`${process.env.MONGODB_URI}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as ConnectOptions);
  // const autoIncrementFactory = AutoIncrementFactory.createInstance(
  //   mongoose.connection.db,
  //   {
  //     field: "userId",
  //     collectionName: "users",
  //   }
  // );

  console.log("Successfully Connected to MongoDB!");
}
