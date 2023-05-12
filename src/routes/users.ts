import express from "express";
import { getUserValidation } from "../util/validation";
import { UserController } from "../controllers/users";

const userRouter = express.Router();
const userController = new UserController();
// getuser route
userRouter.get("/getuser", async (req, res) => {
  const { error, value: params } = getUserValidation(req.params);
  if (error) return res.status(400).send(error.details[0].message);
  const { username } = params;
  try {
    const response = await userController.getUser(req, username);
    res.send(response);
  } catch (err: any) {
    res.status(err.code).send(err.message);
  }
});

export default userRouter;
