import { Router } from "express";
import { createUser } from "../controllers/userController";

const router = Router();

//create a new user
router.post("/", createUser);

export default router;
