import { NextRequest, NextResponse } from "next/server";
import type { RoadmapGenerationRequest, Roadmap, Module } from "@/lib/types/roadmap";
import videosData from "@/lib/data/videos.json";

const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY;
const MISTRAL_MODEL = process.env.MISTRAL_MODEL || "open-mistral-7b";

export async function POST(request: NextRequest) {
  try {
    const { careerId, careerData }: RoadmapGenerationRequest = await request.json();

    if (!careerId || !careerData) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!MISTRAL_API_KEY) {
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    const startTime = Date.now();

    // Construct the prompt for Mistral AI
    const prompt = buildRoadmapPrompt(careerData);

    // Call Mistral AI API
    const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${MISTRAL_API_KEY}`,
      },
      body: JSON.stringify({
        model: MISTRAL_MODEL,
        messages: [
          {
            role: "system",
            content: "You are an expert career learning path designer. Create structured, comprehensive learning roadmaps with modules and sub-modules. Return ONLY valid JSON."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2500,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Mistral API error:", errorData);
      return NextResponse.json(
        { error: "Failed to generate roadmap from AI" },
        { status: 500 }
      );
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content;

    if (!aiResponse) {
      return NextResponse.json(
        { error: "No response from AI" },
        { status: 500 }
      );
    }

    // Parse AI response to extract roadmap
    const roadmap = parseAIRoadmap(aiResponse, careerId, careerData.field_name);

    const generationTime = Date.now() - startTime;

    return NextResponse.json({
      roadmap,
      generationTime,
    });
  } catch (error) {
    console.error("Error in generate-roadmap API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function buildRoadmapPrompt(careerData: any): string {
  return `Create a comprehensive learning roadmap for: ${careerData.field_name}

Career Details:
- Description: ${careerData.field_description}
- Required Skills: ${careerData.skills_required.join(", ")}
- Difficulty Level: ${careerData.difficulty_rating}/10
- Entry Duration: ${careerData.entry_level_duration}

Generate a structured learning path with 5-7 modules. Each module should have:
- A clear title (e.g., "Module 1: Fundamentals of Healthcare IT")
- Brief description of what will be learned
- Estimated duration
- 3-5 sub-modules with specific topics

IMPORTANT: Return ONLY a valid JSON object in this exact format:
{
  "modules": [
    {
      "id": "module-1",
      "title": "Module 1: Foundation & Basics",
      "description": "Build foundational knowledge",
      "duration": "2-3 weeks",
      "subModules": [
        {
          "id": "sub-1-1",
          "title": "Introduction to Healthcare Systems",
          "topics": ["Healthcare delivery models", "EHR basics", "HIPAA fundamentals"],
          "duration": "3-4 days",
          "resources": ["Online courses", "Documentation", "Practice exercises"]
        }
      ]
    }
  ],
  "estimatedDuration": "3-4 months"
}

Create a practical, progressive learning path from beginner to job-ready level.`;
}

function parseAIRoadmap(aiResponse: string, careerId: number, careerName: string): Roadmap {
  try {
    // Extract JSON from the response
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No JSON found in response");
    }

    const parsed = JSON.parse(jsonMatch[0]);
    
    // Transform to our Roadmap format
    const modules: Module[] = parsed.modules.map((module: any) => ({
      ...module,
      status: 'pending' as const,
      progress: 0,
      subModules: module.subModules.map((sub: any) => ({
        ...sub,
        completed: false,
      })),
    }));

    // Load curated videos
    const videos = loadCuratedVideos(careerName, modules);

    return {
      careerId,
      careerName,
      modules,
      overallProgress: 0,
      estimatedDuration: parsed.estimatedDuration || "3-6 months",
      videos,
    };
  } catch (error) {
    console.error("Error parsing AI roadmap:", error);
    // Fallback: return a basic roadmap structure
    return createFallbackRoadmap(careerId, careerName);
  }
}

function loadCuratedVideos(careerName: string, modules: Module[]): Record<string, any[]> {
  try {
    // Import videos data
    // const videosData = require("@/lib/data/videos.json"); // Replaced with top-level import
    
    // Normalize career name to match video database keys
    const careerKey = careerName.toLowerCase().replace(/\s+/g, '-');
    
    // Get videos for this career or use default
    const careerVideos = videosData[careerKey] || videosData.default;
    
    // Map videos to modules
    const videoMap: Record<string, any[]> = {};
    modules.forEach((module) => {
      const moduleVideos = careerVideos[module.id] || careerVideos["module-1"] || [];
      videoMap[module.id] = moduleVideos;
    });
    
    return videoMap;
  } catch (error) {
    console.error("Error loading curated videos:", error);
    return {};
  }
}

function createFallbackRoadmap(careerId: number, careerName: string): Roadmap {
  return {
    careerId,
    careerName,
    estimatedDuration: "3-6 months",
    overallProgress: 0,
    videos: {},
    modules: [
      {
        id: "module-1",
        title: "Module 1: Foundations",
        description: "Build foundational knowledge and understanding",
        duration: "2-3 weeks",
        status: "pending",
        progress: 0,
        subModules: [
          {
            id: "sub-1-1",
            title: "Introduction to the Field",
            topics: ["Overview", "Key concepts", "Industry landscape"],
            duration: "3-4 days",
            resources: ["Online courses", "Documentation"],
            completed: false,
          },
          {
            id: "sub-1-2",
            title: "Core Terminology",
            topics: ["Essential terms", "Standards", "Best practices"],
            duration: "2-3 days",
            resources: ["Glossaries", "Study guides"],
            completed: false,
          },
        ],
      },
      {
        id: "module-2",
        title: "Module 2: Core Skills",
        description: "Develop essential technical and practical skills",
        duration: "4-6 weeks",
        status: "pending",
        progress: 0,
        subModules: [
          {
            id: "sub-2-1",
            title: "Technical Fundamentals",
            topics: ["Tools", "Technologies", "Workflows"],
            duration: "1-2 weeks",
            resources: ["Tutorials", "Hands-on labs"],
            completed: false,
          },
          {
            id: "sub-2-2",
            title: "Practical Applications",
            topics: ["Real-world scenarios", "Case studies", "Projects"],
            duration: "2-3 weeks",
            resources: ["Project templates", "Examples"],
            completed: false,
          },
        ],
      },
      {
        id: "module-3",
        title: "Module 3: Advanced Topics",
        description: "Master advanced concepts and specializations",
        duration: "4-6 weeks",
        status: "pending",
        progress: 0,
        subModules: [
          {
            id: "sub-3-1",
            title: "Specialized Skills",
            topics: ["Advanced techniques", "Optimization", "Best practices"],
            duration: "2-3 weeks",
            resources: ["Advanced courses", "Certifications"],
            completed: false,
          },
          {
            id: "sub-3-2",
            title: "Industry Standards",
            topics: ["Compliance", "Regulations", "Quality assurance"],
            duration: "1-2 weeks",
            resources: ["Official documentation", "Standards guides"],
            completed: false,
          },
        ],
      },
    ],
  };
}
