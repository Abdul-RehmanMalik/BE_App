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
import { Request as ExpressRequest } from 'express'

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
      const {
        title,
        description,
        postedBy,
        location,
        heritage,
        placesToVisit,
        communityAccess,
        easeOfTransportation,
        safety,
        cost,
      } = body
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
        location,
        heritage,
        placesToVisit,
        communityAccess,
        easeOfTransportation,
        safety,
        cost,
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
  //edit post
  // delete post
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
      const user = await User.findOne({ id: userId })
      if (!user) {
        throw {
          code: 404, // 404 means not found
          message: 'User not found.',
        }
      }
      if (!post.likes.includes(user._id)) {
        post.likes.push(user._id)
      } else {
        const index = post.likes.indexOf(user._id)
        if (index !== -1) {
          post.likes.splice(index, 1)
        }
      }
      await post.save()
      return 'Post Liked/Unliked'
    } catch (error: any) {
      throw error
    }
  }
  //Please  ignore comments for now.
  // @Post('/search')
  // public async search(
  //   @Body() body: { query: string }
  // ): Promise<getPostResponse[]> {
  //   const { query } = body
  //   const posts: getPostResponse[] = await Posts.find({
  //     $or: [
  //       { title: { $regex: query, $options: 'i' } },
  //       { description: { $regex: query, $options: 'i' } },
  //       { location: { $regex: query, $options: 'i' } },
  //     ],
  //   })
  //   if (posts.length === 0) {
  //     throw {
  //       code: 404, // 404 means not found
  //       message: 'No Posts Found.',
  //     }
  //   }
  //   return posts
  // }
  @Post('/search')
  public async search(
    @Body() body: { query: string }
  ): Promise<getPostResponse[]> {
    const { query } = body

    const posts: getPostResponse[] = await Posts.aggregate([
      {
        $match: {
          $or: [
            { title: { $regex: query, $options: 'i' } },
            { description: { $regex: query, $options: 'i' } },
            { location: { $regex: query, $options: 'i' } },
          ],
        },
      },
      {
        $addFields: {
          titleMatch: {
            $cond: [
              { $regexMatch: { input: '$title', regex: query, options: 'i' } },
              1,
              0,
            ],
          },
        },
      },
      {
        $sort: {
          titleMatch: -1,
        },
      },
    ])

    if (posts.length === 0) {
      throw {
        code: 404, // 404 means not found
        message: 'No Posts Found.',
      }
    }

    return posts
  }
  //Please  ignore comments for now.
  // @Get('/getall')
  // public async getAllPosts(
  //   @Request() req: Express.Request
  // ): Promise<getPostResponse[]> {
  //   try {
  //     const postResponses: getPostResponse[] = await Posts.find()
  //       .select({
  //         _id: 0,
  //         pid: 1,
  //         title: 1,
  //         description: 1,
  //         images: 1,
  //         postedBy: 1,
  //       })
  //       .populate({
  //         path: 'postedBy',
  //         select: 'id name profilePicture',
  //       })

  //     console.log(postResponses)
  //     return postResponses
  //   } catch (error) {
  //     throw error
  //   }
  // }
  @Get('/getall')
  public async getAllPosts(
    @Request() req: ExpressRequest
  ): Promise<paginationResponse> {
    try {
      const page = parseInt(req.query.page as string) || 1
      const limit = parseInt(req.query.limit as string) || 2 //limit of posts per page
      const skip = (page - 1) * limit

      const totalPosts = await Posts.countDocuments()

      const postResponses: getPostResponse[] = await Posts.find()
        .select({
          _id: 0,
          pid: 1,
          title: 1,
          description: 1,
          images: 1,
          postedBy: 1,
        })
        .populate({
          path: 'postedBy',
          select: 'id name profilePicture',
        })
        .skip(skip)
        .limit(limit)
        .lean()

      const totalPages = Math.ceil(totalPosts / limit)

      const response = {
        page,
        limit,
        totalPages,
        totalPosts,
        data: postResponses,
      }

      console.log(response)
      return response
    } catch (error) {
      console.log('error:', error)
      throw error
    }
  }
  @Get('/getuserposts')
  public async findPostsByUserId(
    @Query('userId') userId: number
  ): Promise<getPostResponse[]> {
    try {
      const user = await User.findOne({ id: userId })
      if (!user) {
        throw {
          code: 404, // 404 means not found
          message: 'User not found.',
        }
      }
      // console.log('user:', user)
      const posts: getPostResponse[] = await Posts.find({
        postedBy: user._id,
      })
        .select({
          _id: 0,
          pid: 1,
          title: 1,
          description: 1,
          images: 1,
          postedBy: 1,
        })
        .populate({
          path: 'postedBy',
          select: 'id name profilePicture',
        })

      console.log('posts')
      return posts
    } catch (error) {
      console.log('error:', error)

      throw error
    }
  }
  @Post('/addComment')
  public async addComment(
    @Body()
    body: {
      pid: number
      text: string
      userId: number
    }
  ): Promise<CommentResponse> {
    try {
      const { userId, pid, text } = body
      console.log('Body:', body)
      const user = await User.findOne({ id: userId })
      if (!user) {
        throw {
          code: 404, // 404 means not found
          message: 'User not found.',
        }
      }
      const comment = {
        cid: await getSequenceNextValue('cid'),
        commentedBy: user._id,
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
      console.log('Error:', error)
      throw error
    }
  }
  @Get('/getcomments')
  public async getComments(
    @Query('postId') postId: number
  ): Promise<getCommentResponse[]> {
    try {
      const post: getCommentResponse[] | null = await Posts.findOne({
        pid: postId,
      })
        .select({ _id: 0, comments: 1 })
        .populate({
          path: 'comments.commentedBy',
          select: 'id name profilePicture',
        })

      if (!post) {
        throw {
          code: 404, // 404 means not found
          message: 'Post not found.',
        }
      }
      return post
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

  postedBy: {
    _id: string
    id: number
    name: string
    profilePicture: string
  }
}
interface paginationResponse {
  page: number
  limit: number
  totalPages: number
  totalPosts: number
  data: getPostResponse[]
}
interface getCommentResponse {
  cid: number
  commentedBy: {
    id: number
    name: string
    profilePicture: string
  }
  text: string
}
