import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import dbConnect from "@/lib/mongodb";
import { Habit } from "@/models/Habit";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const habits = await Habit.find({ userId: session.user.id }).sort({ createdAt: 1 });

    return NextResponse.json({ habits });
  } catch (error) {
    console.error("Error fetching habits:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
