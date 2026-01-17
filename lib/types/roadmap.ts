export interface SubModule {
  id: string;
  title: string;
  topics: string[];
  duration: string;
  resources: string[];
  completed?: boolean;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  duration: string;
  subModules: SubModule[];
  status: 'pending' | 'in-progress' | 'completed';
  progress: number; // 0-100
  relatedSkills: string[]; // Skills learned in this module
}

export interface YouTubeVideo {
  id: string;
  title: string;
  channelName: string;
  viewCount: string;
  thumbnailUrl: string;
  videoUrl: string;
}

export interface Roadmap {
  careerId: number;
  careerName: string;
  matchScore?: number;
  modules: Module[];
  overallProgress: number;
  estimatedDuration: string;
  videos: Record<string, YouTubeVideo[]>; // moduleId -> videos
  recognizedSkills: string[];
  missingSkills: string[];
  reasoning?: string;
  gapAnalysis?: GapAnalysis;
}

export interface UserProgress {
  userId?: string; // Optional for guest users
  careerId: number;
  completedSubModules: string[];
  moduleProgress: Record<string, number>; // moduleId -> progress %
  overallProgress: number;
  lastUpdated: Date;
}

export interface GapAnalysis {
  foundational_gaps: string[];
  intermediate_gaps: string[];
  advanced_gaps: string[];
}

export interface RoadmapGenerationRequest {
  careerId: number;
  careerData: {
    field_name: string;
    skills_required: string[];
    difficulty_rating: number;
    entry_level_duration: string;
    field_description: string;
  };
  missingSkills?: string[];
  recognizedSkills?: string[];
  gapAnalysis?: GapAnalysis;
}

export interface RoadmapGenerationResponse {
  roadmap: Roadmap;
  generationTime: number;
}
