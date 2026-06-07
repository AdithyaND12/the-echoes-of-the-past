import mongoose, { Schema, Document } from 'mongoose';

export interface IPuzzle extends Document {
  audioUrl: string;
  correctAnswer: string;
  acceptedAnswers: string[];
  hint1: string;
  hint2: string;
  rewardLetter: string;
  order: number;
}

const PuzzleSchema: Schema = new Schema({
  audioUrl: { type: String, default: '' },
  correctAnswer: { type: String, required: true },
  acceptedAnswers: { type: [String], required: true },
  hint1: { type: String, required: true },
  hint2: { type: String, required: true },
  rewardLetter: { type: String, required: true, maxlength: 1, default: '?' },
  order: { type: Number, required: true, unique: true },
});

export default mongoose.models.Puzzle || mongoose.model<IPuzzle>('Puzzle', PuzzleSchema);
