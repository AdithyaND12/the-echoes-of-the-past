import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Team from '@/models/Team';

export async function GET() {
  try {
    await dbConnect();
    
    // Fetch all teams
    const teams = await Team.find();

    // Sort teams manually for more complex logic
    const sortedTeams = teams.sort((a, b) => {
      // 1. Completion status
      if (a.isCompleted && !b.isCompleted) return -1;
      if (!a.isCompleted && b.isCompleted) return 1;

      // 2. Number of puzzles solved
      if (a.currentPuzzleIndex !== b.currentPuzzleIndex) {
        return b.currentPuzzleIndex - a.currentPuzzleIndex;
      }

      // 3. Time taken (only if both completed or both at same puzzle)
      const timeA = a.endTime ? (a.endTime.getTime() - a.startTime.getTime()) : Infinity;
      const timeB = b.endTime ? (b.endTime.getTime() - b.startTime.getTime()) : Infinity;
      
      return timeA - timeB;
    });

    return NextResponse.json(sortedTeams.slice(0, 50)); // Return top 50
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
