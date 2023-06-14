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
})

postSchema.pre('save', async function (next) {
  if (this.isNew) {
    this.pid = await getSequenceNextValue('pid')
  }
  next()
})

export default mongoose.model<PostDocument>('Post', postSchema)
