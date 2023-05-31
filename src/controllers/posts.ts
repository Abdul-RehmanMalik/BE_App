import { PostPayload } from "../models/Posts";
import { Route,Put,Tags,Post,Body,Request} from "tsoa";
import Posts from "../models/Posts";
import { UserRequest } from "../types/UserRequest";
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
@Put('/like')
public async likePost(
@Body() body: { postId: string; userId: string }
): Promise<PostResponse> {
  try {
    const { postId, userId } = body;
    const response = await Posts.findByIdAndUpdate(
      postId,
      { $push: { likes: userId } },
      { new: true }
    );
   // return response;
  } catch (error: any) {
    
    throw error;
  }
}
@Put('/unlike')
public async unlikePost(
@Body() body: { postId: string; userId: string }
): Promise<PostResponse> {
  try {
    const { postId, userId } = body;
    const response = await Posts.findByIdAndUpdate(
      postId,
      { $pull: { likes: userId } },
      { new: true }
    );
    //return response
} catch (error: any) {
    
    throw error;
  }
}
public async addComment(
    @Request() request: UserRequest,
    @Body() body: {postId: string; text: string}
    ): Promise<PostResponse> {
    try {
      const { postId, text } = body;
      const comment = {
        text,
        postedBy: request.user,
      };
      const result = await Posts.findByIdAndUpdate(
        postId,
        { $push: { comments: comment } },
        { new: true }
      )
        .populate('comments.postedBy', '_id name')
        .populate('postedBy', '_id name')
        .exec();
      return result;
    } catch (error: any) {
      throw error;
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
    likes: string[]
  }