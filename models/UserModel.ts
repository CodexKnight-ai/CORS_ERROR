// src/models/User.ts
import { Schema, models, model } from "mongoose";

const EducationSchema = new Schema(
  {
    institution: { type: String, required: true, trim: true },
    degree: { type: String, required: true, trim: true },
    year: { type: String, required: true, trim: true }, // keeping as string as per your JSON
    cgpa: { type: String, required: true, trim: true }, // keeping as string as per your JSON
  },
  { _id: false }
);

const ProjectSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const AchievementSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true, // store hashed password
      select: false,
    },
    skills: { type: [String], default: [] },
    education: { type: [EducationSchema], default: [] },
    projects: { type: [ProjectSchema], default: [] },
    achievements: { type: [AchievementSchema], default: [] },
  },
  { timestamps: true, collection: "users" }
);

const User = models.User || model("User", UserSchema);
export default User;
