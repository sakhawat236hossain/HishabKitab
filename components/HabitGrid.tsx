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
    <div className="mt-8 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="overflow-x-auto pb-4">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr>
              <th className="sticky left-0 z-20 min-w-[200px] border-b border-zinc-200 bg-zinc-50 px-4 py-4 font-medium text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/95 dark:text-zinc-400">
                Habits
              </th>
              {daysInMonth.map((day) => {
                const isDayToday = isToday(day);
                return (
                  <th
                    key={day.toISOString()}
                    className={clsx(
                      "min-w-[48px] border-b border-zinc-200 px-2 py-4 text-center font-medium dark:border-zinc-800",
                      isDayToday
                        ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
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
              <tr key={habit._id} className="group transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                <td className="sticky left-0 z-10 border-r border-zinc-200 bg-white px-4 py-3 font-medium text-zinc-900 group-hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:group-hover:bg-[#1f1f22]">
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
                          "mx-auto flex h-8 w-8 items-center justify-center rounded-lg border transition-all duration-200",
                          isFutureDate
                            ? "cursor-not-allowed border-zinc-100 bg-zinc-50 opacity-50 dark:border-zinc-800 dark:bg-zinc-900/50"
                            : isCompleted
                            ? "border-emerald-500 bg-emerald-500 text-white shadow-sm hover:bg-emerald-600 dark:border-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-500"
                            : "border-zinc-200 bg-white text-transparent hover:border-emerald-500/50 hover:bg-emerald-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-emerald-500/50 dark:hover:bg-emerald-500/10"
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
