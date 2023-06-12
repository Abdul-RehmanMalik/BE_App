import { PostComment, PostPayload } from '../models/Posts'
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
import mongoose from 'mongoose'
import cloudinary from '../util/cloudinaryConfig'
import { getSequenceNextValue } from '../util/getSequenceNextValue'
import User from '../models/User'
import { Readable } from 'stream'

@Route('/posts')
@Tags('Post')
export class PostController {
  @Post('/createpost')
  public async createPost(
    @Request() req: Express.Request,
    @Body() body: PostPayload
  ): Promise<PostResponse | string> {
    try {
      console.log('Body in controller:', body)
      const { title, description, postedBy } = body
      const imageUrls: string[] = []
      const user = await User.findOne({ id: postedBy })
      if (!user) {
        throw {
          code: 404, // 404 means not found
          message: 'User not found.',
        }
      }
      const files = req.files as Express.Multer.File[]
      //console.log('file:', files)
      const uploadPromises = files.map((file: Express.Multer.File) => {
        return new Promise<string>((resolve, reject) => {
          const cld_upload_stream = cloudinary.uploader.upload_stream(
            { folder: 'Posts' },
            (error: any, result: any) => {
              if (result && result.secure_url) {
                resolve(result.secure_url)
              } else {
                reject(error)
              }
            }
          )

          const fileStream = new Readable()
          fileStream.push(file.buffer)
          fileStream.push(null)

          fileStream.pipe(cld_upload_stream)
        })
      })

      // await Promise.all(uploadPromises)
      const uploadedImageUrls = await Promise.all(uploadPromises)
      imageUrls.push(...uploadedImageUrls)
      const newPost = new Posts({
        title,
        description,
        images: imageUrls,
        date: new Date(),
        postedBy: user._id,
        comments: [],
      })
      console.log('New Post', newPost)
      await newPost.save()
      console.log('Posted Successfully')

      return 'Posted Successfully'
    } catch (error: any) {
      console.log(error)
      throw error
    }
  }

  @Put('/like')
  public async likePost(
    @Body() body: { pid: number; userId: number }
  ): Promise<PostResponse | string> {
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
      return 'Post Liked'
    } catch (error: any) {
      throw error
    }
  }
  @Put('/unlike')
  public async unlikePost(
    @Body() body: { pid: number; userId: number }
  ): Promise<PostResponse | string> {
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

      return 'Post Unliked'
    } catch (error: any) {
      throw error
    }
  }
  // @Get('/getall')
  // public async getAllPosts(
  //   @Request() req: Express.Request
  // ): Promise<PostDocument[]> {
  //   try {
  //     const postArray: PostDocument[] = await Posts.find().exec()
  //     console.log(postArray)
  //     return postArray
  //   } catch (error) {
  //     throw error
  //   }
  // }
  @Get('/getall')
  public async getAllPosts(
    @Request() req: Express.Request
  ): Promise<getPostResponse[]> {
    try {
      const posts: PostDocument[] = await Posts.find().exec()
      const postResponses: getPostResponse[] = []

      for (const post of posts) {
        const user = await User.findById(post.postedBy).exec()

        if (user) {
          const postResponse: getPostResponse = {
            pid: post.pid,
            title: post.title,
            description: post.description,
            images: post.images,
            user: {
              userId: user.id,
              name: user.name,
              profilePicture: user.profilePicture,
            },
          }

          postResponses.push(postResponse)
        }
      }

      console.log(postResponses)
      return postResponses
    } catch (error) {
      throw error
    }
  }
  @Get('/getuserposts')
  public async findPostsByUserId(
    @Query('userId') userId: number
  ): Promise<PostDocument[]> {
    try {
      const posts: PostDocument[] = await Posts.find({
        'postedBy.userId': userId,
      }).exec()
      console.log(posts)
      return posts
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
      commentedBy: mongoose.Types.ObjectId
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
      const commentResponse: CommentResponse = {
        cid: comment.cid,
        commentedBy: comment.commentedBy,
        text: comment.text,
      }
      return commentResponse
    } catch (error: any) {
      throw error
    }
  }
  @Get('/getcomments')
  public async getComments(
    @Query('postId') postId: number
  ): Promise<CommentResponse[]> {
    try {
      const post: PostDocument | null = await Posts.findOne({ pid: postId })

      if (!post) {
        throw {
          code: 404, // 404 means not found
          message: 'Post not found.',
        }
      }

      const comments: CommentResponse[] = post.comments.map((comment) => ({
        cid: comment.cid,
        commentedBy: comment.commentedBy,
        text: comment.text,
      }))

      return comments
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
        (comment: PostComment) => comment.cid === cid
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
        (comment: PostComment) => comment.cid === cid
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

      const updatedComment: CommentResponse = {
        cid: post.comments[commentIndex].cid,
        commentedBy: post.comments[commentIndex].commentedBy,
        text: post.comments[commentIndex].text,
      }

      return updatedComment
    } catch (error: any) {
      throw error
    }
  }
}

interface PostResponse {
  /**
   * Post ID
   * @example 1
   */
  pid: number
  /**
   * Post title
   * @example "Title of the post"
   */
  title: string
  /**
   * Post description
   * @example "Description of the post"
   */
  description: string
  /**
   * Array of user IDs who liked the post
   * @example [1, 2, 3]
   */
  likes: number[]
  /**
   * Array of comments on the post
   */
  comments: CommentResponse[]
  postedBy: mongoose.Types.ObjectId
}
interface CommentResponse {
  /**
   * Comment ID
   * @example 1
   */
  cid: number
  /**
   * User who made the comment
   * @example { userId: "user1", profilePicture: "https://example.com/user1.jpg", username: "user1" }
   */
  commentedBy: mongoose.Types.ObjectId
  /**
   * Comment text
   * @example "This is a comment"
   */
  text: string
}
interface getPostResponse {
  pid: number
  title: string
  description: string
  images?: string[]

  user: {
    userId: number
    name: string
    profilePicture: string
  }
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
