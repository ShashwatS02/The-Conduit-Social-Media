// backend/src/seed.js
import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import User from "./models/User.js";
import Post from "./models/Post.js";

connectDB();

const seedData = async () => {
  try {
    await User.deleteMany();
    await Post.deleteMany();

    console.log("Data cleared...");

    const adminUser = await User.create({
      username: "admin",
      email: "admin@example.com",
      password: "password123",
      role: "admin",
    });

    const testUser1 = await User.create({
      username: "testuser1",
      email: "test1@example.com",
      password: "password123",
    });

    const testUser2 = await User.create({
      username: "testuser2",
      email: "test2@example.com",
      password: "password123",
    });

    await Post.create([
      {
        author: testUser1._id,
        content: "This is the first post from testuser1! So exciting.",
      },
      {
        author: testUser2._id,
        content: "Hello world! This is my first time on this platform.",
        imageUrl: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
      },
    ]);

    console.log("Data seeded successfully!");
    process.exit();
  } catch (error) {
    console.error(`Error seeding data: ${error}`);
    process.exit(1);
  }
};

seedData();
