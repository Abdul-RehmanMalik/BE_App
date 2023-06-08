import mongoose, { Schema } from 'mongoose'
export interface Comment {
  cid: number
  commentedBy: Schema.Types.ObjectId
  text: string
}
const commentSchema = new Schema<Comment>({
  cid: {
    type: Number,
    required: true,
    unique: true,
  },
  commentedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  text: String,
})
export default mongoose.model('Comments', commentSchema)
