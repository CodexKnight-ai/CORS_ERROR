import type { Module } from "./roadmap";

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
