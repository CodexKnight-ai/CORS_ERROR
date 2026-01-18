import connectToDatabase from "@/lib/db";
import { Note } from "@/models/Note";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const careerId = searchParams.get("careerId");
    const userId = searchParams.get("userId");

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });
    if (!careerId) return new NextResponse("Career ID required", { status: 400 });

    await connectToDatabase();
    
    const note = await Note.findOne({ userId, careerId: parseInt(careerId) });

    return NextResponse.json({ content: note ? note.content : "" });
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId, careerId, content } = await req.json();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });
    if (!careerId) return new NextResponse("Career ID required", { status: 400 });

    await connectToDatabase();

    // Upsert: Find and update, or create new
    const note = await Note.findOneAndUpdate(
      { userId, careerId },
      { content, lastUpdated: new Date() },
      { upsert: true, new: true }
    );

    return NextResponse.json(note);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}