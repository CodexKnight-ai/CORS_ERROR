import { NextRequest, NextResponse } from "next/server";
import careersData from "@/lib/data/careers.json";
import type { Career, UserAnswers, CareerRecommendation } from "@/lib/types/careers";

const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY;
const MISTRAL_MODEL = process.env.MISTRAL_MODEL || "open-mistral-7b";

export async function POST(request: NextRequest) {
  try {
    const { answers }: { answers: UserAnswers } = await request.json();

    if (!answers || Object.keys(answers).length === 0) {
      return NextResponse.json(
        { error: "No answers provided" },
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
    const prompt = buildPrompt(answers);

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
            content: "You are an expert healthcare career advisor. Analyze user interests and recommend the top 5 most suitable healthcare career paths. Return ONLY a valid JSON array with exactly 5 career IDs and brief reasoning for each match."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Mistral API error:", errorData);
      return NextResponse.json(
        { error: "Failed to get recommendations from AI" },
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

    // Parse AI response to extract career IDs and reasoning
    const recommendations = parseAIResponse(aiResponse);

    const analysisTime = Date.now() - startTime;

    return NextResponse.json({
      recommendations,
      analysisTime,
    });
  } catch (error) {
    console.error("Error in recommend-careers API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function buildPrompt(answers: UserAnswers): string {
  const questionLabels = [
    "Core interests",
    "Problem-solving style",
    "Technical depth preference",
    "Work environment",
    "Impact motivation",
    "Working style",
    "Long-term career goal"
  ];

  let userProfile = "User's Interest Profile:\n\n";
  
  Object.entries(answers).forEach(([questionIndex, selections]) => {
    const qIndex = parseInt(questionIndex);
    userProfile += `${questionLabels[qIndex]}:\n`;
    selections.forEach(selection => {
      userProfile += `- ${selection}\n`;
    });
    userProfile += "\n";
  });

  const careersJson = JSON.stringify(careersData, null, 2);

  return `${userProfile}

Based on the user's interests above, analyze the following 27 healthcare career paths and recommend the TOP 5 most suitable careers.

Healthcare Career Paths:
${careersJson}

IMPORTANT: Return ONLY a valid JSON array in this exact format:
[
  {
    "careerId": 1,
    "matchScore": 95,
    "reasoning": "Brief explanation of why this career matches the user's interests"
  },
  {
    "careerId": 7,
    "matchScore": 90,
    "reasoning": "Brief explanation"
  }
]

Return exactly 5 career recommendations, ordered by match score (highest first). Use only career IDs from the provided data (1-27).`;
}

function parseAIResponse(aiResponse: string): CareerRecommendation[] {
  try {
    // Extract JSON from the response (in case there's extra text)
    const jsonMatch = aiResponse.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error("No JSON array found in response");
    }

    const parsed = JSON.parse(jsonMatch[0]);
    
    // Map career IDs to full career objects
    const recommendations: CareerRecommendation[] = parsed.map((item: any) => {
      const career = careersData.find((c: Career) => c.id === item.careerId);
      if (!career) {
        throw new Error(`Career ID ${item.careerId} not found`);
      }

      return {
        career,
        matchScore: item.matchScore || 0,
        reasoning: item.reasoning || "Matched based on your interests",
      };
    });

    return recommendations.slice(0, 5); // Ensure only top 5
  } catch (error) {
    console.error("Error parsing AI response:", error);
    // Fallback: return top 5 careers by growth potential
    const fallbackCareers = [...careersData]
      .sort((a: Career, b: Career) => b.growth_potential_rating - a.growth_potential_rating)
      .slice(0, 5)
      .map((career: Career) => ({
        career,
        matchScore: 75,
        reasoning: "Recommended based on high growth potential in healthcare",
      }));

    return fallbackCareers;
  }
}
