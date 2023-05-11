import express from "express";
import dotenv from "dotenv";
import { connectToMongoDB } from "./util/dbConnection";
import router from "./routes/index";
const app = express();
dotenv.config();
// port from env file
const port = process.env.PORT;

// Connect to mongoDb
connectToMongoDB();
app.use(express.json());

// router
app.use("/", router);

//app listening on Port
app.listen(port, () => {
  console.log("server is running on ", port);
});
