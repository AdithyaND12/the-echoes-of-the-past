import mongoose, { Schema, Document } from 'mongoose';

export interface ITeam extends Document {
  name: string;
  teamId: string;
  solvedPuzzleIds: string[];
  attempts: number;
  startTime: Date;
  endTime?: Date;
  timeTaken?: number; // Time taken in seconds
  score: number;
  isCompleted: boolean;
  collectedLetters: string[];
  finalWordSolved: boolean;
}

const TeamSchema: Schema = new Schema({
  name: { type: String, required: true },
  teamId: { type: String, required: true, unique: true },
  solvedPuzzleIds: { type: [String], default: [] },
  attempts: { type: Number, default: 0 },
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date },
  timeTaken: { type: Number },
  score: { type: Number, default: 0 },
  isCompleted: { type: Boolean, default: false },
  collectedLetters: { type: [String], default: [] },
  finalWordSolved: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.models.Team || mongoose.model<ITeam>('Team', TeamSchema);
