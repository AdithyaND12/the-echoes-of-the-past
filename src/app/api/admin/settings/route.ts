import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Settings from '@/models/Settings';
import { verifyToken } from '@/lib/auth';

function isAdmin(req: Request) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) return false;
  const token = authHeader.split(' ')[1];
  const decoded: any = verifyToken(token);
  return decoded && decoded.role === 'admin';
}

export async function GET(req: Request) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  await dbConnect();
  let settings = await Settings.findOne();
  if (!settings) {
    settings = await Settings.create({ adminPasswordHash: 'temp' }); // Should already exist from setup usually
  }
  return NextResponse.json(settings);
}

export async function POST(req: Request) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  await dbConnect();
  const data = await req.json();

  let settings = await Settings.findOne();
  if (settings) {
    settings = await Settings.findByIdAndUpdate(settings._id, data, { new: true });
  } else {
    settings = await Settings.create(data);
  }

  return NextResponse.json(settings);
}
