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

// Connect to mongoDb
connectToMongoDB();
app.use(express.json());
app.use(cors());
// router
app.use("/", router);
// app.get("/", () => {
//   console.log("app get");
// });
app.use(express.static(path.join(__dirname, "../public")));
//app listening on Port
app.listen(port, () => {
  console.log("server is running on ", port);
});
