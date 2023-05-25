import express from "express";
import { AuthController } from "../controllers/auth";
import { forgotPasswordValidation, loginValidation, resetPasswordValidation, signUpValidation } from "../util/validation";
import { authenticateAccessToken, authenticateActivationToken, authenticatePasswordResetToken } from "../middleware/authenticatetoken";

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
  
  const token= String(req.query.token);
  const id= String(req.query.id)

  try {
    console.log("in auth route try");

    const response = await authController.activateUser(req, token,id);
    //res.redirect("");
    res.send(response);
  } catch (err: any) {
    console.log("in auth route ,catch");

    res.status(err.code).send(err.message);
  }
});
//reset password
authRouter.post("/resetpassword", authenticatePasswordResetToken, async (req, res) => {
  const { token,id } = req.query;
  const token_= String(token);
  const id_ = String(id)
  const { error, value: body } = resetPasswordValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message)
  try {
    console.log("in auth route try");
    const response = await authController.resetPassword(body);
    //res.redirect("");
    res.send(response);
  } catch (err: any) {
    console.log("in auth route ,catch");
    res.status(err.code).send(err.message);
  }
});
//forgot password
authRouter.post("/forgotpassword", async (req, res) => {
  const { error, value: body } = forgotPasswordValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  try {
    const response = await authController.forgotPassword(body);
    res.send(response);
  } catch (err: any) {
    res.status(err.code).send(err.message);
  }
});
export default authRouter;