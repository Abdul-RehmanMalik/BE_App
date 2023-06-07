import mongoose, { Document, Schema } from 'mongoose'
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
  postedBy: {
    userId: string
    username: string
    profilePicture: string
  }
  /**
   * Image
   * @example ""
   */
  images?: string[]
}

export interface PostDocument extends Document {
  pid: number
  title: string
  description: string
  images?: string[]
  date: Date
  postedBy: {
    userId: string
    username: string
    profilePicture: string
  }
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
    userId: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    profilePicture: String,
  },
  likes: [{ type: Number }],
  comments: [
    {
      cid: Number,
      commentedBy: {
        userId: Number,
        profilePicture: String,
        username: String,
      },
      text: String,
    },
  ],
})

postSchema.pre('save', async function (next) {
  if (this.isNew) {
    this.pid = await getSequenceNextValue('pid')
  }
  next()
})

export default mongoose.model<PostDocument>('Post', postSchema)
