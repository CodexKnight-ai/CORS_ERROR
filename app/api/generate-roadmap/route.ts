import { NextRequest, NextResponse } from "next/server";
import type { RoadmapGenerationRequest, Roadmap, Module } from "@/lib/types/roadmap";
import videosData from "@/lib/data/videos.json";

const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY;
const MISTRAL_MODEL = process.env.MISTRAL_MODEL || "open-mistral-7b";

export async function POST(request: NextRequest) {
  try {
    const { careerId, careerData, missingSkills, recognizedSkills, gapAnalysis }: RoadmapGenerationRequest = await request.json();

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
    const prompt = buildRoadmapPrompt(careerData, missingSkills, recognizedSkills, gapAnalysis);

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
    const roadmap = parseAIRoadmap(aiResponse, careerId, careerData.field_name, missingSkills || [], recognizedSkills || []);

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

function buildRoadmapPrompt(careerData: any, missingSkills: string[] = [], recognizedSkills: string[] = [], gapAnalysis?: any): string {
  const missingContext = missingSkills.length > 0
    ? `The user lacks these specific skills: ${missingSkills.join(", ")}.`
    : "The user is starting fresh.";

  const recognizedContext = recognizedSkills.length > 0
    ? `The user already knows: ${recognizedSkills.join(", ")}.`
    : "No prior relevant skills.";

  return `
**Role**: You are an expert AI Career Coach & Curriculum Designer.
**Goal**: Create a hyper-personalized learning roadmap for the role of "${careerData.field_name}" that specifically targets the user's skill gaps.
**Context**: 
- **Role Description**: ${careerData.field_description}
- **Required Skills**: ${careerData.skills_required.join(", ")}
- **User's Current State**: ${recognizedContext}
- **Gap Analysis**: ${missingContext}
  ${gapAnalysis ? `(Foundational: ${gapAnalysis.foundational_gaps?.join(", ")}, Intermediate: ${gapAnalysis.intermediate_gaps?.join(", ")})` : ""}
- **Target Audience**: A motivated learner seeking a ${careerData.difficulty_rating}/10 difficulty path (entry time: ${careerData.entry_level_duration}).

**Instructions**:
1. Design 5-7 learning modules.
2. **CRITICAL**: Each module must explicitly address one or more of the "Missing Skills". 
3. Include a "relatedSkills" array in each module listing exactly which missing skills are covered by that module.
4. If a module covers a foundational gap, place it earlier.

**Output Format**:
Return ONLY a valid JSON object matching this structure:
{
  "modules": [
    {
      "id": "module-1",
      "title": "Module 1: [Topic]",
      "description": "Brief description",
      "duration": "2-3 weeks",
      "relatedSkills": ["Skill A", "Skill B"], // MUST map to the missing skills list
      "subModules": [
        {
          "id": "sub-1-1",
          "title": "Subtopic Title",
          "topics": ["Detail 1", "Detail 2"],
          "duration": "3 days",
          "resources": ["Course link", "Docs"]
        }
      ]
    }
  ],
  "estimatedDuration": "3-4 months"
}
`;
}

function parseAIRoadmap(aiResponse: string, careerId: number, careerName: string, missingSkills: string[], recognizedSkills: string[]): Roadmap {
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
      relatedSkills: module.relatedSkills || [],
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
      recognizedSkills,
      missingSkills
    };
  } catch (error) {
    console.error("Error parsing AI roadmap:", error);
    // Fallback: return a basic roadmap structure
    return createFallbackRoadmap(careerId, careerName, missingSkills, recognizedSkills);
  }
}

function loadCuratedVideos(careerName: string, modules: Module[]): Record<string, any[]> {
  try {
    // Import videos data
    // const videosData = require("@/lib/data/videos.json"); // Replaced with top-level import

    // Normalize career name to match video database keys
    const careerKey = careerName.toLowerCase().replace(/\s+/g, '-');

    // Type the data for indexing
    const typedVideosData = videosData as Record<string, any>;

    // Get videos for this career or use default
    const careerVideos = typedVideosData[careerKey] || typedVideosData.default;

    // Map videos to modules
    const videoMap: Record<string, any[]> = {};
    modules.forEach((module) => {
      const moduleVideos = (careerVideos as Record<string, any[]>)[module.id] || (careerVideos as Record<string, any[]>)["module-1"] || [];
      videoMap[module.id] = moduleVideos;
    });

    return videoMap;
  } catch (error) {
    console.error("Error loading curated videos:", error);
    return {};
  }
}

function createFallbackRoadmap(careerId: number, careerName: string, missingSkills: string[] = [], recognizedSkills: string[] = []): Roadmap {
  return {
    careerId,
    careerName,
    estimatedDuration: "3-6 months",
    overallProgress: 0,
    videos: {},
    recognizedSkills,
    missingSkills,
    modules: [
      {
        id: "module-1",
        title: "Module 1: Foundations",
        description: "Build foundational knowledge and understanding",
        duration: "2-3 weeks",
        status: "pending",
        progress: 0,
        relatedSkills: missingSkills.slice(0, 2), // Mock link to missing skills
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
        relatedSkills: missingSkills.slice(2, 4),
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
    ],
  };
}

