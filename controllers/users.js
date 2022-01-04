import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import UserSchema from "../models/usersSchema.js";

const secret = 'test';

export const signIn = async (req, res) => {
    const { email, password } = req.body;

  try {
    const oldUser = await UserSchema.findOne({ email });

    if (!oldUser) return res.status(404).json({ message: "User doesn't exist" });

    const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);

    if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, { expiresIn: "1h" });

    res.status(200).json({ profile: oldUser, token });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
}

export const signUp = async (req, res) => {
    const { email, password, firstName, lastName } = req.body;

  try {
    const oldUser = await UserSchema.findOne({ email });

    if (oldUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 12);

    const profile = await UserSchema.create({ email, password: hashedPassword, name: `${firstName} ${lastName}` });

    const token = jwt.sign( { email: profile.email, id: profile._id }, secret, { expiresIn: "1h" } );

    res.status(201).json({ profile, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
    
    console.log(error);
}
}