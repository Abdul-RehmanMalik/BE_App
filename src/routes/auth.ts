import express from "express";
import { AuthController } from "../controllers/auth";
import { loginValidation, signUpValidation } from "../util/validation";

const authRouter = express.Router();
const authController = new AuthController();
// Signup route
authRouter.post("/signup", async (req, res) => {
  const { error, value: body } = signUpValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  try {
    const response = await authController.signUp(body);
    res.send(response);
  } catch (err: any) {
    res.status(err.code).send(err.message);
  }
});
// Login route
authRouter.post("/login", async (req, res) => {
  const { error, value: body } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  try {
    const response = await authController.login(body);
    res.send(response);
  } catch (err: any) {
    res.status(err.code).send(err.message);
  }
});

export default authRouter;
