import express from "express";
import User, { UserPayload } from "../models/User";
import { Route, Path, Get, Request, Tags, Example } from "tsoa";
import { UserDetailsResponse } from "./authController";
@Route("/user")
@Tags("User")
export class UserController {
  /**
   * @summary Get user properties - such as name, email and address.
   * @param name The User's name
   * @example name "johnSnow01"
   */
  @Example<UserDetailsResponse>({
    name: "John Snow",
    email: "johnSnow01@gmail.com",
    address: "H#123 Block 2 Sector J, Abc Town, NY",
  })
  @Get("{name}")
  public async getUser(
    @Request() req: express.Request,
    @Path() name: string
  ): Promise<UserDetailsResponse> {
    // Find the user by name.
    const user = await User.findOne({ name });

    if (!user) {
      throw {
        code: 404, // 404 means not found
        message: "User not found.",
      };
    }

    return {
      email: user.email,
      name: user.name,
      address: user.address,
    };
  }
}
