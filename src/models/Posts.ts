import mongoose, { Document, Schema } from "mongoose";
import { getSequenceNextValuePost } from "../util/getSeqNextValuePost";
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
   * postedBy
   * @example ""
   */
  postedBy: string;
}
interface PostDocument extends Document {
  pid: number,
  title: string;
  description: string;
  image: string;
  date: Date;
  postedBy: string;
  likes : number[];
  comments: string[];

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
  image: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  postedBy: {
    type: String,
    },
  likes:[{ type: Number}],
  comments:[{
      text:String,
      postedBy: String,
  }],
  
});
postSchema.pre("save", async function (next) {
  if (this.isNew) {
    this.pid = await getSequenceNextValuePost("pid");
  }
  next();
});
export default mongoose.model<PostDocument>("Post", postSchema);
