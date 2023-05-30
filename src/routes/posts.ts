import express from "express";
import { PostController } from "../controllers/posts";
import { postValidation } from "../util/validation";
const postRouter = express.Router();
const postController = new PostController();

postRouter.post("/posts/createpost", async (req, res) => {
    const { error, value: body } = postValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    try {
      const response = await postController.createPost(req.body);
      res.send(response);
    } catch (err: any) {
        res.status(err.code).send(err.message);
    }
  });