import express from "express";
import authRouter from "./authRoutes";
import userRouter from "./userRoutes";
import swaggerUi from "swagger-ui-express";
const router = express.Router();
//auth route
router.use("/auth", authRouter);
// user route
router.use("/user", userRouter);

export default router;
