import express from "express";
import authRouter from "./auth";
import userRouter from "./users";
import swaggerUi from "swagger-ui-express";
const router = express.Router();
//auth route
router.use("/auth", authRouter);
// user route
router.use("/user", userRouter);
router.use(
  "/",
  swaggerUi.serve,
  swaggerUi.setup(undefined, {
    swaggerOptions: {
      url: "/swagger.yaml",
    },
  })
);
console.log("in router");
export default router;
