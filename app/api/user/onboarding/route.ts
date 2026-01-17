import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";

export const PUT = async (req: NextRequest) => {
  try {
    await connectToDatabase(); // ensure MongoDB is connected

    const body = await req.json();
    const { userId, skills, education, projects, achievements } = body;

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // Find the user by userId
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update user profile
    user.skills = skills || [];
    user.education = education || [];
    user.projects = projects || [];
    user.achievements = achievements || [];

    await user.save();

    return NextResponse.json({ message: "Profile updated successfully", user }, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
};