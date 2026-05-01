"use client";

import { useState } from "react";
import { format, isToday, isFuture } from "date-fns";
import { Check } from "lucide-react";
import clsx from "clsx";

interface Habit {
  _id: string;
  title: string;
}

interface HabitLog {
  _id: string;
  habitId: string;
  date: string;
  completed: boolean;
}

interface HabitGridProps {
  habits: Habit[];
  logs: HabitLog[];
  daysInMonth: Date[];
  onToggle: (habitId: string, dateStr: string, completed: boolean) => void;
}

export function HabitGrid({ habits, logs, daysInMonth, onToggle }: HabitGridProps) {
  // Create a fast lookup map: "habitId-dateStr" -> completed boolean
  const logsMap = new Map<string, boolean>();
  logs.forEach((log) => {
    logsMap.set(`${log.habitId}-${log.date}`, log.completed);
  });

  return (
    <div className="mt-8 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-[#0a0a0a]">
      <div className="overflow-x-auto pb-4">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr>
              <th className="sticky left-0 z-20 min-w-[200px] border-b border-zinc-200 bg-zinc-50 px-4 py-4 font-semibold text-zinc-600 dark:border-zinc-800 dark:bg-[#121212] dark:text-zinc-300 shadow-[1px_0_0_0_#e4e4e7] dark:shadow-[1px_0_0_0_#27272a]">
                Habits
              </th>
              {daysInMonth.map((day) => {
                const isDayToday = isToday(day);
                return (
                  <th
                    key={day.toISOString()}
                    className={clsx(
                      "min-w-[48px] border-b border-zinc-200 px-2 py-4 text-center font-medium dark:border-zinc-800 transition-colors",
                      isDayToday
                        ? "bg-indigo-50/50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400"
                        : "text-zinc-500 dark:text-zinc-400"
                    )}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-[10px] uppercase tracking-wider opacity-70">
                        {format(day, "EEE")}
                      </span>
                      <span className={clsx("text-base", isDayToday && "font-bold")}>
                        {format(day, "d")}
                      </span>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {habits.map((habit) => (
              <tr key={habit._id} className="group transition-colors hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30">
                <td className="sticky left-0 z-10 border-r border-zinc-200 bg-white px-4 py-3 font-medium text-zinc-900 group-hover:bg-zinc-50 dark:border-zinc-800 dark:bg-[#0a0a0a] dark:text-zinc-100 dark:group-hover:bg-[#121212] shadow-[1px_0_0_0_#e4e4e7] dark:shadow-[1px_0_0_0_#27272a]">
                  {habit.title}
                </td>
                {daysInMonth.map((day) => {
                  const dateStr = format(day, "yyyy-MM-dd");
                  const isCompleted = logsMap.get(`${habit._id}-${dateStr}`) || false;
                  const isFutureDate = isFuture(day) && !isToday(day);

                  return (
                    <td key={dateStr} className="px-2 py-3 text-center">
                      <button
                        disabled={isFutureDate}
                        onClick={() => onToggle(habit._id, dateStr, !isCompleted)}
                        className={clsx(
                          "mx-auto flex h-8 w-8 items-center justify-center rounded-[10px] border transition-all duration-300",
                          isFutureDate
                            ? "cursor-not-allowed border-zinc-100 bg-zinc-50 opacity-50 dark:border-zinc-800/50 dark:bg-zinc-900/30"
                            : isCompleted
                            ? "border-transparent bg-gradient-to-tr from-emerald-400 to-teal-500 text-white shadow-[0_0_10px_rgba(52,211,153,0.4)] hover:shadow-[0_0_15px_rgba(52,211,153,0.6)] hover:scale-105"
                            : "border-zinc-200 bg-zinc-50/50 text-transparent hover:border-emerald-400 hover:bg-emerald-50 dark:border-zinc-800 dark:bg-[#121212] dark:hover:border-emerald-500/50 dark:hover:bg-emerald-500/10"
                        )}
                      >
                        <Check className="h-4 w-4" strokeWidth={3} />
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
