import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Team from '@/models/Team';
import { signToken } from '@/lib/auth';
import { nanoid } from 'nanoid';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { teamName } = await req.json();

    if (!teamName) {
      return NextResponse.json({ error: 'Missing team name' }, { status: 400 });
    }

    // Generate a unique teamId
    const teamId = nanoid(8).toLowerCase();

    // Create new team
    const team = await Team.create({
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
