import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import dbConnect from "@/lib/mongodb";
import { HabitLog } from "@/models/HabitLog";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const month = searchParams.get("month"); // Format: YYYY-MM

    if (!month) {
      return NextResponse.json({ message: "Month parameter is required" }, { status: 400 });
    }

    await dbConnect();

    // Find logs that start with the YYYY-MM prefix
    const logs = await HabitLog.find({
      userId: session.user.id,
      date: { $regex: `^${month}` },
    });

    return NextResponse.json({ logs });
  } catch (error) {
    console.error("Error fetching logs:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { habitId, date, completed } = await req.json();

    if (!habitId || !date) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    await dbConnect();

    const log = await HabitLog.findOneAndUpdate(
      { userId: session.user.id, habitId, date },
      { completed },
      { new: true, upsert: true }
    );

    return NextResponse.json({ log });
  } catch (error) {
    console.error("Error updating log:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
