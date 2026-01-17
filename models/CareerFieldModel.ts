// /src/models/CareerField.ts
import  { Schema, model, models, Types } from "mongoose";

const CourseSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    link: { type: String, required: true, trim: true },
    duration: { type: String, trim: true }, // e.g. "3 months"
    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced", "all"],
      default: "all",
      index: true,
    },
    cost: {
      type: String,
      enum: ["free", "paid", "freemium", "unknown"],
      default: "unknown",
      index: true,
    },
    provider: { type: String, trim: true }, // optional (Coursera, edX, etc.)
  },
  { _id: false }
);

const LearningPathStepSchema = new Schema(
  {
    level: { type: Number, required: true, min: 1 },
    duration: { type: String, required: true, trim: true }, // "4 weeks"
    focus: { type: String, required: true, trim: true }, // "Python & SQL"
  },
  { _id: false }
);

const ProjectsSchema = new Schema(
  {
    easy: { type: [String], default: [] },
    medium: { type: [String], default: [] },
    hard: { type: [String], default: [] },
  },
  { _id: false }
);

const ProjectTimelineSchema = new Schema(
  {
    easy: { type: String, trim: true }, // "2-3 weeks"
    medium: { type: String, trim: true }, // "4-6 weeks"
    hard: { type: String, trim: true }, // "8-12 weeks"
  },
  { _id: false }
);

const SkillsBreakdownSchema = new Schema(
  {
    foundational: { type: [String], default: [], index: false },
    intermediate: { type: [String], default: [], index: false },
    advanced: { type: [String], default: [], index: false },
  },
  { _id: false }
);

const CareerFieldSchema = new Schema(
  {
    // Core identity
    category: {
      type: String,
      required: true,
      trim: true,
      index: true, // e.g., Healthcare / Agriculture / Urban
    },
    field_name: { type: String, required: true, trim: true, index: true },
    field_id: {
      type: String,
      required: true,
      trim: true,
      unique: true, // e.g., "HCS_001"
      index: true,
    },

    // Description & taxonomy
    field_description: { type: String, required: true, trim: true },
    subdomain: { type: String, trim: true, index: true }, // e.g., "Data & Analytics"

    // Skills
    skills_required: { type: [String], default: [], index: true },
    skills_breakdown: { type: SkillsBreakdownSchema, default: () => ({}) },

    // Search / matching
    keywords: { type: [String], default: [], index: true },
    interests_matching: { type: [String], default: [], index: true },

    // Requirements & paths
    prerequisites: { type: [String], default: [] },
    learning_path: { type: [LearningPathStepSchema], default: [] },

    // Resources
    famous_courses: { type: [CourseSchema], default: [] },
    famous_projects: { type: ProjectsSchema, default: () => ({}) },
    project_timeline: { type: ProjectTimelineSchema, default: () => ({}) },

    // Tools & credentials
    tools_required: { type: [String], default: [] },
    certifications: { type: [String], default: [] },

    // Market info
    avg_salary_usd: { type: Number, min: 0, default: 0 },
    avg_salary_inr: { type: Number, min: 0, default: 0 },
    demand_growth_2026: { type: String, trim: true }, // "25%"
    entry_level: { type: String, trim: true },

    // Career movement
    career_progression: { type: [String], default: [] },
    next_roles: { type: [String], default: [] },
    similar_roles: { type: [String], default: [] },

    // Industry context
    industry_focus: { type: [String], default: [] },
    remote_friendly: { type: Boolean, default: false, index: true },
    job_market_saturation: {
      type: String,
      enum: ["low", "medium", "high", "unknown"],
      default: "unknown",
      index: true,
    },

    // Ratings
    growth_potential_rating: { type: Number, min: 0, max: 10, default: 0 },
    difficulty_rating: { type: Number, min: 0, max: 10, default: 0 },

    // References
    research_links: { type: [String], default: [] },

    // Optional: ownership/audit (useful for hackathon demos)
    createdBy: { type: Types.ObjectId, ref: "User" },
    isActive: { type: Boolean, default: true, index: true },
  },
  {
    timestamps: true,
    collection: "career_fields",
  }
);

// Useful compound indexes for fast recommendation queries
CareerFieldSchema.index({ category: 1, subdomain: 1 });
CareerFieldSchema.index({ category: 1, "famous_courses.level": 1 });
CareerFieldSchema.index({ category: 1, remote_friendly: 1 });
CareerFieldSchema.index({ skills_required: 1 }); // multikey
CareerFieldSchema.index({ keywords: 1 }); // multikey

const CareerField = models.CareerField || model("CareerField", CareerFieldSchema);

export default CareerField;
