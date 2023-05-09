import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/User";
import jwt from "jsonwebtoken";

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // find user by email because email
    const user: any | null = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // checking password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // jsonwebtoken generation
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET as string
    );
    //send generated token in response
    res.status(200).json({ token });
  } catch (err: any) {
    console.log("Login failed");
    res.status(500).json({ error: err.message });
  }
};
