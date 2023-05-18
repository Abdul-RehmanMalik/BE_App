import User, { PasswordUtils, UserPayload } from "../models/User";
import { Security, Route, Tags, Example, Post, Request, Body } from "tsoa";
import { generateAccessTokenken } from "../util/generateAccessToken";
import { generateRefreshToken } from "../util/generaterefreshtoken";
import { RequestUser } from "../types/RequestUser";
import { removeTokensInDB } from "../util/removeTokensInDB";
import { UserRequest } from "../types/UserRequest";

@Route("/auth")
@Tags("Auth")
export class AuthController {
  /**
   * @summary Create user with the following attributes: email, Name, Password, address.
   *
   */
  @Example<UserDetailsResponse>({
    name: "John Snow",
    email: "johnSnow01@gmail.com",
    address: "H#123 Block 2 Sector J, Abc Town, NY",
  })
  @Post("/signup")
  public async signUp(@Body() body: UserPayload): Promise<UserDetailsResponse> {
    const { email, password, name, address } = body;

    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw {
        code: 409, //409 status code (Conflict) indicates that the request could not be processed because of conflict in the request,
        message: "User with this email already exists",
      };
    }

    // Hash the password
    const hashedPassword = await PasswordUtils.hashPassword(password);

    // Create a new user

    const user = await User.create({
      email,
      password: hashedPassword,
      name,
      address,
    });
    return {
      email: user.email,
      name: user.name,
      address: user.address,
    };
  }

  /**
   * @summary logs user in and returns access token
   *
   */
  @Example<TokenResponse>({
    tokens: {
      accessToken: "someRandomCryptoString",
      refreshToken: "someRandomCryptoString",
    },
  })
  @Post("/login")
  public async login(
    @Body() body: { email: string; password: string }
  ): Promise<TokenResponse> {
    const { email, password } = body;

    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      throw {
        code: 401, //401 Unauthorized is the status code to return when the client provides no credentials or invalid credentials.
        message: "Invalid Email or Password",
      };
    }

    // Check password validity
    const isPasswordValid = await PasswordUtils.comparePassword(
      password,
      user.password
    );

    if (!isPasswordValid) {
      throw {
        code: 401, //401 Unauthorized is the status code to return when the client provides no credentials or invalid credentials.
        message: "Invalid Email or Password",
      };
    }

    // Generate a JSON Web Token
    const accessToken = generateAccessTokenken(user.id);
    const refreshToken = generateRefreshToken(user.id);
    console.log("userid", user.id);
    user.tokens = {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
    user.save();
    return { tokens: user.tokens };
  }

  /**
   * @summary Removes JWT tokens and returns success message
   */
  @Security("bearerAuth")
  @Post("/logout")
  public async logout(@Request() req?: UserRequest) {
    return logout(req!);
  }
}
const logout = async (req: UserRequest) => {
  await removeTokensInDB((req.user as RequestUser).id);
  return "Logged Out Successfully";
};

interface TokenResponse {
  /**
   * Access Token and Refresh Tokens
   * @example "someRandomCryptoString"
   */
  tokens: { accessToken: string; refreshToken: string };
}
export interface UserDetailsResponse {
  email: string;
  name: string;
  address: string;
}
