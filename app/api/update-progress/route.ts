// app/api/update-progress/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import User from "@/lib/models/User";

export async function POST(request: NextRequest) {
  try {
    const { moduleId, moduleProgress, userId, careerId } = await request.json();

    if (!moduleId || moduleProgress === undefined || !userId || !careerId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Calculate overall progress by getting all modules and averaging
    const user = await User.findOne(
      { _id: userId, "roadmaps.careerId": careerId },
      { projection: { "roadmaps.$": 1 } }
    );

    if (!user || !user.roadmaps || user.roadmaps.length === 0) {
      return NextResponse.json(
        { error: "Roadmap not found" },
        { status: 404 }
      );
    }

    const roadmap = user.roadmaps[0];
    const modules = roadmap.modules;

    // Calculate new overall progress
    let totalProgress = 0;
    modules.forEach((mod: any) => {
      if (mod.id === moduleId) {
        totalProgress += moduleProgress;
      } else {
        totalProgress += mod.progress || 0;
      }
    });
    const overallProgress = Math.round(totalProgress / modules.length);

    // Determine module status based on progress
    const getStatus = (progress: number) => {
      if (progress === 0) return "pending";
      if (progress === 100) return "completed";
      return "in-progress";
    };

    // Update the specific module's progress and the overall roadmap progress
    const result = await User.updateOne(
      { 
        _id: userId, 
        "roadmaps.careerId": careerId 
      },
      {
        $set: {
          "roadmaps.$.progress": overallProgress,
          "roadmaps.$.modules.$[module].progress": moduleProgress,
          "roadmaps.$.modules.$[module].status": getStatus(moduleProgress),
        },
      },
      {
        arrayFilters: [{ "module.id": moduleId }],
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "User or roadmap not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      moduleProgress,
      overallProgress,
    });
  } catch (error) {
    console.error("Error updating progress:", error);
    return NextResponse.json(
      { error: "Failed to update progress" },
      { status: 500 }
    );
  }
}