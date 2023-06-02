import express from "express";
import User, { UserPayload } from "../models/User";
import { Route,Body, Path, Get, Request, Tags, Example, Query, Post } from "tsoa";
import { UserDetailsResponse } from "./auth";
import { request } from "http";
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
    console.log("in controller")

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

  @Post("/searchuser")
public async searchUser(
  @Body() body: {query:string}
): Promise<UserSearchResponse> {
  const{query} = body;
console.log("Query:" ,query)
if(!query)
{
  throw {
    code: 401, //401 Unauthorized is the status code to return when the client provides no credentials or invalid credentials.
    message: "Invalid Query",
  };

}
  const users = await User.find({
    $or: [
      { name: { $regex: query, $options: 'i' } },
      { email: { $regex: query, $options: 'i' } },
      { address: { $regex: query, $options: 'i' } },
    ],
  });
if(users.length===0)
{
  throw {
    code: 404, // 404 means not found
    message: "No Users found.",
  };

}
  return {users};

}


}
export interface UserSearchResponse {
  users : UserDetailsResponse[]
}
export interface UserResponse {
  id: number
  name: string
  isActivated: boolean
}