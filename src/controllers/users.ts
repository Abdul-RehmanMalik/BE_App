import express from 'express'
import User, { UserPayload } from '../models/User'
import {
  Route,
  Body,
  Path,
  Get,
  Request,
  Tags,
  Example,
  Query,
  Post,
  Put,
} from 'tsoa'
import cloudinary from '../util/cloudinaryConfig'
import { UserDetailsResponse } from './auth'

@Route('/user')
@Tags('User')
export class UserController {
  /**
   * @summary Get user properties - such as name, email and address.
   * @param name The User's name
   * @example name "johnSnow01"
   */
  @Example<UserDetailsResponse>({
    name: 'John Snow',
    email: 'johnSnow01@gmail.com',
    address: 'H#123 Block 2 Sector J, Abc Town, NY',
  })
  @Get('{name}')
  public async getUser(
    @Request() req: express.Request,
    @Path() name: string
  ): Promise<UserDetailsResponse> {
    // Find the user by name.
    console.log('in controller')

    const user = await User.findOne({ name })
    if (!user) {
      throw {
        code: 404, // 404 means not found
        message: 'User not found.',
      }
    }

    return {
      email: user.email,
      name: user.name,
      address: user.address,
    }
  }

  @Post('/search')
  public async searchUser(
    @Body() body: { query: string }
  ): Promise<UserSearchResponse> {
    const { query } = body
    // console.log('Query:', query)
    // if (!query) {
    //   throw {
    //     code: 400,
    //     message: 'Invalid Query',
    //   }
    // }
    const users = await User.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
        { address: { $regex: query, $options: 'i' } },
      ],
    })
    if (users.length === 0) {
      throw {
        code: 404, // 404 means not found
        message: 'No Users found.',
      }
    }
    return { users }
  }
  @Put('/updateprofilepic')
  public async updateProfilePic(
    @Request() req: Express.Request,
    @Body() body: { id: string }
  ): Promise<string> {
    try {
      const { id } = body
      const user = await User.findOne({ id })
      if (!user) {
        throw {
          code: 404, // 404 means not found
          message: 'User not found.',
        }
      }

      const profilePicture = req.file
      console.log('Profile Pic:', profilePicture)
      let imageUrl: string | null = null

      if (profilePicture) {
        const result = await cloudinary.uploader.upload(profilePicture.path, {
          folder: 'ProfilePics',
        })

        imageUrl = result.secure_url
      }

      await User.findOneAndUpdate({ id }, { profilePicture: imageUrl })
      console.log('Profile Picture Updated Successfully')

      return 'Profile Picture Updated Successfully'
    } catch (error: any) {
      throw {
        code: 500,
        message: error.message,
      }
    }
  }
}
export interface UserSearchResponse {
  users: UserDetailsResponse[]
}
export interface UserResponse {
  id: number
  name: string
  isActivated: boolean
}
