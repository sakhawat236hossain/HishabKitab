import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import dbConnect from "@/lib/mongodb";
import { HabitLog } from "@/models/HabitLog";
import { Habit } from "@/models/Habit";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, subDays } from "date-fns";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const dateParam = searchParams.get("date") || format(new Date(), "yyyy-MM-dd");
    const targetDate = new Date(dateParam);
    const targetMonthStr = format(targetDate, "yyyy-MM");

    await dbConnect();

    // 1. Get total habits
    const habitsCount = await Habit.countDocuments({ userId: session.user.id });
    
    // 2. Get logs for the target month
    const monthlyLogs = await HabitLog.find({
      userId: session.user.id,
      date: { $regex: `^${targetMonthStr}` },
      completed: true,
    });

    // Calculate Monthly Progress %
    const daysInMonth = eachDayOfInterval({
      start: startOfMonth(targetDate),
      end: endOfMonth(targetDate),
    }).length;

    const totalPossibleMonthlyLogs = habitsCount * daysInMonth;
    const monthlyProgress = totalPossibleMonthlyLogs === 0 
      ? 0 
      : Math.round((monthlyLogs.length / totalPossibleMonthlyLogs) * 100);

    // Calculate Daily Progress %
    const todayLogs = monthlyLogs.filter(log => log.date === dateParam);
    const dailyProgress = habitsCount === 0 ? 0 : Math.round((todayLogs.length / habitsCount) * 100);

    // Get total goals completed / incomplete for the month
    const totalGoalsCompleted = monthlyLogs.length;
    const totalGoalsIncomplete = totalPossibleMonthlyLogs - totalGoalsCompleted;

    // Optional: Streaks
    // For simplicity, current streak counts consecutive days up to today where at least 1 habit was completed
    let currentStreak = 0;
    let checkDate = targetDate;
    
    // We need logs beyond just this month for streaks ideally, but let's fetch last 30 days completed logs
    const recentLogs = await HabitLog.find({
        userId: session.user.id,
        completed: true,
        date: { $lte: format(targetDate, "yyyy-MM-dd") }
    }).sort({ date: -1 });

    // Group by date
    const completedDaysSet = new Set(recentLogs.map(log => log.date));

    while (completedDaysSet.has(format(checkDate, "yyyy-MM-dd"))) {
        currentStreak++;
        checkDate = subDays(checkDate, 1);
    }

    return NextResponse.json({ 
        totalGoalsCompleted,
        totalGoalsIncomplete,
        monthlyProgress,
        dailyProgress,
        currentStreak,
        longestStreak: Math.max(currentStreak, 5), // Mock longest streak for UI
        habitsCount
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
