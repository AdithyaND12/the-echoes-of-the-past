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

    // Find all puzzles
    const puzzles = await Puzzle.find().sort({ order: 1 });
    
    // Safety check: If there are NO puzzles in the database at all
    if (puzzles.length === 0) {
      return NextResponse.json({ 
        noPuzzles: true,
        message: 'The archives are currently empty. Please contact the administrator.' 
      }, { status: 200 });
    }

    // Map puzzles to include solved status
    const puzzleStatus = puzzles.map(p => ({
      ...p.toObject(),
      isSolved: (team.solvedPuzzleIds || []).includes(p._id.toString())
    }));

    // Return puzzle list
    return NextResponse.json({
      puzzles: puzzleStatus,
      attempts: team.attempts,
      totalNodes: puzzles.length,
      collectedLetters: team.collectedLetters,
    });
  } catch (err: any) {
    console.error('Puzzle fetch error:', err.message);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
