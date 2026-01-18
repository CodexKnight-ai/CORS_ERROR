import mongoose, { Schema, Document, Model } from "mongoose";

export interface INote extends Document {
  userId: string;
  careerId: number;
  content: string;
  lastUpdated: Date;
}

const NoteSchema = new Schema<INote>(
  {
    userId: { type: String, required: true, index: true },
    careerId: { type: Number, required: true, index: true },
    content: { type: String, default: "" },
    lastUpdated: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Note: Model<INote> = mongoose.models.Note || mongoose.model<INote>("Note", NoteSchema);