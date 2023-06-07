import { PostPayload } from '../models/Posts'
import {
  Get,
  Route,
  Put,
  Tags,
  Post,
  Body,
  Request,
  Query,
  Delete,
  Path,
} from 'tsoa'
import Posts, { PostDocument } from '../models/Posts'
import cloudinary from '../util/cloudinaryConfig'
import { getSequenceNextValue } from '../util/getSequenceNextValue'
import User from '../models/User'
@Route('/posts')
@Tags('Post')
export class PostController {
  @Post('/createpost')
  public async createPost(
    @Request() req: Express.Request,
    @Body() body: PostPayload
  ): Promise<PostResponse | string> {
    try {
      const { title, description, postedBy } = body
      const imageUrls: string[] = []

      const files = req.files as Express.Multer.File[]

      const uploadPromises = files.map(async (file: Express.Multer.File) => {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'Posts',
        })
        imageUrls.push(result.secure_url)
      })

      await Promise.all(uploadPromises)

      const newPost = new Posts({
        title,
        description,
        images: imageUrls,
        date: new Date(),
        postedBy: {
          userId: postedBy.userId,
          username: postedBy.username,
          profilePicture: postedBy.profilePicture,
        },
      })

      await newPost.save()
      console.log('Posted Successfully')

      return 'Posted Successfully'
    } catch (error: any) {
      throw error
    }
  }

  @Put('/like')
  public async likePost(
    @Body() body: { pid: number; userId: number }
  ): Promise<PostResponse> {
    try {
      const { pid, userId } = body
      console.log('Body:', body)
      const post = await Posts.findOne({ pid })
      if (!post) {
        throw {
          code: 404, // 404 means not found
          message: 'Post not found.',
        }
      }
      if (!post.likes.includes(userId)) {
        post.likes.push(userId)
        await post.save()
      }
      return post
    } catch (error: any) {
      throw error
    }
  }
  @Put('/unlike')
  public async unlikePost(
    @Body() body: { pid: number; userId: number }
  ): Promise<PostResponse> {
    try {
      const { pid, userId } = body
      const post = await Posts.findOne({ pid })
      if (!post) {
        throw {
          code: 404, // 404 means not found
          message: 'Post not found.',
        }
      }
      const index = post.likes.indexOf(userId)
      if (index !== -1) {
        post.likes.splice(index, 1)
      }
      await post.save()

      return post
    } catch (error: any) {
      throw error
    }
  }
  @Get('/getall')
  public async getAllPosts(
    @Request() req: Express.Request
  ): Promise<PostDocument[]> {
    try {
      const postArray: PostDocument[] = await Posts.find().exec()
      console.log(postArray)
      return postArray
    } catch (error) {
      throw error
    }
  }
  @Post('/addComment')
  public async addComment(
    @Body()
    body: {
      pid: number
      text: string
      commentedBy: {
        userId: number
        profilePicture: string
        username: string
      }
    }
  ): Promise<CommentResponse> {
    try {
      const { commentedBy, pid, text } = body
      console.log('Body:', body)
      const comment = {
        cid: await getSequenceNextValue('cid'),
        commentedBy: commentedBy,
        text: text,
      }
      console.log('Comment:', comment)
      console.log('pid:', pid)
      const post = await Posts.findOne({ pid })
      if (!post) {
        throw {
          code: 404, // 404 means not found
          message: 'Post not found.',
        }
      }
      post.comments.push(comment)
      await post.save()
      console.log({ comments: [comment] })
      return { comments: [comment] }
    } catch (error: any) {
      throw error
    }
  }
  @Get('/getcomments')
  public async getComments(
    @Query('postId') postId: number
  ): Promise<CommentResponse> {
    try {
      const post: PostDocument | null = await Posts.findOne({ pid: postId })

      if (!post) {
        throw {
          code: 404, // 404 means not found
          message: 'Post not found.',
        }
      }

      const comments = post.comments
      return { comments }
    } catch (error) {
      console.error('Error fetching comments:', error)
      throw error
    }
  }
  @Delete('/deletecomment/:cid')
  public async deleteComment(@Path('cid') cid: number): Promise<void> {
    try {
      const post = await Posts.findOne({ 'comments.cid': cid })
      if (!post) {
        throw {
          code: 404, // 404 means not found
          message: 'Comment not found.',
        }
      }

      const commentIndex = post.comments.findIndex(
        (comment) => comment.cid === cid
      )
      if (commentIndex === -1) {
        throw {
          code: 404, // 404 means not found
          message: 'Comment not found.',
        }
      }

      post.comments.splice(commentIndex, 1)
      console.log('Comment deleted SuccessFully')
      await post.save()
    } catch (error: any) {
      throw error
    }
  }
  @Put('/editcomment/:cid')
  public async editComment(
    @Path('cid') cid: number,
    @Body()
    body: {
      text: string
    }
  ): Promise<CommentResponse> {
    try {
      const { text } = body
      const post = await Posts.findOne({ 'comments.cid': cid })
      if (!post) {
        throw {
          code: 404, // 404 means not found
          message: 'Comment not found.',
        }
      }

      const commentIndex = post.comments.findIndex(
        (comment) => comment.cid === cid
      )
      if (commentIndex === -1) {
        throw {
          code: 404, // 404 means not found
          message: 'Comment not found.',
        }
      }

      post.comments[commentIndex].text = text
      await post.save()
      console.log('Comment updated successfully')

      return { comments: [post.comments[commentIndex]] }
    } catch (error: any) {
      throw error
    }
  }
}

interface PostResponse {
  /**
   * Post Response
   * @example "title: abc, description: some description of a post"
   */
  pid: number
  title: string
  description: string
  likes: number[]
  comments: Array<{
    cid: number
    commentedBy: {
      userId: number
      profilePicture: string
      username: string
    }
    text: string
  }>
}
interface CommentResponse {
  comments: Array<{
    cid: number
    commentedBy: {
      userId: number
      profilePicture: string
      username: string
    }
    text: string
  }>
}
interface FileUpload {
  fieldname: string
  originalname: string
  encoding: string
  mimetype: string
  destination: string
  filename: string
  path: string
  size: number
}
