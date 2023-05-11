import { Request, Response as ExpressResponse } from "express";
import bcrypt from "bcrypt";
import User, { UserPayload } from "../models/User";
import jwt from "jsonwebtoken";
import { Post, Route, Body, Tags, Example } from "tsoa";
import { generateAccessTokenken } from "../util/generateAccessToken";

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
  @Post("/")
  public async createUser(
    @Body() body: UserPayload
  ): Promise<UserDetailsResponse> {
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
    const hashedPassword = await bcrypt.hash(password, 10);

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
    accessToken: "someRandomCryptoString",
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
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw {
        code: 401, //401 Unauthorized is the status code to return when the client provides no credentials or invalid credentials.
        message: "Invalid Email or Password",
      };
    }

    // Generate a JSON Web Token
    const accessToken = generateAccessTokenken(user._id);
    return { accessToken };
  }
}

interface TokenResponse {
  /**
   * Access Token
   * @example "someRandomCryptoString"
   */
  accessToken: string;
}
export interface UserDetailsResponse {
  email: string;
  name: string;
  address: string;
}
