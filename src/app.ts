import express from "express";
import dotenv from "dotenv";
import mongoose, { ConnectOptions } from "mongoose";
import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes";
const app = express();
dotenv.config();
// port from env file
const port = process.env.PORT;
// connect to MongoDB
(async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions);
    console.log(" Successfully Connected to MongoDB!");
  } catch (error) {
    console.error("Error!connecting to MongoDB:", error);
  }
})();
app.use(express.json());

// User router
app.use("/users", userRoutes);

// Auth router
app.use("/auth", authRoutes);

//app listening on Port
app.listen(port, () => {
  console.log("server is running on ", port);
});
