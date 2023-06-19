import mongoose, { Document, Schema, Model } from 'mongoose'
import { getSequenceNextValue } from '../util/getSequenceNextValue'
export interface PostPayload {
  /**
   * title of post
   * @example ""
   */
  title: string
  /**
   * description of post
   * @example ""
   */
  description: string
  /**
   * postedBy
   */
  postedBy: mongoose.Types.ObjectId
  /**
   * Image
   * @example ""
   */
  images?: string[]
  comments?: PostComment[]
  cost: number
  heritage?: string
  placesToVisit?: string[]
  communityAccess?: string
  easeOfTransportation?: string
  safety?: string
  location: string
}

export interface getPostResponse {
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
  likes: mongoose.Types.ObjectId[]
  liked?: boolean
}
export interface PostComment {
  cid: number
  commentedBy: mongoose.Types.ObjectId
  text: string
}
export interface PostCommentDocument extends Document, PostComment {}
const commentSchema = new Schema<PostCommentDocument>({
  cid: {
    type: Number,
    required: true,
  },
  commentedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  text: String,
})
export interface PostDocument extends Document {
  pid: number
  title: string
  description: string
  images?: string[]
  date: Date
  postedBy: mongoose.Types.ObjectId
  likes: mongoose.Types.ObjectId[]
  comments: PostComment[]
  cost: number
  heritage?: string
  placesToVisit?: string[]
  communityAccess?: string
  easeOfTransportation?: string
  safety?: string
  location: string
  liked: boolean
}
interface PostModel extends Model<PostDocument> {
  search(query: string): Promise<getPostResponse[]>
}
const postSchema = new Schema<PostDocument>({
  pid: {
    type: Number,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  images: [{ type: String }],
  date: {
    type: Date,
    default: Date.now,
  },
  postedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  comments: [commentSchema],
  cost: {
    type: Number,
    required: true,
  },
  heritage: {
    type: String,
  },
  placesToVisit: [
    {
      type: String,
    },
  ],
  communityAccess: {
    type: String,
  },
  easeOfTransportation: {
    type: String,
  },
  safety: {
    type: String,
  },
  location: {
    type: String,
    required: true,
  },
  liked: { type: Boolean, default: false },
})

postSchema.pre('save', async function (next) {
  if (this.isNew) {
    this.pid = await getSequenceNextValue('pid')
  }
  next()
})
postSchema.statics.search = async function (
  query: string
): Promise<getPostResponse[]> {
  const posts: getPostResponse[] = await this.aggregate([
    {
      $addFields: {
        titleMatch: {
          $cond: [
            { $regexMatch: { input: '$title', regex: query, options: 'i' } },
            8, //weight for title
            0,
          ],
        },
        descriptionMatch: {
          $cond: [
            {
              $regexMatch: {
                input: '$description',
                regex: query,
                options: 'i',
              },
            },
            5, //weight for description
            0,
          ],
        },
        locationMatch: {
          $cond: [
            {
              $regexMatch: { input: '$location', regex: query, options: 'i' },
            },
            10, //weight for location
            0,
          ],
        },
      },
    },
    {
      $addFields: {
        totalWeight: {
          $add: ['$titleMatch', '$descriptionMatch', '$locationMatch'],
        },
      },
    },
    {
      $sort: {
        totalWeight: -1,
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
export default mongoose.model<PostDocument, PostModel>('Post', postSchema)
