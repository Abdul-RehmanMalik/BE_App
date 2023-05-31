import mongoose, { Document, Schema } from "mongoose";
export interface PostPayload {
  /**
   * title of post
   * @example ""
   */
  title: string;
  /**
   * description of post
   * @example ""
   */
  description: string;
  /**
   * date of posting
   * @example ""
   */
  date: string;
    /**
   * postedBy
   * @example ""
   */
  postedBy: string;
}
interface PostDocument extends Document {
  title: string;
  description: string;
  image: string;
  date: Date;
  postedBy: Schema.Types.ObjectId;
  likes : Schema.Types.ObjectId[];
  comments: Schema.Types.ObjectId[];

}

const postSchema = new Schema<PostDocument>({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  postedBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  likes:[{ type: Schema.Types.ObjectId, ref:"User"}],
  comments:[{
      text:String,
      postedBy:{type:Schema.Types.ObjectId,
      ref:"User"}
  }],
  
});

export default mongoose.model<PostDocument>("Post", postSchema);
