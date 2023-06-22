import mongoose, { Document, Schema } from 'mongoose'
import bcrypt from 'bcrypt'
import { getSequenceNextValue } from '../util/getSequenceNextValue'

export interface UserPayload {
  /**
   * name for user
   * @example "John Snow"
   */
  name: string
  /**
   * email for user
   * @example "johnSnow01@gmail.com"
   */
  email: string
  /**
   * Password for user
   */
  password: string
  /**
   * address for user
   * @example "H#123 Block 2 Sector J, Abc Town, NY"
   */
  address: string
}
export interface UserDetailsResponse {
  email: string
  name: string
  address: string
  profilePicture: string
}
interface UserDocument extends UserPayload, Document {
  tokens: {
    accessToken: string
    refreshToken: string
    activationToken: string
    passwordResetToken: string
  }
  isActivated: boolean
  profilePicture: string
}

const userSchema = new Schema<UserDocument>({
  name: {
    type: String,
    required: true,
  },
  id: {
    type: Number,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String,
    default:
      'https://res.cloudinary.com/dwvqftxep/image/upload/v1687425425/ProfilePics/user_fo89ku.png',
  },
  tokens: {
    accessToken: { type: String },
    refreshToken: { type: String },
    activationToken: { type: String },
    passwordResetToken: { type: String },
  },
  isActivated: {
    type: Boolean,
  },
})

//Hooks

userSchema.pre('save', async function (next) {
  if (this.isNew) {
    this.id = await getSequenceNextValue('id')
  }
  next()
})
export class PasswordUtils {
  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)
    return hashedPassword
  }
  static async comparePassword(
    password: string,
    user_password: string
  ): Promise<boolean> {
    const isPasswordValid = await bcrypt.compare(password, user_password)

    return isPasswordValid
  }
}

export default mongoose.model<UserDocument>('User', userSchema)
