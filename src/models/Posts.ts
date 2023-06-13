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
})

postSchema.pre('save', async function (next) {
  if (this.isNew) {
    this.pid = await getSequenceNextValue('pid')
  }
  next()
})

export default mongoose.model<PostDocument>('Post', postSchema)
