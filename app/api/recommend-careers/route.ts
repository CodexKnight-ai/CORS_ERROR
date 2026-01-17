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

    const startTime = Date.now();

    // Step 1: Smart filtering based on user answers
    const filteredCareers = filterCareersByAnswers(answers);
    
    console.log("Filtered careers:", filteredCareers.map(c => ({ id: c.id, name: c.field_name, score: c.matchScore })));

    // Step 2: Use AI to rank and provide reasoning for top candidates
    let recommendations: CareerRecommendation[];
    
    if (MISTRAL_API_KEY && filteredCareers.length > 0) {
      try {
        recommendations = await getAIRankedRecommendations(answers, filteredCareers);
      } catch (error) {
        console.error("AI ranking failed, using filtered results:", error);
        recommendations = filteredCareers.slice(0, 5).map(career => ({
          career,
          matchScore: career.matchScore || 85,
          reasoning: generateReasoning(career, answers),
        }));
      }
    } else {
      // Fallback to filtered results
      recommendations = filteredCareers.slice(0, 5).map(career => ({
        career,
        matchScore: career.matchScore || 85,
        reasoning: generateReasoning(career, answers),
      }));
    }

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

function filterCareersByAnswers(answers: UserAnswers): (Career & { matchScore?: number })[] {
  const careers = careersData as Career[];
  
  // Extract key preferences from answers
  const interests = answers[0] || [];
  const problemSolving = answers[1] || [];
  const technicalDepth = answers[2] || [];
  const workEnvironment = answers[3] || [];
  const impact = answers[4] || [];
  const workingStyle = answers[5] || [];
  const careerGoal = answers[6] || [];

  // Score each career based on alignment
  const scoredCareers = careers.map(career => {
    let score = 0;
    const reasons: string[] = [];

    // Interest alignment (40 points max)
    if (interests.some(i => i.includes('data') || i.includes('numbers'))) {
      if (career.field_name.toLowerCase().includes('data') || 
          career.field_name.toLowerCase().includes('analytics') ||
          career.field_name.toLowerCase().includes('ai')) {
        score += 40;
        reasons.push('data-focused');
      }
    }
    
    if (interests.some(i => i.includes('software') || i.includes('Building'))) {
      if (career.field_name.toLowerCase().includes('software') || 
          career.field_name.toLowerCase().includes('developer') ||
          career.field_name.toLowerCase().includes('engineer')) {
        score += 40;
        reasons.push('software development');
      }
    }

    if (interests.some(i => i.includes('clinical') || i.includes('patient care'))) {
      if (career.field_name.toLowerCase().includes('clinical') || 
          career.field_name.toLowerCase().includes('informatics') ||
          career.subdomain.toLowerCase().includes('clinical')) {
        score += 40;
        reasons.push('clinical focus');
      }
    }

    if (interests.some(i => i.includes('security') || i.includes('compliance'))) {
      if (career.field_name.toLowerCase().includes('security') || 
          career.field_name.toLowerCase().includes('privacy') ||
          career.field_name.toLowerCase().includes('compliance')) {
        score += 40;
        reasons.push('security/compliance');
      }
    }

    if (interests.some(i => i.includes('Design') || i.includes('user-friendly'))) {
      if (career.field_name.toLowerCase().includes('ux') || 
          career.field_name.toLowerCase().includes('design') ||
          career.field_name.toLowerCase().includes('interface')) {
        score += 40;
        reasons.push('design-oriented');
      }
    }

    if (interests.some(i => i.includes('business') || i.includes('operational'))) {
      if (career.field_name.toLowerCase().includes('analyst') || 
          career.field_name.toLowerCase().includes('consultant') ||
          career.field_name.toLowerCase().includes('manager')) {
        score += 40;
        reasons.push('business focus');
      }
    }

    // Technical depth alignment (20 points max)
    if (technicalDepth.some(t => t.includes('Very technical'))) {
      if (career.difficulty_rating >= 7) {
        score += 20;
        reasons.push('high technical complexity');
      }
    } else if (technicalDepth.some(t => t.includes('Moderately technical'))) {
      if (career.difficulty_rating >= 4 && career.difficulty_rating <= 7) {
        score += 20;
        reasons.push('moderate technical level');
      }
    } else if (technicalDepth.some(t => t.includes('Low technical'))) {
      if (career.difficulty_rating <= 5) {
        score += 20;
        reasons.push('accessible technical level');
      }
    }

    // Work environment (15 points max)
    if (workEnvironment.some(w => w.includes('Tech companies') || w.includes('startups'))) {
      if (career.typical_companies.some((c: string) => 
        c.toLowerCase().includes('tech') || 
        c.toLowerCase().includes('google') || 
        c.toLowerCase().includes('microsoft'))) {
        score += 15;
        reasons.push('tech company fit');
      }
    }

    if (workEnvironment.some(w => w.includes('Hospitals') || w.includes('clinical'))) {
      if (career.typical_companies.some((c: string) => 
        c.toLowerCase().includes('hospital') || 
        c.toLowerCase().includes('clinic') ||
        c.toLowerCase().includes('mayo'))) {
        score += 15;
        reasons.push('healthcare setting');
      }
    }

    // Remote work preference (10 points max)
    if (workEnvironment.some(w => w.includes('Remote') || w.includes('distributed'))) {
      if (career.remote_friendly) {
        score += 10;
        reasons.push('remote-friendly');
      }
    }

    // Growth potential (10 points max)
    if (career.growth_potential_rating >= 8) {
      score += 10;
      reasons.push('high growth potential');
    }

    // Career goal alignment (5 points max)
    if (careerGoal.some(g => g.includes('technical expert'))) {
      if (career.difficulty_rating >= 7) {
        score += 5;
      }
    } else if (careerGoal.some(g => g.includes('leadership') || g.includes('strategy'))) {
      if (career.field_name.toLowerCase().includes('lead') || 
          career.field_name.toLowerCase().includes('manager') ||
          career.field_name.toLowerCase().includes('director')) {
        score += 5;
      }
    }

    return {
      ...career,
      matchScore: Math.min(100, score),
      matchReasons: reasons,
    };
  });

  // Sort by score and return top candidates
  return scoredCareers
    .filter(c => c.matchScore && c.matchScore > 20) // Only careers with some relevance
    .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))
    .slice(0, 10); // Top 10 for AI to rank
}

async function getAIRankedRecommendations(
  answers: UserAnswers,
  filteredCareers: (Career & { matchScore?: number })[]
): Promise<CareerRecommendation[]> {
  const prompt = buildOptimizedPrompt(answers, filteredCareers);

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
          content: "You are an expert healthcare career advisor. Analyze the user's profile and rank the provided career options. Return ONLY valid JSON with exactly 5 recommendations."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 1200,
    }),
  });

  if (!response.ok) {
    throw new Error("AI API failed");
  }

  const data = await response.json();
  const aiResponse = data.choices[0]?.message?.content;

  if (!aiResponse) {
    throw new Error("No AI response");
  }

  return parseAIResponse(aiResponse, filteredCareers);
}

function buildOptimizedPrompt(
  answers: UserAnswers,
  careers: (Career & { matchScore?: number })[]
): string {
  const questionLabels = [
    "Core interests",
    "Problem-solving style",
    "Technical depth",
    "Work environment",
    "Impact motivation",
    "Working style",
    "Career goal"
  ];

  let userProfile = "User Profile:\n";
  Object.entries(answers).forEach(([qIndex, selections]) => {
    userProfile += `${questionLabels[parseInt(qIndex)]}: ${selections.join(", ")}\n`;
  });

  const careerSummaries = careers.map(c => ({
    id: c.id,
    name: c.field_name,
    description: c.field_description.substring(0, 150),
    skills: c.skills_required.slice(0, 5),
    difficulty: c.difficulty_rating,
    growth: c.demand_growth_2026,
    remote: c.remote_friendly,
  }));

  return `${userProfile}

Top Career Candidates:
${JSON.stringify(careerSummaries, null, 2)}

Rank these careers and select the TOP 5 that best match the user's profile. Consider their interests, technical preferences, and career goals.

Return ONLY this JSON format (no other text):
[
  {
    "careerId": <number>,
    "matchScore": <85-100>,
    "reasoning": "<why this career fits the user's profile>"
  }
]

CRITICAL: Return exactly 5 different career IDs. Ensure variety - don't repeat IDs.`;
}

function parseAIResponse(
  aiResponse: string,
  filteredCareers: (Career & { matchScore?: number })[]
): CareerRecommendation[] {
  try {
    const jsonMatch = aiResponse.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error("No JSON found");
    }

    const parsed = JSON.parse(jsonMatch[0]);
    
    const recommendations: CareerRecommendation[] = [];
    const usedIds = new Set<number>();

    for (const item of parsed) {
      if (usedIds.has(item.careerId)) continue; // Skip duplicates
      
      const career = careersData.find((c: Career) => c.id === item.careerId);
      if (!career) continue;

      recommendations.push({
        career,
        matchScore: Math.min(100, Math.max(70, item.matchScore || 85)),
        reasoning: item.reasoning || "Matched based on your profile",
      });

      usedIds.add(item.careerId);
      
      if (recommendations.length >= 5) break;
    }

    // Fill remaining slots if needed
    while (recommendations.length < 5 && filteredCareers.length > recommendations.length) {
      const career = filteredCareers[recommendations.length];
      if (!usedIds.has(career.id)) {
        recommendations.push({
          career,
          matchScore: career.matchScore || 80,
          reasoning: generateReasoning(career, {}),
        });
        usedIds.add(career.id);
      }
    }

    return recommendations;
  } catch (error) {
    console.error("Parse error:", error);
    // Return filtered careers as fallback
    return filteredCareers.slice(0, 5).map(career => ({
      career,
      matchScore: career.matchScore || 80,
      reasoning: generateReasoning(career, {}),
    }));
  }
}

function generateReasoning(career: Career, answers: UserAnswers): string {
  const reasons: string[] = [];
  
  if (career.growth_potential_rating >= 8) {
    reasons.push("high growth potential");
  }
  
  if (career.remote_friendly) {
    reasons.push("remote work options");
  }
  
  if (career.difficulty_rating >= 7) {
    reasons.push("advanced technical role");
  }
  
  return `This career offers ${reasons.join(", ")} and aligns well with your interests in healthcare technology.`;
}
