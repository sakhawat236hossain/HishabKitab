"use client";

import { Flame, Trophy, Target, CheckCircle2, CircleDashed } from "lucide-react";

interface AnalyticsCardsProps {
  totalGoalsCompleted: number;
  totalGoalsIncomplete: number;
  monthlyProgress: number;
  dailyProgress: number;
  currentStreak: number;
  longestStreak: number;
}

export function AnalyticsCards({
  totalGoalsCompleted,
  totalGoalsIncomplete,
  monthlyProgress,
  dailyProgress,
  currentStreak,
  longestStreak,
}: AnalyticsCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
      <Card
        title="Monthly Progress"
        value={`${monthlyProgress}%`}
        icon={<Target className="h-5 w-5 text-blue-500" />}
        subtitle={`${totalGoalsCompleted} goals completed`}
        progress={monthlyProgress}
        color="bg-blue-500"
      />
      <Card
        title="Daily Progress"
        value={`${dailyProgress}%`}
        icon={<CheckCircle2 className="h-5 w-5 text-emerald-500" />}
        subtitle="Today's completion"
        progress={dailyProgress}
        color="bg-emerald-500"
      />
      <Card
        title="Current Streak"
        value={`${currentStreak} Days`}
        icon={<Flame className="h-5 w-5 text-orange-500" />}
        subtitle="Keep it up!"
        progress={currentStreak > 0 ? 100 : 0}
        color="bg-orange-500"
      />
      <Card
        title="Goals Remaining"
        value={totalGoalsIncomplete.toString()}
        icon={<CircleDashed className="h-5 w-5 text-zinc-400" />}
        subtitle="This month"
        progress={0}
        color="bg-zinc-200 dark:bg-zinc-800"
      />
    </div>
  );
}

function Card({
  title,
  value,
  icon,
  subtitle,
  progress,
  color,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  subtitle: string;
  progress: number;
  color: string;
}) {
  return (
    <div className="flex flex-col justify-between overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
          {title}
        </h3>
        <div className="rounded-full bg-zinc-50 p-2 dark:bg-zinc-800">
          {icon}
        </div>
      </div>
      <div className="mt-4">
        <p className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
          {value}
        </p>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          {subtitle}
        </p>
      </div>
      <div className="mt-4 h-2 w-full rounded-full bg-zinc-100 dark:bg-zinc-800">
        <div
          className={`h-2 rounded-full ${color} transition-all duration-500 ease-in-out`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
