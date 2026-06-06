import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Puzzle from '@/models/Puzzle';
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
  const puzzles = await Puzzle.find().sort({ order: 1 });
  return NextResponse.json(puzzles);
}

export async function POST(req: Request) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  await dbConnect();
  const data = await req.json();

  if (data._id) {
    // Update
    const updated = await Puzzle.findByIdAndUpdate(data._id, data, { new: true });
    return NextResponse.json(updated);
  } else {
    // Create
    const count = await Puzzle.countDocuments();
    const newPuzzle = await Puzzle.create({ ...data, order: count + 1 });
    return NextResponse.json(newPuzzle);
  }
}

export async function DELETE(req: Request) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  
  await dbConnect();
  await Puzzle.findByIdAndDelete(id);
  
  // Re-order remaining puzzles
  const remaining = await Puzzle.find().sort({ order: 1 });
  for (let i = 0; i < remaining.length; i++) {
    remaining[i].order = i + 1;
    await remaining[i].save();
  }

  return NextResponse.json({ success: true });
}
