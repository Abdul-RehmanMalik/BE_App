import express from "express";
import authRouter from "./auth";
import userRouter from "./users";
import swaggerUi from "swagger-ui-express";
import sessionRouter from "./session";
import postRouter from "./posts";
const router = express.Router();
//auth route
router.use("/auth", authRouter);
// user route
router.use("/user", userRouter);
//session route
router.use("/session",sessionRouter);
//post router
router.use("/posts",postRouter);

router.use(
  "/",
  swaggerUi.serve,
  swaggerUi.setup(undefined, {
    swaggerOptions: {
      url: "/swagger.yaml",
    },
  })
);

export default router;
