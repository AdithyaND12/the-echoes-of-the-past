import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Team from '@/models/Team';
import { signToken } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { teamName, teamId } = await req.json();

    if (!teamName || !teamId) {
      return NextResponse.json({ error: 'Missing team name or ID' }, { status: 400 });
    }

    // Check if team ID already exists
    let team = await Team.findOne({ teamId });

    if (team) {
      // If team exists, just sign them in (allow re-joining if they lost session)
      const token = signToken({ teamId: team.teamId, name: team.name });
      return NextResponse.json({ token, teamId: team.teamId, name: team.name });
    }

    // Create new team
    team = await Team.create({
      name: teamName,
      teamId,
      startTime: new Date(),
    });

    const token = signToken({ teamId: team.teamId, name: team.name });
    return NextResponse.json({ token, teamId: team.teamId, name: team.name });
  } catch (err: any) {
    console.error('Join error detail:', err.message);
    if (err.message.includes('ECONNREFUSED')) {
      return NextResponse.json({ error: 'Database connection failed. Is MongoDB running?' }, { status: 503 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
