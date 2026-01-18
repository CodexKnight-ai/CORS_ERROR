import { NextRequest, NextResponse } from "next/server";
import { supabase } from '@/app/lib/supabase';
import { pipeline, env } from '@huggingface/transformers';
import path from 'path';
import type { RoadmapGenerationRequest, Roadmap, Module } from "@/lib/types/roadmap";

const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY;
const MISTRAL_MODEL = process.env.MISTRAL_MODEL || "open-mistral-7b";

env.cacheDir = path.join(process.cwd(), '.cache');

// Singleton for BERT model to avoid re-loading on every request
let extractorInstance: any = null;

async function getExtractor() {
  if (!extractorInstance) {
    extractorInstance = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2', {
      dtype: 'q8',
    });
  }
  return extractorInstance;
}

export async function POST(request: NextRequest) {
  try {
    console.log("Generating roadmap...");
    const body: RoadmapGenerationRequest = await request.json();

    // Destructuring with fallbacks to fix: 
    // "Argument of type 'string[] | undefined' is not assignable to parameter of type 'string[]'"
    const {
      careerId,
      careerData,
      missingSkills = [],
      recognizedSkills = [],
      gapAnalysis
    } = body;

    if (!careerId || !careerData || !MISTRAL_API_KEY) {
      return NextResponse.json({ error: "Missing configuration or data" }, { status: 400 });
    }

    const startTime = Date.now();

    const extractor = await getExtractor();

    const prompt = buildRoadmapPrompt(careerData, missingSkills, recognizedSkills, gapAnalysis);

    const aiResponse = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${MISTRAL_API_KEY}`,
      },
      body: JSON.stringify({
        model: MISTRAL_MODEL,
        messages: [
          { role: "system", content: "You are an expert career learning path designer. Create structured JSON roadmaps." },
          { role: "user", content: prompt }
        ],
        temperature: 0.3,
      }),
    });
    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("Mistral API Error:", errorText);
      throw new Error(`Mistral API failed: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const rawContent = aiData.choices[0]?.message?.content;
    console.log("AI Raw Content received");

    const jsonMatch = rawContent.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      console.error("AI Response did not contain JSON:", rawContent);
      throw new Error("AI failed to return valid JSON");
    }
    const parsedAI = JSON.parse(jsonMatch[0]);

    const modules = parsedAI.modules || [];
    if (modules.length === 0) {
      console.warn("AI returned zero modules");
    }

    const modulesWithCourses = await Promise.all(modules.map(async (module: any) => {
      const moduleTitle = module.title || "Topic";
      const moduleRelatedSkills = Array.isArray(module.relatedSkills) ? module.relatedSkills : [];
      const searchQuery = `${moduleTitle} ${moduleRelatedSkills.join(" ")}`.toLowerCase();
      const out = await extractor(searchQuery, { pooling: 'mean', normalize: true });
      const queryEmbedding = Array.from(out.data);

      const { data: matchedCourses, error: matchError } = await supabase.rpc('match_coursera_courses', {
        query_embedding: queryEmbedding,
        match_threshold: 0.35,
        match_count: 2
      });

      if (matchError) console.error("Search error:", matchError);

      const moduleId = module.id || `mod-${Math.random().toString(36).substr(2, 9)}`;
      return {
        ...module,
        id: moduleId,
        status: 'pending' as const,
        progress: 0,
        suggestedCourses: matchedCourses || [],
        subModules: (module.subModules || []).map((sub: any, subIdx: number) => ({
          ...sub,
          id: sub.id || `${moduleId}-sub-${subIdx}`,
          completed: false,
        })),
      };
    }));

    // Fix: "Property 'videos' is missing but required in type 'Roadmap'"
    // We satisfy the type by providing an empty object while we transition to suggestedCourses
    const finalRoadmap: Roadmap = {
      careerId,
      careerName: careerData.field_name,
      modules: modulesWithCourses,
      overallProgress: 0,
      estimatedDuration: parsedAI.estimatedDuration || "3-4 months",
      recognizedSkills,
      missingSkills,
      videos: {}, // Satisfies the interface contract
    };

    return NextResponse.json({
      roadmap: finalRoadmap,
      generationTime: Date.now() - startTime,
    });

  } catch (error: any) {
    console.error("Error in generate-roadmap API:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Ensure parameters have default empty arrays to fix type errors
function buildRoadmapPrompt(
  careerData: any,
  missingSkills: string[] = [],
  recognizedSkills: string[] = [],
  gapAnalysis?: any
): string {
  return `
**Role**: AI Career Curriculum Designer.
**Goal**: Design a personalized learning roadmap for "${careerData.field_name}" to bridge the gaps.
**Context**:
- Required Skills: ${careerData.skills_required?.join(", ") ?? "Not specified"}
- User Already Knows: ${recognizedSkills.join(", ")}
- Missing Skills (Target): ${missingSkills.join(", ")}
${gapAnalysis ? `- Gap Priority: Foundational (${gapAnalysis.foundational_gaps?.join(", ")})` : ""}

**Instructions**:
1. Create 5-7 logical modules.
2. For each module, provide a "relatedSkills" array from the "Missing Skills" list.
3. Return ONLY valid JSON in this format:
{
  "modules": [
    {
      "id": "module-1",
      "title": "Topic Title",
      "description": "Short description",
      "duration": "Duration info",
      "relatedSkills": ["Skill Name"],
      "subModules": [
        { "title": "Subtopic", "topics": ["A", "B"], "duration": "Days", "resources": ["Docs"] }
      ]
    }
  ],
  "estimatedDuration": "X months"
}
`;
}