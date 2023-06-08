import mongoose, { Document, Schema } from 'mongoose'
import { getSequenceNextValue } from '../util/getSequenceNextValue'
import Comments from './Comments'

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
  postedBy: Schema.Types.ObjectId
  /**
   * Image
   * @example ""
   */
  images?: string[]
  comments: Comment[]
}

export interface PostDocument extends Document {
  pid: number
  title: string
  description: string
  images?: string[]
  date: Date
  postedBy: Schema.Types.ObjectId
  likes: number[]
  comments: Comment[]
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
  likes: [{ type: Number }],
  comments: [Comments],
})

postSchema.pre('save', async function (next) {
  if (this.isNew) {
    this.pid = await getSequenceNextValue('pid')
  }
  next()
})

export default mongoose.model<PostDocument>('Post', postSchema)
