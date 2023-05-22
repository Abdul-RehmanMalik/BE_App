import User, { PasswordUtils, UserPayload } from "../models/User";
import { Security, Route, Tags, Example, Post, Request, Body,Path } from "tsoa";
import { generateAccessTokenken } from "../util/generateAccessToken";
import { generateRefreshToken } from "../util/generateRefreshtoken";
import { RequestUser } from "../types/RequestUser";
import { removeTokensInDB } from "../util/removeTokensInDB";
import { UserRequest } from "../types/UserRequest";
import { sendSignUpEmail } from "../util/signUpmail";
import { generateActivationToken } from "../util/generateActivationtoken";
import express from "express";

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
  public async signUp(
    @Body() body: UserPayload
  ): Promise<UserDetailsResponse | string> {
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

    await user.save();
    // return {
    //   email: user.email,
    //   name: user.name,
    //   address: user.address,
    // };
    const activationToken = generateActivationToken(user.id);
    console.log("userid", user.id);
    user.tokens = {
      accessToken: "",
      refreshToken: "",
      activationToken: activationToken
    };
    user.save();
    const activationLink = `http://localhost:${process.env.PORT}/auth/activate/${user.tokens.activationToken}/${user.id}`;
    sendSignUpEmail(user.email,user.name,activationLink);
    return "Sign Up Successful...!";
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
  ): Promise<TokenResponse | string> {
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
    console.log("userid", user.id);
    const accessToken = generateAccessTokenken(user.id);
    const refreshToken = generateRefreshToken(user.id);
    console.log("userid", user.id);
    user.tokens = {
      accessToken: accessToken,
      refreshToken: refreshToken,
      activationToken: "",
    };
    user.save();
    //return { tokens: user.tokens };
    return "Login Successful...!";
  }

  /**
   * @summary Verify and Removes JWT tokens and returns success message
   */
  @Security("bearerAuth")
  @Post("/logout")
  public async logout(@Request() req?: UserRequest) {
    return logout(req!);
  }
    /**
   * @summary Verify and Removes JWT activationToken and returns success message
   */
// @Post("/activate")
// public async activateUser (
// @Path('token') token:string) {
//   console.log(token);
//   return activateUser(token);
// }
@Post("/activate/:{token}/:{id}")
public async activateUser(
  @Request() req: express.Request,
  @Path() token: string, id : string
): Promise<string> {
  // Find the user by name.
  const user = await User.findOne({ id });
  if (!user) {
    throw {
      code: 404, // 404 means not found
      message: "User not found.",
    };
  }

  
  await removeTokensInDB(user.id);
  return "Verification Successful"
}
}
//logout
const logout = async (req: UserRequest) => {
  await removeTokensInDB((req.user as RequestUser).id);
  return "Logged Out Successfully";
};
//activateUser
// const activateUser = async (req: UserRequest) => {
//   await removeTokensInDB((req.user as RequestUser).id);
//   return "Verification Successful";
// };

const forgotPassword = async (
  req: Express.Request,
  data: ForgotPasswordPayload
) => {
  const { email } = data;
  const dbUser = await User.findOne({ email });
  if (!dbUser)
    throw {
      code: 404,
      message: "User Not Found",
    };
  // implementation for sending a token to user through email
  //const accessToken = generateAccessTokenken(dbUser.id);
};

interface TokenResponse {
  /**
   * Access Token and Refresh Tokens
   * @example "someRandomCryptoString"
   */
  tokens: { accessToken: string; refreshToken: string };
}
interface ForgotPasswordPayload {
  /**
   * Email
   * @example "abc@gmail.com"
   */
  email: string;
}

export interface UserDetailsResponse {
  email: string;
  name: string;
  address: string;
}
