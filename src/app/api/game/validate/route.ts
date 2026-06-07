import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Puzzle from '@/models/Puzzle';
import Team from '@/models/Team';
import { verifyToken } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    await dbConnect();
    
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded: any = verifyToken(token);
    
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { answer } = await req.json();
    if (!answer) {
      return NextResponse.json({ error: 'Answer is required' }, { status: 400 });
    }

    const team = await Team.findOne({ teamId: decoded.teamId });
    if (!team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    const puzzles = await Puzzle.find().sort({ order: 1 });
    const currentPuzzle = puzzles[team.currentPuzzleIndex];

    if (!currentPuzzle) {
      return NextResponse.json({ error: 'No active puzzle' }, { status: 400 });
    }

    // Answer normalization
    const normalizedUserAnswer = answer.toLowerCase().trim().replace(/\s+/g, ' ');
    const isCorrect = currentPuzzle.acceptedAnswers.some((accepted: string) => 
      accepted.toLowerCase().trim().replace(/\s+/g, ' ') === normalizedUserAnswer
    );

    if (isCorrect) {
      // Reward with letter
      const letter = currentPuzzle.rewardLetter;
      if (letter && !team.collectedLetters.includes(letter)) {
        team.collectedLetters.push(letter);
      }

      // Advance to next puzzle
      team.currentPuzzleIndex += 1;
      team.attempts = 0; // Reset attempts for next puzzle
      
      await team.save();

      return NextResponse.json({ 
        correct: true, 
        letter,
        nextPuzzle: team.currentPuzzleIndex < puzzles.length,
        isCompleted: false // Never auto-complete from songs now
      });
    } else {
      // Increment attempts
      team.attempts += 1;
      await team.save();

      return NextResponse.json({ 
        correct: false, 
        attempts: team.attempts,
        hint1: team.attempts >= 2 ? currentPuzzle.hint1 : null,
        hint2: team.attempts >= 4 ? currentPuzzle.hint2 : null,
      });
    }
  } catch (err) {
    console.error('Validation error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
