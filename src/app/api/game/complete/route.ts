import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Team from '@/models/Team';
import Settings from '@/models/Settings';
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
    console.log(`Checking completion for team ${decoded.teamId}:`, team?.isCompleted);
    if (!team || !team.isCompleted) {
      return NextResponse.json({ error: 'Session not completed' }, { status: 400 });
    }

    const settings = await Settings.findOne() || { completionCodePrefix: 'MEMORY' };
    
    // Generate a code based on team ID and prefix
    const completionCode = `${settings.completionCodePrefix}-${team.teamId.toUpperCase()}`;

    return NextResponse.json({
      teamName: team.name,
      completionCode,
      timeTaken: team.timeTaken || (team.endTime ? (team.endTime.getTime() - team.startTime.getTime()) / 1000 : 0),
      isCompleted: true
    });
  } catch (err) {
    console.error('Completion error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
