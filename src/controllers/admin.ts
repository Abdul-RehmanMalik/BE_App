import User, { PasswordUtils, UserDetailsResponse } from '../models/User'
import { Route, Body, Tags, Put } from 'tsoa'
@Route('/admin')
@Tags('Admin')
export class AdminController {
  @Put('/suspenduser')
  public async suspendUser(
    @Body() body: { userId: number; isAdmin: boolean; password: string }
  ): Promise<UserDetailsResponse | string> {
    try {
      const { userId, isAdmin, password } = body

      if (!isAdmin) {
        throw {
          code: 401,
          message: 'Unauthorized',
        }
      }

      const user = await User.findOne({ id: userId })
      if (!user) {
        throw {
          code: 404,
          message: 'User not found.',
        }
      }

      const admin = await User.findOne({ isAdmin: true })
      if (!admin) {
        throw {
          code: 500,
          message: 'Admin not found.',
        }
      }

      const isPasswordValid = await PasswordUtils.comparePassword(
        password,
        admin.password
      )
      if (!isPasswordValid) {
        throw {
          code: 401,
          message: 'Invalid password.',
        }
      }

      user.isSuspended = true
      await user.save()

      return 'User Suspended Successfully'
    } catch (error: any) {
      console.log('Error:', error)
      throw {
        code: 500,
        message: error.message,
      }
    }
  }
}
