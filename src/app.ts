import express from "express";
import dotenv from "dotenv";
import { connectToMongoDB } from "./util/dbConnection";
import router from "./routes/index";
import path from "path";
import cors from "cors";
const app = express();
dotenv.config();
// port from env file
const port = process.env.PORT;

app.use(express.json());
app.use(cors());

app.use(express.static(path.join(__dirname, "../public")));
//Connect to mongoDb
//this function will prevent server
//from running if DB connection fails

// router
app.use("/", router);

// app.get("/", () => {
//   console.log("app get");
// });

//app listening on Port
// app.listen(port, () => {
//   console.log("server is running on ", port);
// });
const startServer = async () => {
  try {
    await connectToMongoDB();
    app.listen(port, () => {
      console.log("Server is running on port", port);
    });
  } catch (error) {
    console.error("Failed to Connect to MongoDb", error);
  }
};
startServer();
