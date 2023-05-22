import express from "express";
import { AuthController } from "../controllers/auth";
import { loginValidation, signUpValidation } from "../util/validation";
import { authenticateAccessToken, authenticateActivationToken } from "../middleware/authenticatetoken";
import { RequestUser } from "../types/RequestUser";
import { UserRequest } from "../types/UserRequest";

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
//logout route
authRouter.post("/logout", authenticateAccessToken, async (req, res) => {
  try {
    const logoutResponse = await authController.logout(req);
    console.log("in auth route try");
    res.send(logoutResponse);
  } catch (err: any) {
    console.log("in auth route ,catch");
    res.status(err.code).send(err.message);
  }
});
//activation route
authRouter.post("/activate", authenticateActivationToken, async (req, res) => {
  // const { error, value: params } = getUserValidation(req.params);
  // if (error) return res.status(400).send(error.details[0].message);
  const { token,id } = req.params;
  
  try {
    const response = await authController.activateUser(req, token,id);
    res.send(response);
  } catch (err: any) {
    res.status(err.code).send(err.message);
  }
});
export default authRouter;
