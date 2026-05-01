"use client";

import { useEffect, useState, useCallback } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths } from "date-fns";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { AnalyticsCards } from "@/components/AnalyticsCards";
import { HabitGrid } from "@/components/HabitGrid";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  
  const [habits, setHabits] = useState([]);
  const [logs, setLogs] = useState([]);
  const [analytics, setAnalytics] = useState({
    totalGoalsCompleted: 0,
    totalGoalsIncomplete: 0,
    monthlyProgress: 0,
    dailyProgress: 0,
    currentStreak: 0,
    longestStreak: 0,
  });

  const monthStr = format(currentDate, "yyyy-MM");
  const todayStr = format(new Date(), "yyyy-MM-dd");

  const fetchData = useCallback(async () => {
    if (status !== "authenticated") return;
    
    try {
      setLoading(true);
      const [habitsRes, logsRes, analyticsRes] = await Promise.all([
        fetch("/api/habits"),
        fetch(`/api/logs?month=${monthStr}`),
        fetch(`/api/analytics?date=${todayStr}`),
      ]);

      if (habitsRes.ok) {
        const data = await habitsRes.json();
        setHabits(data.habits);
      }
      
      if (logsRes.ok) {
        const data = await logsRes.json();
        setLogs(data.logs);
      }

      if (analyticsRes.ok) {
        const data = await analyticsRes.json();
        setAnalytics(data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [monthStr, todayStr, status]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchData();
    }
  }, [status, fetchData, router]);

  const handlePrevMonth = () => setCurrentDate((prev) => subMonths(prev, 1));
  const handleNextMonth = () => setCurrentDate((prev) => addMonths(prev, 1));
  const handleToday = () => setCurrentDate(new Date());

  const handleToggleLog = async (habitId: string, dateStr: string, completed: boolean) => {
    // Optimistic update
    const previousLogs = [...logs];
    
    setLogs((prev: any) => {
      const existing = prev.find((l: any) => l.habitId === habitId && l.date === dateStr);
      if (existing) {
        return prev.map((l: any) => 
          l.habitId === habitId && l.date === dateStr ? { ...l, completed } : l
        );
      } else {
        return [...prev, { habitId, date: dateStr, completed }];
      }
    });

    try {
      const res = await fetch("/api/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ habitId, date: dateStr, completed }),
      });

      if (!res.ok) {
        throw new Error("Failed to update log");
      }
      
      // Optionally re-fetch analytics to update the cards silently
      fetch(`/api/analytics?date=${todayStr}`)
        .then(res => res.json())
        .then(data => setAnalytics(data))
        .catch(console.error);

    } catch (error) {
      console.error("Error updating log:", error);
      // Revert optimistic update
      setLogs(previousLogs as any);
    }
  };

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  });

  if (status === "loading" || (loading && habits.length === 0)) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-zinc-500">
          <Loader2 className="h-8 w-8 animate-spin text-zinc-900 dark:text-white" />
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-zinc-900 to-zinc-500 bg-clip-text text-transparent dark:from-white dark:to-zinc-500">
            Dashboard
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2 text-lg">
            Track your habits and achieve your goals.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-2xl border border-zinc-200 bg-white/50 p-1.5 shadow-sm backdrop-blur-md dark:border-zinc-800 dark:bg-[#0a0a0a]/50">
          <button
            onClick={handlePrevMonth}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-white"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          
          <div className="flex h-9 items-center px-4 font-semibold min-w-[150px] justify-center text-zinc-700 dark:text-zinc-200">
            {format(currentDate, "MMMM yyyy")}
          </div>

          <button
            onClick={handleNextMonth}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-white"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="mx-2 h-5 w-px bg-zinc-200 dark:bg-zinc-800" />
          
          <button
            onClick={handleToday}
            className="flex h-9 items-center rounded-xl px-4 text-sm font-semibold text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
          >
            Today
          </button>
        </div>
      </div>

      <AnalyticsCards {...analytics} />

      {habits.length === 0 && !loading ? (
        <div className="mt-8 rounded-2xl border border-dashed border-zinc-300 p-12 text-center dark:border-zinc-800">
          <h3 className="text-lg font-medium text-zinc-900 dark:text-white">No habits found</h3>
          <p className="mt-2 text-zinc-500 dark:text-zinc-400">
            We couldn't find any habits for you. Try refreshing or logging out and logging back in.
          </p>
        </div>
      ) : (
        <HabitGrid 
          habits={habits} 
          logs={logs} 
          daysInMonth={daysInMonth} 
          onToggle={handleToggleLog} 
        />
      )}
    </div>
  );
}
