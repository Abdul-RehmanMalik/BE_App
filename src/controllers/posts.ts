import express from "express";
import { PostPayload } from "../models/Posts";
import { Route, Path, Get, Request, Tags, Example , Post,Body} from "tsoa";
import Posts from "../models/Posts";
@Route("/posts")
@Tags("Post")
export class PostController {

@Post("/createpost")
public async createPost (
@Body() body: PostPayload
) : Promise<PostResponse | string> 
{
    try {
        const { title, description, date, postedBy } = body;
        const newPost = new Posts ({
           title,
           description,
           date: new Date(date),
           postedBy
        });
        await newPost.save();
        return "Posted Successfully"

    }catch(error: any)
    {
        throw error
    }

}

}
interface PostResponse {
    /**
     * Post Response
     * @example "title: abc, description: some description of a post"
     */
    title: string;
    description: string;
  }