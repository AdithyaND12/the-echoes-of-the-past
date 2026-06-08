import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Team from '@/models/Team';
import Settings from '@/models/Settings';
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

    const { guess } = await req.json();
    if (!guess) {
      return NextResponse.json({ error: 'Guess is required' }, { status: 400 });
    }

    const team = await Team.findOne({ teamId: decoded.teamId });
    if (!team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 });
    }

    const settings = await Settings.findOne();
    const targetWord = settings?.targetWord || 'MEMORY';

    const normalizedGuess = guess.toUpperCase().trim();
    const normalizedTarget = targetWord.toUpperCase().trim();

    if (normalizedGuess === normalizedTarget) {
      const now = new Date();
      team.isCompleted = true;
      team.finalWordSolved = true;
      team.endTime = now;
      team.timeTaken = Math.floor((now.getTime() - team.startTime.getTime()) / 1000);
      await team.save();
      console.log(`Team ${team.teamId} completed:`, team.isCompleted);

      return NextResponse.json({ 
        correct: true, 
        message: 'Master override successful. Full memory restored.' 
      });
    } else {
      return NextResponse.json({ 
        correct: false, 
        message: 'Invalid code sequence. Master override failed.' 
      });
    }
  } catch (err) {
    console.error('Wordle validation error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
