import mongoose, { Schema, Document, Model } from "mongoose";

export interface IGapAnalysis {
  foundational_gaps: string[];
  intermediate_gaps: string[];
  advanced_gaps: string[];
}

export interface IUserSkillGap extends Document {
  userId: string;
  careerId: number;
  careerName: string;
  recognizedSkills: string[];
  missingSkills: string[];
  gapAnalysis: IGapAnalysis;
  skillsAcquired: string[]; // Skills learned through module completion
  progressPercentage: number; // Calculated field
  createdAt: Date;
  updatedAt: Date;
}

const GapAnalysisSchema = new Schema({
  foundational_gaps: { type: [String], default: [] },
  intermediate_gaps: { type: [String], default: [] },
  advanced_gaps: { type: [String], default: [] }
}, { _id: false });

const UserSkillGapSchema = new Schema<IUserSkillGap>(
  {
    userId: { type: String, required: true, index: true },
    careerId: { type: Number, required: true, index: true },
    careerName: { type: String, required: true },
    recognizedSkills: { type: [String], default: [] },
    missingSkills: { type: [String], default: [] },
    gapAnalysis: { type: GapAnalysisSchema, default: () => ({}) },
    skillsAcquired: { type: [String], default: [] },
    progressPercentage: { type: Number, default: 0, min: 0, max: 100 }
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient queries
UserSkillGapSchema.index({ userId: 1, careerId: 1 }, { unique: true });

// Virtual to calculate progress percentage
UserSkillGapSchema.pre('save', function(next: (err?: Error) => void) {
  const self = this as unknown as IUserSkillGap;
  if (self.missingSkills.length > 0) {
    const acquired = self.skillsAcquired.filter(skill => 
      self.missingSkills.some(missing => 
        missing.toLowerCase() === skill.toLowerCase()
      )
    );
    self.progressPercentage = Math.round((acquired.length / self.missingSkills.length) * 100);
  } else {
    self.progressPercentage = 100;
  }
  next();
});

const UserSkillGap: Model<IUserSkillGap> =
  mongoose.models.UserSkillGap ||
  mongoose.model<IUserSkillGap>("UserSkillGap", UserSkillGapSchema);

export default UserSkillGap;
