import { Request, Response } from "express";
import bcrypt from "bcrypt"; // for password hashing
import User from "../models/User";

export const createUser = async (req: Request, res: Response) => {
  try {
    const { email, password, name, address } = req.body;
    // pasword hashing
    const invalidEmail = await User.findOne({ email });
    // to check whether user already exists or not
    if (invalidEmail) {
      res.status(400).json(invalidEmail);
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
      name,
      address,
    });
    res.status(201).json(user);
  } catch (err: any) {
    console.log("Failed to reg new user");
    res.status(500).json({ error: err.message });
  }
};
