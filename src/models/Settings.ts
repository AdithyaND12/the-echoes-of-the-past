import mongoose, { Schema, Document } from 'mongoose';

export interface ISettings extends Document {
  attemptsPerPuzzle: number;
  timeLimit: number; // in seconds
  completionCodePrefix: string;
  adminPasswordHash: string;
  themeColor: string;
  targetWord: string;
}

const SettingsSchema: Schema = new Schema({
  attemptsPerPuzzle: { type: Number, default: 10 },
  timeLimit: { type: Number, default: 300 },
  completionCodePrefix: { type: String, default: 'MEMORY' },
  adminPasswordHash: { type: String, required: true },
  themeColor: { type: String, default: '#00E5FF' },
  targetWord: { type: String, default: 'MEMORY' },
});

export default mongoose.models.Settings || mongoose.model<ISettings>('Settings', SettingsSchema);
