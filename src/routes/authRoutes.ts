import { Router } from "express";
import { login, createUser } from "../controllers/authController";

const authRouter = Router();
// login route
authRouter.post("/login", login);
// SignUp route
authRouter.post("/signup", createUser);

export default authRouter;
