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

    const { puzzleId, answer } = await req.json();
    if (!puzzleId || !answer) {
      return NextResponse.json({ error: 'Puzzle ID and answer are required' }, { status: 400 });
    }

    const team = await Team.findOne({ teamId: decoded.teamId });
    if (!team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    const puzzle = await Puzzle.findById(puzzleId);

    if (!puzzle) {
      return NextResponse.json({ error: 'Puzzle not found' }, { status: 404 });
    }

    if (team.solvedPuzzleIds.includes(puzzle._id.toString())) {
      return NextResponse.json({ error: 'Puzzle already solved' }, { status: 400 });
    }

    // Answer normalization
    const normalizedUserAnswer = answer.toLowerCase().trim().replace(/\s+/g, ' ');
    const isCorrect = puzzle.acceptedAnswers.some((accepted: string) => 
      accepted.toLowerCase().trim().replace(/\s+/g, ' ') === normalizedUserAnswer
    );

    if (isCorrect) {
      // Reward with letter
      const letter = puzzle.rewardLetter;
      if (letter && !team.collectedLetters.includes(letter)) {
        team.collectedLetters.push(letter);
      }

      // Mark puzzle as solved
      team.solvedPuzzleIds.push(puzzle._id.toString());
      
      // Check if all puzzles are solved
      const totalPuzzles = await Puzzle.countDocuments();
      team.isCompleted = team.solvedPuzzleIds.length >= totalPuzzles;
      
      await team.save();

      return NextResponse.json({ 
        correct: true, 
        letter,
        isCompleted: team.isCompleted
      });
    } else {
      // Increment attempts - NOTE: We might need a per-puzzle attempts tracker now. 
      // For now, incrementing overall team attempts is acceptable as a simplistic approach.
      team.attempts += 1;
      await team.save();

      return NextResponse.json({ 
        correct: false, 
        attempts: team.attempts,
        hint1: team.attempts >= 2 ? puzzle.hint1 : null,
        hint2: team.attempts >= 4 ? puzzle.hint2 : null,
      });
    }
  } catch (err) {
    console.error('Validation error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
