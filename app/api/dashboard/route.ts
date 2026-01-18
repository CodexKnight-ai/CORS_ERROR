import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import UserDashboard, { IUserDashboard } from "@/models/UserDashboard";
import User from "@/models/User";
import { verifyToken } from "@/lib/jwt";

// GET - Get user's dashboard roadmaps
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

    // Find or create dashboard
    let dashboard = await UserDashboard.findOne({ userId: decoded.userId });

    if (!dashboard) {
      // Fetch user to get email
      const user = await User.findById(decoded.userId);
      if (!user) {
        return NextResponse.json(
          { error: "User not found" },
          { status: 404 }
        );
      }

      dashboard = await UserDashboard.create({
        userId: decoded.userId as string,
        email: user.email,
        roadmaps: [],
      } as Partial<IUserDashboard>);
    }

    return NextResponse.json({
      roadmaps: dashboard.roadmaps,
      count: dashboard.roadmaps.length,
      maxRoadmaps: 3,
    });
  } catch (error) {
    console.error("Error fetching dashboard:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard" },
      { status: 500 }
    );
  }
}

// POST - Add roadmap to dashboard
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

    // POST - Add roadmap to dashboard
    const { careerId, careerName, matchScore, modules, estimatedDuration, recognizedSkills, missingSkills, gapAnalysis, similarity } = await request.json();

    if (!careerId || !careerName || matchScore === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Find or create dashboard
    let dashboard = await UserDashboard.findOne({ userId: decoded.userId });

    if (!dashboard) {
      // Fetch user to get email
      const user = await User.findById(decoded.userId);
      if (!user) {
        return NextResponse.json(
          { error: "User not found" },
          { status: 404 }
        );
      }

      dashboard = await UserDashboard.create({
        userId: decoded.userId as string,
        email: user.email,
        roadmaps: [],
      } as Partial<IUserDashboard>);
    }

    // Check if already added
    const exists = dashboard.roadmaps.some(
      (r) => r.careerId === careerId
    );
    if (exists) {
      return NextResponse.json(
        { error: "Roadmap already in dashboard" },
        { status: 400 }
      );
    }

    // Check max limit
    if (dashboard.roadmaps.length >= 3) {
      return NextResponse.json(
        { error: "Maximum 3 roadmaps allowed" },
        { status: 400 }
      );
    }

    // Sanitize modules to ensure they have IDs (required by Mongoose schema)
    const sanitizedModules = (modules || []).map((mod: any, modIdx: number) => {
      const moduleId = mod.id || `mod-${modIdx}-${Math.random().toString(36).substr(2, 5)}`;
      return {
        ...mod,
        id: moduleId,
        subModules: (mod.subModules || []).map((sub: any, subIdx: number) => ({
          ...sub,
          id: sub.id || `${moduleId}-sub-${subIdx}`,
        }))
      };
    });

    // Add roadmap
    dashboard.roadmaps.push({
      careerId,
      careerName,
      matchScore,
      addedAt: new Date(),
      progress: 0,
      modules: sanitizedModules,
      recognizedSkills: recognizedSkills || [],
      missingSkills: missingSkills || [],
      skillsAcquired: [], // Initialize as empty
      gapAnalysis: gapAnalysis || null,
      similarity: similarity,
    } as any); // Type casting for Mongoose array push

    await dashboard.save();

    return NextResponse.json({
      message: "Roadmap added to dashboard",
      roadmaps: dashboard.roadmaps,
      count: dashboard.roadmaps.length,
    });
  } catch (error) {
    console.error("Error adding roadmap:", error);
    return NextResponse.json(
      { error: "Failed to add roadmap" },
      { status: 500 }
    );
  }
}

// DELETE - Remove roadmap from dashboard
export async function DELETE(request: NextRequest) {
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

    const { careerId } = await request.json();

    if (!careerId) {
      return NextResponse.json(
        { error: "Career ID required" },
        { status: 400 }
      );
    }

    const dashboard = await UserDashboard.findOne({ userId: decoded.userId });

    if (!dashboard) {
      return NextResponse.json(
        { error: "Dashboard not found" },
        { status: 404 }
      );
    }

    // Remove roadmap
    dashboard.roadmaps = dashboard.roadmaps.filter(
      (r) => r.careerId !== careerId
    );

    await dashboard.save();

    return NextResponse.json({
      message: "Roadmap removed from dashboard",
      roadmaps: dashboard.roadmaps,
      count: dashboard.roadmaps.length,
    });
  } catch (error) {
    console.error("Error removing roadmap:", error);
    return NextResponse.json(
      { error: "Failed to remove roadmap" },
      { status: 500 }
    );
  }
}

// PATCH - Update roadmap progress or last accessed
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

    const { careerId, moduleId, subModuleId, isCompleted, updateLastAccessed, modules, recognizedSkills, missingSkills, skillsAcquired } = await request.json();

    if (!careerId) {
      return NextResponse.json(
        { error: "Career ID required" },
        { status: 400 }
      );
    }

    const dashboard = await UserDashboard.findOne({ userId: decoded.userId });

    if (!dashboard) {
      return NextResponse.json(
        { error: "Dashboard not found" },
        { status: 404 }
      );
    }

    // Find the roadmap
    const roadmap = dashboard.roadmaps.find((r) => r.careerId === careerId);

    if (!roadmap) {
      return NextResponse.json(
        { error: "Roadmap not found in dashboard" },
        { status: 404 }
      );
    }

    // Update full structure if provided
    if (modules) roadmap.modules = modules;
    if (recognizedSkills) roadmap.recognizedSkills = recognizedSkills;
    if (missingSkills) roadmap.missingSkills = missingSkills;
    if (skillsAcquired !== undefined) {
      // Merge skills, avoiding duplicates
      const existing = roadmap.skillsAcquired || [];
      roadmap.skillsAcquired = [...new Set([...existing, ...skillsAcquired])];
    }

    // Handle SubModule Completion Toggle
    if (moduleId && subModuleId && isCompleted !== undefined) {
      const module = roadmap.modules.find((m: any) => m.id === moduleId);
      if (module) {
        const subModule = module.subModules.find((s: any) => s.id === subModuleId);
        if (subModule) {
          subModule.completed = isCompleted;

          // Recalculate Module Progress
          const completedCount = module.subModules.filter((s: any) => s.completed).length;
          module.progress = Math.round((completedCount / module.subModules.length) * 100);

          // Update Module Status
          if (module.progress === 100) module.status = 'completed';
          else if (module.progress > 0) module.status = 'in-progress';
          else module.status = 'pending';

          // Recalculate Overall Roadmap Progress
          const totalProgress = roadmap.modules.reduce((acc: number, m: any) => acc + m.progress, 0);
          roadmap.progress = Math.round(totalProgress / roadmap.modules.length);
        }
      }
    }

    if (updateLastAccessed) {
      roadmap.lastAccessed = new Date();
    }

    // Mark specific paths as modified to ensuer Mongoose saves them
    dashboard.markModified('roadmaps');
    await dashboard.save();

    return NextResponse.json({
      message: "Roadmap updated",
      roadmap,
    });
  } catch (error) {
    console.error("Error updating roadmap:", error);
    return NextResponse.json(
      { error: "Failed to update roadmap" },
      { status: 500 }
    );
  }
}
