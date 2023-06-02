import { PostPayload } from "../models/Posts";
import { UploadedFile,Route,Put,Tags,Post,Body,Request} from "tsoa";
import Posts from "../models/Posts";
import fs from 'fs';
import multer from "multer";
import { UserRequest } from "../types/UserRequest";
@Route("/posts")
@Tags("Post")
export class PostController {


@Post("/createpost")
public async createPost(
  @Request () req : Express.Request,
  @Body() body: PostPayload
): Promise<PostResponse | string> {
  try {
    const { title, description, postedBy } = body;
     const image = req.file;
     let imageBuffer: Buffer | undefined;
     if (image) {
       imageBuffer = fs.readFileSync(image.path);
     } 
    console.log("body:", image);

    const newPost = new Posts({
      title,
      description,
      image: imageBuffer,
      date: new Date(),
      postedBy,
    });

    await newPost.save();
    return "Posted Successfully";
  } catch (error: any) {
    throw error;
  }
}


@Put('/like')
public async likePost(
@Body() body: { pid: number; userId: number }
): Promise<PostResponse> {
  try {
    const { pid, userId } = body;
    const post = await Posts.findOne({pid})
    if(!post)
    {
      throw {
        code: 404, // 404 means not found
        message: "Post not found.",
      };  
      }
      if (!post.likes.includes(userId)) {
        post.likes.push(userId);
        await post.save();
      }
    return post;
  } catch (error: any) {
    
    throw error;
  }
}
@Put('/unlike')
public async unlikePost(
@Body() body: { pid: number; userId: number; }
): Promise<PostResponse> {
  try {
    const { pid, userId } = body;
    const post = await Posts.findOne({pid})
     if(!post)
     {
      throw {
        code: 404, // 404 means not found
        message: "Post not found.",
      };  
     }
     const index = post.likes.indexOf(userId);
     if (index !== -1) {
       post.likes.splice(index, 1);
     }
     await post.save();

         return post;
} catch (error: any) {
    
    throw error;
  }
}
// public async addComment(
//     @Body() body: {pid: number; text: string; postedBy: string}
//     ): Promise<PostResponse> {
//     try {
//       const { pid, text , postedBy} = body;
//       const comment = {
//         text: text,
//         postedBy: postedBy,
//       };
//       const post = await Posts.findOne({pid})
//           if(!post)
//           {
//             throw {
//               code: 404, // 404 means not found
//               message: "Post not found.",
//             };  
//           }
//           post.comments.push({
//             text: comment.text,
//             postedBy: comment.postedBy,
//           });
//       return post;
//     } catch (error: any) {
//       throw error;
//     }
//   }

}
interface PostResponse {
    /**
     * Post Response
     * @example "title: abc, description: some description of a post"
     */
    pid: number;
    title: string;
    description: string;
    likes: number[];
    comments: string[]
  }interface FileUpload {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    destination: string;
    filename: string;
    path: string;
    size: number;
  }