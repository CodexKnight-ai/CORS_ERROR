import mongoose, { Schema, Document, Model } from "mongoose";

export interface IDashboardRoadmap {
  careerId: number;
  careerName: string;
  matchScore: number;
  addedAt: Date;
  lastAccessed?: Date;
  progress: number;
}

export interface IUserDashboard extends Document {
  userId: string;
  email: string;
  roadmaps: IDashboardRoadmap[];
  createdAt: Date;
  updatedAt: Date;
}

const DashboardRoadmapSchema = new Schema({
  careerId: { type: Number, required: true },
  careerName: { type: String, required: true },
  matchScore: { type: Number, required: true },
  addedAt: { type: Date, default: Date.now },
  lastAccessed: { type: Date },
  progress: { type: Number, default: 0 },
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
UserDashboardSchema.index({ userId: 1 });
UserDashboardSchema.index({ email: 1 });

const UserDashboard: Model<IUserDashboard> =
  mongoose.models.UserDashboard ||
  mongoose.model<IUserDashboard>("UserDashboard", UserDashboardSchema);

export default UserDashboard;
