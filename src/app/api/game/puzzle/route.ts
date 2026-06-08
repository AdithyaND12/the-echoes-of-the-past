import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Puzzle from '@/models/Puzzle';
import Team from '@/models/Team';
import { verifyToken } from '@/lib/auth';

export async function GET(req: Request) {
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

    const team = await Team.findOne({ teamId: decoded.teamId });
    if (!team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    // Find the puzzle corresponding to team's current index
    const puzzles = await Puzzle.find().sort({ order: 1 });
    
    // Safety check: If there are NO puzzles in the database at all
    if (puzzles.length === 0) {
      return NextResponse.json({ 
        noPuzzles: true,
        message: 'The archives are currently empty. Please contact the administrator.' 
      }, { status: 200 });
    }

    const currentPuzzle = puzzles[team.currentPuzzleIndex];

    // Get all reward letters from all puzzles and jumble them
    const allLetters = puzzles.map(p => p.rewardLetter).filter(l => l && l !== '?');
    const jumbledLetters = [...allLetters].sort(() => Math.random() - 0.5);

    if (!currentPuzzle) {
      return NextResponse.json({ 
        allSongsSolved: true, 
        message: 'Simulation Calibration Complete',
        collectedLetters: team.collectedLetters,
        jumbledLetters: team.collectedLetters
      });
    }

    // Return puzzle data WITHOUT the correct answers or the audio URL
    return NextResponse.json({
      puzzle: {
        hint1: team.attempts >= 2 ? currentPuzzle.hint1 : null,
        hint2: team.attempts >= 4 ? currentPuzzle.hint2 : null,
        nodeIndex: team.currentPuzzleIndex + 1,
        totalNodes: puzzles.length,
        attempts: team.attempts,
      },
      collectedLetters: team.collectedLetters,
      jumbledLetters
    });
  } catch (err: any) {
    console.error('Puzzle fetch error:', err.message);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
