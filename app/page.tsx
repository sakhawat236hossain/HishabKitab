import Link from "next/link";
import { ArrowRight, CheckCircle } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-black text-zinc-900 dark:text-zinc-50">
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between px-6 lg:px-12 border-b border-zinc-200 bg-white/70 backdrop-blur-xl dark:border-zinc-800 dark:bg-[#0a0a0a]/70">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-emerald-500 text-white font-bold shadow-md shadow-indigo-500/20">
            H
          </div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-zinc-900 to-zinc-600 bg-clip-text text-transparent dark:from-white dark:to-zinc-400">
            Hishabkitam
          </span>
        </div>
        <nav className="flex items-center gap-4">
          <ThemeToggle />
          <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800" />
          <Link href="/login" className="text-sm font-medium hover:text-zinc-600 dark:hover:text-zinc-300">
            Sign in
          </Link>
          <Link
            href="/register"
            className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          >
            Get Started
          </Link>
        </nav>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24">
        <div className="max-w-3xl space-y-8">
          <h1 className="text-5xl font-bold tracking-tight sm:text-7xl">
            Build Better Habits.
            <br />
            <span className="text-zinc-400 dark:text-zinc-500">Track Every Day.</span>
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            A smart, beautiful, and intuitive way to build the routines that matter most to you. Fully automated and designed for focus.
          </p>
          <div className="flex items-center justify-center gap-4 pt-4">
            <Link
              href="/register"
              className="group flex h-12 items-center justify-center gap-2 rounded-full bg-zinc-900 px-8 text-base font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
            >
              Start Tracking Now
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        <div className="mt-24 grid grid-cols-1 gap-8 sm:grid-cols-3 max-w-5xl mx-auto">
          {[
            { title: "Smart Streaks", desc: "Watch your consistency grow with visual streaks and progress." },
            { title: "Beautiful Grid", desc: "See your whole month at a glance with our intuitive habit matrix." },
            { title: "Auto Setup", desc: "Get started instantly with pre-seeded productivity habits." }
          ].map((feature, i) => (
            <div key={i} className="flex flex-col items-center text-center p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <div className="mb-4 rounded-full bg-emerald-100 p-3 dark:bg-emerald-900/30">
                <CheckCircle className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold">{feature.title}</h3>
              <p className="mt-2 text-zinc-600 dark:text-zinc-400">{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
