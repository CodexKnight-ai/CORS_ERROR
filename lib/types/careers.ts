import type { Module } from "./roadmap";

// Dashboard Types
export interface DashboardRoadmap {
  careerId: number;
  careerName: string;
  matchScore: number;
  addedAt: Date;
  lastAccessed?: Date;
  progress: number; // 0-100
  modules: Module[];
  recognizedSkills: string[];
  missingSkills: string[];
}

export interface DashboardState {
  roadmaps: DashboardRoadmap[];
  count: number;
  maxRoadmaps: number; // 3
}

// Career Types
export interface Career {
  id: number;
  category: string;
  subdomain: string;
  field_name: string;
  field_description: string;
  skills_required: string[];
  skills_breakdown: {
    foundational: string[];
    intermediate: string[];
    advanced: string[];
  };
  keywords: string[];
  prerequisites: string[];
  learning_path: {
    level: number;
    duration: string;
    focus: string;
  }[];
  tools_required: string[];
  certifications: string[];
  avg_salary_inr: number;
  salary_range_inr: string;
  entry_level: string;
  mid_level: string;
  senior_level: string;
  demand_growth_2026: string;
  entry_level_duration: string;
  career_progression: string[];
  next_roles: string[];
  interests_matching: string[];
  similar_roles: string[];
  industry_focus: string[];
  remote_friendly: boolean;
  job_market_saturation: string;
  growth_potential_rating: number;
  difficulty_rating: number;
  typical_companies: string[];
}

export type UserAnswers = Record<string, string[]>;

export interface CareerRecommendation {
  career: Career;
  matchScore: number;
  reasoning: string;
}
