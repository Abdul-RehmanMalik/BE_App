import User, { PasswordUtils, UserPayload } from '../models/User'
import {
  Security,
  Get,
  Route,
  Tags,
  Example,
  Post,
  Request,
  Body,
  Query,
} from 'tsoa'
import { generateAccessTokenken } from '../util/generateAccessToken'
import { generateRefreshToken } from '../util/generateRefreshtoken'
import { RequestUser } from '../types/RequestUser'
import { removeTokensInDB } from '../util/removeTokensInDB'
import { UserRequest } from '../types/UserRequest'
import { sendSignUpEmail } from '../util/signUpmail'
import { generateActivationToken } from '../util/generateActivationtoken'
import { sendPasswordResetToken } from '../util/sendPasswordResetToken'
@Route('/auth')
@Tags('Auth')
export class AuthController {
  /**
   * @summary Create user with the following attributes: email, Name, Password, address.
   *
   */
  @Example<UserDetailsResponse>({
    name: 'John Snow',
    email: 'johnSnow01@gmail.com',
    address: 'H#123 Block 2 Sector J, Abc Town, NY',
  })
  @Post('/signup')
  public async signUp(
    @Body() body: UserPayload
  ): Promise<TokenResponse | string> {
    const { email, password, name, address } = body

    // Check if the email already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      throw {
        code: 409, //409 status code (Conflict) indicates that the request could not be processed because of conflict in the request,
        message: 'User with this email already exists',
      }
    }

    // Hash the password
    const hashedPassword = await PasswordUtils.hashPassword(password)

    // Create a new user

    const user = await User.create({
      email,
      password: hashedPassword,
      name,
      address,
      isActivated: false,
    })

    await user.save()
    const activationToken = generateActivationToken(user.id)
    const accessToken = generateAccessTokenken(user.id)
    const refreshToken = generateRefreshToken(user.id)
    console.log('userid', user.id)
    user.tokens = {
      accessToken: accessToken,
      refreshToken: refreshToken,
      activationToken: activationToken,
      passwordResetToken: '',
    }
    await user.save()
    const activationLink = `${process.env.FRONTEND_SERVER}:${process.env.FRONTEND_PORT}/home?token=${user.tokens.activationToken}&id=${user.id}`
    sendSignUpEmail(user.email, user.name, activationLink)
    return {
      id: user.id,
      name: user.name,
      tokens: user.tokens,
      isActivated: user.isActivated,
    }
  }
  /**
   * @summary logs user in and returns access token
   *
   */
  @Example<TokenResponse>({
    id: 0,
    name: 'Johny',
    isActivated: false,
    tokens: {
      accessToken: 'someRandomCryptoString',
      refreshToken: 'someRandomCryptoString',
      passwordResetToken: 'someRandomCryptoString',
      activationToken: 'someRandomCryptoString',
    },
  })
  @Post('/login')
  public async login(
    @Body() body: { email: string; password: string }
  ): Promise<TokenResponse | string> {
    const { email, password } = body

    // Find the user by email
    const user = await User.findOne({ email })

    if (!user) {
      throw {
        code: 401, //401 Unauthorized is the status code to return when the client provides no credentials or invalid credentials.
        message: 'Invalid Email or Password',
      }
    }

    // Check password validity
    const isPasswordValid = await PasswordUtils.comparePassword(
      password,
      user.password
    )

    if (!isPasswordValid) {
      throw {
        code: 401, //401 Unauthorized is the status code to return when the client provides no credentials or invalid credentials.
        message: 'Invalid Email or Password',
      }
    }

    // Generate a JSON Web Token
    console.log('userid', user.id)
    const accessToken = generateAccessTokenken(user.id)
    const refreshToken = generateRefreshToken(user.id)
    console.log('userid', user.id)
    user.tokens = {
      accessToken: accessToken,
      refreshToken: refreshToken,
      activationToken: '',
      passwordResetToken: '',
    }
    await user.save()
    return {
      name: user.name,
      id: user.id,
      tokens: user.tokens,
      isActivated: user.isActivated,
    }
  }

  /**
   * @summary Verify and Removes JWT tokens and returns success message
   */
  @Security('bearerAuth')
  @Get('/logout')
  public async logout(@Request() req?: UserRequest) {
    return logout(req!)
  }
  /**
   * @summary Verify and Removes JWT activationToken and returns success message
   */

  @Post('/activate')
  public async activateUser(
    @Body() body: { id: string; token: string }
  ): Promise<TokenResponse | string> {
    const { id } = body
    const user = await User.findOne({ id })
    if (!user) {
      throw {
        code: 404, // 404 means not found
        message: 'User not found.',
      }
    }

    await removeTokensInDB(user.id)
    user.isActivated = true
    await user.save()
    const accessToken = generateAccessTokenken(user.id)
    const refreshToken = generateRefreshToken(user.id)
    user.tokens = {
      accessToken: accessToken,
      refreshToken: refreshToken,
      activationToken: '',
      passwordResetToken: '',
    }
    await user.save()
    return {
      name: user.name,
      id: user.id,
      tokens: user.tokens,
      isActivated: user.isActivated,
    }
  }
  //forgot Password
  /**
   * @summary sends a mail to user for password reset
   *
   */
  @Example<TokenResponse>({
    id: 0,
    name: 'Johny',
    isActivated: false,
    tokens: {
      accessToken: 'someRandomCryptoString',
      refreshToken: 'someRandomCryptoString',
      passwordResetToken: 'someRandomCryptoString',
      activationToken: 'someRandomCryptoString',
    },
  })
  @Post('/forgotpassword')
  public async forgotPassword(
    @Body() body: { email: string }
  ): Promise<TokenResponse | string> {
    const { email } = body

    // Find the user by email
    const user = await User.findOne({ email })

    if (!user) {
      throw {
        code: 401, //401 Unauthorized is the status code to return when the client provides no credentials or invalid credentials.
        message: 'Invalid Email',
      }
    }
    await sendPasswordResetToken(user)
    return 'Password reset mail sent...!'
  }
  //resendPasswordToken
  @Post('/resendpasswordtoken')
  public async resendPasswordToken(
    @Body() body: { email: string }
  ): Promise<TokenResponse | string> {
    const { email } = body

    // Find the user by email
    const user = await User.findOne({ email })

    if (!user) {
      throw {
        code: 401, //401 Unauthorized is the status code to return when the client provides no credentials or invalid credentials.
        message: 'Invalid Email',
      }
    }
    await sendPasswordResetToken(user)
    return 'Password reset mail sent...!'
  }
  //reset password
  @Post('/resetpassword')
  public async resetPassword(
    @Body() body: { password: string; id: string; token: string }
  ): Promise<string> {
    const { password, id, token } = body
    const user = await User.findOne({ id })
    if (!user) {
      throw {
        code: 404, // 404 means not found
        message: 'User not found.',
      }
    }
    await removeTokensInDB(user.id)
    await user.save()
    // Hash the password
    const hashedPassword = await PasswordUtils.hashPassword(password)
    user.password = hashedPassword
    await user.save()
    return 'Successfully Changed Password'
  }
}
//logout
const logout = async (req: UserRequest) => {
  await removeTokensInDB((req.user as RequestUser).id)
  return 'Logged Out Successfully'
}

interface TokenResponse {
  /**
   * Access Token and Refresh Tokens
   * @example "someRandomCryptoString"
   */
  id: number
  name: string
  isActivated: boolean
  tokens: {
    accessToken: string
    refreshToken: string
    passwordResetToken: string
    activationToken: string
  }
}
interface ForgotPasswordPayload {
  /**
   * Email
   * @example "abc@gmail.com"
   */
  email: string
}

export interface UserDetailsResponse {
  email: string
  name: string
  address: string
}
