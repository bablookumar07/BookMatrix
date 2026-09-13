import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

import connectDB from "../config/db.js";
import User from "../models/User.js";

dotenv.config();

const createAdmin = async () => {
  try {
    await connectDB();

    const email = "admin@libryo.com";
    const password = "Libryo@Admin123";

    const existingAdmin = await User.findOne({ email });

    if (existingAdmin) {
      console.log("Admin already exists.");

      await mongoose.connection.close();
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await User.create({
      name: "Libryo Admin",
      email,
      password: hashedPassword,
      role: "admin",
    });

    console.log("Admin created successfully.");
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Failed to create admin:", error.message);

    await mongoose.connection.close();
    process.exit(1);
  }
};

createAdmin();