import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISubModule {
  id: string;
  title: string;
  topics: string[];
  duration: string;
  resources: string[];
  completed?: boolean;
}

export interface IModule {
  id: string;
  title: string;
  description: string;
  duration: string;
  subModules: ISubModule[];
  status: 'pending' | 'in-progress' | 'completed';
  progress: number;
  relatedSkills: string[];
}

export interface IDashboardRoadmap {
  careerId: number;
  careerName: string;
  matchScore: number;
  addedAt: Date;
  lastAccessed?: Date;
  progress: number;
  modules: IModule[]; // Store full roadmap structure
  recognizedSkills: string[];
  missingSkills: string[];
  skillsAcquired: string[]; // Skills acquired through module completion
  gapAnalysis?: {
    foundational_gaps: string[];
    intermediate_gaps: string[];
    advanced_gaps: string[];
  };
  similarity?: number;
}

export interface IUserDashboard extends Document {
  userId: string;
  email: string;
  roadmaps: IDashboardRoadmap[];
  createdAt: Date;
  updatedAt: Date;
}

const SubModuleSchema = new Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  topics: [String],
  duration: { type: String },
  resources: [String],
  completed: { type: Boolean, default: false }
});

const ModuleSchema = new Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String },
  duration: { type: String },
  subModules: [SubModuleSchema],
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed'],
    default: 'pending'
  },
  progress: { type: Number, default: 0 },
  relatedSkills: [String]
});

const GapAnalysisSchema = new Schema({
  foundational_gaps: { type: [String], default: [] },
  intermediate_gaps: { type: [String], default: [] },
  advanced_gaps: { type: [String], default: [] }
}, { _id: false });

const DashboardRoadmapSchema = new Schema({
  careerId: { type: Number, required: true },
  careerName: { type: String, required: true },
  matchScore: { type: Number, required: true },
  addedAt: { type: Date, default: Date.now },
  lastAccessed: { type: Date },
  progress: { type: Number, default: 0 },
  modules: { type: [ModuleSchema], default: [] },
  recognizedSkills: { type: [String], default: [] },
  missingSkills: { type: [String], default: [] },
  skillsAcquired: { type: [String], default: [] },
  gapAnalysis: { type: GapAnalysisSchema, default: null },
  similarity: { type: Number }
});

const UserDashboardSchema = new Schema<IUserDashboard>(
  {
    userId: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    roadmaps: {
      type: [DashboardRoadmapSchema],
      default: [],
      validate: {
        validator: function (roadmaps: IDashboardRoadmap[]) {
          return roadmaps.length <= 3;
        },
        message: "Maximum 3 roadmaps allowed in dashboard",
      },
    },
  },
  {
    timestamps: true,
  }
);

// Create index for faster queries

UserDashboardSchema.index({ email: 1 });

const UserDashboard: Model<IUserDashboard> =
  mongoose.models.UserDashboard ||
  mongoose.model<IUserDashboard>("UserDashboard", UserDashboardSchema);

export default UserDashboard;
