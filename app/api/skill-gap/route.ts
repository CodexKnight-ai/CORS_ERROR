import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import UserSkillGap from "@/lib/models/UserSkillGap";
import { verifyToken } from "@/lib/jwt";

// GET - Retrieve skill gap data for a career
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    // Get user from token
    const token = request.cookies.get("auth_token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const decoded = await verifyToken(token);
    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      );
    }

    // Get careerId from query params
    const { searchParams } = new URL(request.url);
    const careerId = searchParams.get("careerId");

    if (!careerId) {
      return NextResponse.json(
        { error: "Career ID required" },
        { status: 400 }
      );
    }

    const skillGap = await UserSkillGap.findOne({
      userId: decoded.userId,
      careerId: parseInt(careerId),
    });

    if (!skillGap) {
      return NextResponse.json(
        { error: "Skill gap data not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      skillGap,
    });
  } catch (error) {
    console.error("Error fetching skill gap:", error);
    return NextResponse.json(
      { error: "Failed to fetch skill gap" },
      { status: 500 }
    );
  }
}

// POST - Store skill gap analysis from suggest-roles
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    // Get user from token
    const token = request.cookies.get("auth_token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const decoded = await verifyToken(token);
    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      );
    }

    const { careerId, careerName, recognizedSkills, missingSkills, gapAnalysis, similarity } = await request.json();

    if (!careerId || !careerName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create or update skill gap
    const skillGap = await UserSkillGap.findOneAndUpdate(
      { userId: decoded.userId, careerId },
      {
        userId: decoded.userId,
        careerId,
        careerName,
        recognizedSkills: recognizedSkills || [],
        missingSkills: missingSkills || [],
        gapAnalysis: gapAnalysis || {
          foundational_gaps: [],
          intermediate_gaps: [],
          advanced_gaps: [],
        },
        similarity: similarity || 0,
        skillsAcquired: [], // Reset on new analysis
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({
      message: "Skill gap stored successfully",
      skillGap,
    });
  } catch (error) {
    console.error("Error storing skill gap:", error);
    return NextResponse.json(
      { error: "Failed to store skill gap" },
      { status: 500 }
    );
  }
}

// PATCH - Update acquired skills
export async function PATCH(request: NextRequest) {
  try {
    await connectToDatabase();

    // Get user from token
    const token = request.cookies.get("auth_token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const decoded = await verifyToken(token);
    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      );
    }

    const { careerId, acquiredSkills } = await request.json();

    if (!careerId) {
      return NextResponse.json(
        { error: "Career ID required" },
        { status: 400 }
      );
    }

    const skillGap = await UserSkillGap.findOne({
      userId: decoded.userId,
      careerId,
    });

    if (!skillGap) {
      return NextResponse.json(
        { error: "Skill gap not found" },
        { status: 404 }
      );
    }

    // Merge new acquired skills (avoid duplicates)
    const newSkills = acquiredSkills || [];
    const existingSkills = skillGap.skillsAcquired || [];
    const mergedSkills = [...new Set([...existingSkills, ...newSkills])];

    skillGap.skillsAcquired = mergedSkills;
    await skillGap.save(); // This will trigger the pre-save hook to recalculate progress

    return NextResponse.json({
      message: "Skills updated successfully",
      skillGap,
    });
  } catch (error) {
    console.error("Error updating skills:", error);
    return NextResponse.json(
      { error: "Failed to update skills" },
      { status: 500 }
    );
  }
}
