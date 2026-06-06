import mongoose, { Schema, Document } from 'mongoose';

export interface ITeam extends Document {
  name: string;
  teamId: string;
  currentPuzzleIndex: number;
  attempts: number;
  startTime: Date;
  endTime?: Date;
  score: number;
  isCompleted: boolean;
}

const TeamSchema: Schema = new Schema({
  name: { type: String, required: true },
  teamId: { type: String, required: true, unique: true },
  currentPuzzleIndex: { type: Number, default: 0 },
  attempts: { type: Number, default: 0 },
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date },
  score: { type: Number, default: 0 },
  isCompleted: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.models.Team || mongoose.model<ITeam>('Team', TeamSchema);
