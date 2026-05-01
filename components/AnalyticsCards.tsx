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
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
      <Card
        title="Monthly Progress"
        value={`${monthlyProgress}%`}
        icon={<Target className="h-6 w-6 text-indigo-500 dark:text-indigo-400" />}
        subtitle={`${totalGoalsCompleted} goals completed`}
        progress={monthlyProgress}
        gradient="from-indigo-500 to-cyan-400"
        bgGlow="group-hover:shadow-indigo-500/20"
      />
      <Card
        title="Daily Progress"
        value={`${dailyProgress}%`}
        icon={<CheckCircle2 className="h-6 w-6 text-emerald-500 dark:text-emerald-400" />}
        subtitle="Today's completion"
        progress={dailyProgress}
        gradient="from-emerald-400 to-teal-500"
        bgGlow="group-hover:shadow-emerald-500/20"
      />
      <Card
        title="Current Streak"
        value={`${currentStreak} Days`}
        icon={<Flame className="h-6 w-6 text-orange-500 dark:text-orange-400" />}
        subtitle="Keep it up!"
        progress={currentStreak > 0 ? 100 : 0}
        gradient="from-orange-400 to-rose-500"
        bgGlow="group-hover:shadow-orange-500/20"
      />
      <Card
        title="Goals Remaining"
        value={totalGoalsIncomplete.toString()}
        icon={<CircleDashed className="h-6 w-6 text-zinc-500 dark:text-zinc-400" />}
        subtitle="This month"
        progress={0}
        gradient="from-zinc-400 to-zinc-500"
        bgGlow="group-hover:shadow-zinc-500/10"
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
  gradient,
  bgGlow,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  subtitle: string;
  progress: number;
  gradient: string;
  bgGlow: string;
}) {
  return (
    <div className={`group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-zinc-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 dark:border-zinc-800 dark:bg-[#0a0a0a] ${bgGlow}`}>
      <div className="flex items-center justify-between relative z-10">
        <h3 className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">
          {title}
        </h3>
        <div className={`rounded-xl bg-gradient-to-tr ${gradient} p-[1px]`}>
          <div className="flex h-10 w-10 items-center justify-center rounded-[11px] bg-white dark:bg-[#0a0a0a]">
            {icon}
          </div>
        </div>
      </div>
      <div className="mt-4 relative z-10">
        <p className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
          {value}
        </p>
        <p className="mt-1 text-sm font-medium text-zinc-500 dark:text-zinc-400">
          {subtitle}
        </p>
      </div>
      <div className="mt-5 h-2.5 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800/50">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${gradient} transition-all duration-1000 ease-out`}
          style={{ width: `${progress}%` }}
        />
      </div>
      
      {/* Background decoration */}
      <div className={`absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${gradient} opacity-[0.03] dark:opacity-[0.05] group-hover:scale-150 transition-transform duration-500`} />
    </div>
  );
}
