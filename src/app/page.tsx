import { CalendarClock, ChartNoAxesCombined, FileUp, Gauge, KanbanSquare, Layers, Share2, Sparkles, Tags } from "lucide-react";
import Link from "next/link";

import { MotionReveal } from "@/components/MotionReveal";

export default function Home() {
  const authCtaHref = {
    github: "/api/auth/signin?provider=github&callbackUrl=%2Ftasks",
    google: "/api/auth/signin?provider=google&callbackUrl=%2Ftasks",
  };

  const details = [
    {
      title: "Priority Levels That Keep Focus Sharp",
      description:
        "Move from low-noise planning to high-impact execution with clear priority labels and instant visual cues.",
      icon: Gauge,
    },
    {
      title: "Categories That Make Work Findable",
      description:
        "Group tasks by team, project, or context to keep every board clean and every search meaningful.",
      icon: Tags,
    },
    {
      title: "Task Sharing Without The Friction",
      description:
        "Share task lists in a tap, keep collaborators aligned, and reduce status-chasing across your team.",
      icon: Share2,
    },
    {
      title: "Seamless Dark And Light Theme Toggle",
      description:
        "Work the way your eyes prefer while preserving a consistent, polished experience across every screen.",
      icon: Layers,
    },
  ];

  return (
    <main className="relative min-h-screen overflow-hidden bg-ocean-deep text-ocean-foam">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_20%,rgba(45,212,191,0.16),transparent_42%),radial-gradient(circle_at_85%_15%,rgba(56,189,248,0.2),transparent_38%),radial-gradient(circle_at_50%_100%,rgba(14,165,233,0.16),transparent_45%)]" />
      <div className="ocean-grid absolute inset-0 -z-10 opacity-45" />

      <header className="ocean-shell sticky top-0 z-20 pt-4">
        <nav className="ocean-glass flex items-center justify-between rounded-ocean-card px-4 py-3 sm:px-5">
          <p className="text-sm font-semibold tracking-[0.24em] text-cyan-100">WAVEBOARD</p>
          <div className="hidden items-center gap-7 text-sm text-slate-200/90 md:flex">
            <a href="#features" className="transition hover:text-teal-300">Features</a>
            <a href="#details" className="transition hover:text-teal-300">Details</a>
            <a href="#start" className="transition hover:text-teal-300">Start</a>
          </div>
          <Link
            href="/tasks"
            className="rounded-full border border-cyan-300/50 bg-cyan-200/20 px-4 py-2 text-xs font-semibold text-cyan-100 transition hover:bg-cyan-200/35"
          >
            Open App
          </Link>
        </nav>
      </header>

      <section className="ocean-shell grid gap-10 pb-24 pt-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12 lg:pt-20">
        <div className="space-y-8">
          <MotionReveal delay={0.05}>
            <span className="ocean-glass inline-flex items-center gap-2 rounded-ocean-pill px-3 py-1 text-xs font-medium tracking-wide text-teal-100">
              <Sparkles className="size-3.5" />
              Ocean Theme Productivity Suite
            </span>
          </MotionReveal>
          <MotionReveal delay={0.12}>
            <h1 className="text-balance text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
              Ride the Wave of Productivity
            </h1>
          </MotionReveal>
          <MotionReveal delay={0.2}>
            <p className="ocean-muted max-w-2xl text-base leading-7 sm:text-lg">
              Manage projects, track outcomes, and move fast with a beautifully fluid task platform built for teams that value focus and flow.
            </p>
          </MotionReveal>
          <MotionReveal delay={0.28}>
            <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href={authCtaHref.github}
              className="ocean-cta-primary inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold transition hover:-translate-y-0.5 hover:brightness-110"
            >
              Login with GitHub
            </Link>
            <Link
              href={authCtaHref.google}
              className="ocean-cta-secondary inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold transition hover:-translate-y-0.5 hover:bg-white/20"
            >
              Login with Google
            </Link>
            </div>
          </MotionReveal>
          <MotionReveal delay={0.35}>
            <div className="ocean-muted flex flex-wrap gap-6 text-sm">
              <p>Realtime updates</p>
              <p>Fast keyboard workflow</p>
              <p>Insightful analytics</p>
            </div>
          </MotionReveal>
        </div>

        <MotionReveal className="relative mt-4 lg:mt-0" delay={0.18}>
          <div className="pointer-events-none absolute -left-8 -top-8 h-28 w-28 rounded-full bg-cyan-300/25 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-7 -right-6 h-32 w-32 rounded-full bg-blue-500/25 blur-2xl" />
          <div className="ocean-card ocean-glass relative overflow-hidden p-4 shadow-[0_25px_60px_rgba(2,6,23,0.6)]">
            <div className="mb-4 flex items-center justify-between rounded-2xl bg-slate-800/70 px-4 py-3 text-sm text-slate-200">
              <p className="font-semibold">Ocean Dashboard</p>
              <p className="rounded-full bg-teal-300/25 px-3 py-1 text-xs text-teal-100">14 Tasks Done</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                <p className="mb-2 text-xs uppercase tracking-wider text-cyan-100/80">Kanban</p>
                <div className="space-y-2">
                  <div className="rounded-lg bg-cyan-200/20 px-2.5 py-2 text-xs text-cyan-100">Design landing page</div>
                  <div className="rounded-lg bg-slate-700/80 px-2.5 py-2 text-xs text-slate-200">Review sprint goals</div>
                  <div className="rounded-lg border border-dashed border-teal-300/40 bg-teal-300/10 px-2.5 py-2 text-xs text-teal-100">
                    Drag task here
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                <p className="mb-3 text-xs uppercase tracking-wider text-cyan-100/80">Analytics</p>
                <div className="flex h-32 items-end gap-2">
                  <span className="h-8 w-5 rounded-md bg-cyan-300/40" />
                  <span className="h-14 w-5 rounded-md bg-cyan-300/55" />
                  <span className="h-10 w-5 rounded-md bg-cyan-300/45" />
                  <span className="h-20 w-5 rounded-md bg-blue-400/70" />
                  <span className="h-16 w-5 rounded-md bg-blue-400/55" />
                </div>
              </div>
            </div>
          </div>
        </MotionReveal>
      </section>

      <div className="wave-divider -mt-1" />

      <MotionReveal className="ocean-shell ocean-section" delay={0.04}>
      <section id="features">
        <div className="mb-10 max-w-2xl space-y-3">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-teal-300">Feature Grid</p>
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">Everything You Need, In One Fluid Workspace</h2>
        </div>

        <div className="grid auto-rows-[190px] gap-4 md:grid-cols-6">
          <MotionReveal className="h-full md:col-span-4 md:row-span-2" delay={0.06}>
          <article className="ocean-card ocean-glass group relative h-full overflow-hidden p-6 transition hover:border-cyan-200/45">
            <KanbanSquare className="mb-4 size-8 text-cyan-200" />
            <h3 className="text-xl font-semibold text-white">Drag &amp; Drop Kanban Board</h3>
            <p className="mt-2 max-w-lg text-sm text-slate-200/90">
              Move tasks between lanes with natural motion and instant updates, so priorities shift without slowing momentum.
            </p>
            <div className="mt-6 grid max-w-md grid-cols-3 gap-2 text-xs">
              <span className="rounded-md bg-cyan-300/20 p-2 text-cyan-100">Backlog</span>
              <span className="rounded-md bg-sky-300/20 p-2 text-sky-100">In Progress</span>
              <span className="rounded-md bg-teal-300/20 p-2 text-teal-100">Completed</span>
            </div>
          </article>
          </MotionReveal>

          <MotionReveal className="h-full md:col-span-2 md:row-span-1" delay={0.14}>
          <article className="ocean-card ocean-glass h-full p-6">
            <ChartNoAxesCombined className="mb-3 size-7 text-cyan-200" />
            <h3 className="text-lg font-semibold text-white">Analytics Dashboard</h3>
            <p className="mt-1 text-sm text-slate-200/85">Track completion trends and sprint health in seconds.</p>
            <div className="mt-4 flex gap-1.5">
              <span className="h-2 w-16 rounded-full bg-cyan-300/65" />
              <span className="h-2 w-8 rounded-full bg-blue-400/50" />
              <span className="h-2 w-10 rounded-full bg-teal-300/50" />
            </div>
          </article>
          </MotionReveal>

          <MotionReveal className="h-full md:col-span-2 md:row-span-1" delay={0.2}>
          <article className="ocean-card ocean-glass h-full p-6">
            <FileUp className="mb-3 size-7 text-cyan-200" />
            <h3 className="text-lg font-semibold text-white">Seamless File Attachments</h3>
            <p className="mt-1 text-sm text-slate-200/85">Drop specs, assets, and docs directly into tasks.</p>
          </article>
          </MotionReveal>

          <MotionReveal className="h-full md:col-span-3 md:row-span-1" delay={0.24}>
          <article className="ocean-card ocean-glass h-full p-6">
            <CalendarClock className="mb-3 size-7 text-cyan-200" />
            <h3 className="text-lg font-semibold text-white">Smart Calendar &amp; Due Dates</h3>
            <p className="mt-1 text-sm text-slate-200/85">See timelines clearly and catch deadlines before they become blockers.</p>
          </article>
          </MotionReveal>

          <MotionReveal className="h-full md:col-span-3 md:row-span-1" delay={0.3}>
          <article className="ocean-card ocean-glass h-full p-6">
            <Gauge className="mb-3 size-7 text-cyan-200" />
            <h3 className="text-lg font-semibold text-white">Keyboard Shortcuts &amp; Speed</h3>
            <p className="mt-1 text-sm text-slate-200/85">Power users can navigate, create, and complete tasks with near-zero friction.</p>
          </article>
          </MotionReveal>
        </div>
      </section>
      </MotionReveal>

      <section id="details" className="ocean-shell ocean-section">
        <div className="mb-10 max-w-2xl space-y-3">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-teal-300">Details That Matter</p>
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">Refined For Daily Team Work</h2>
        </div>

        <div className="space-y-4">
          {details.map((item, index) => {
            const Icon = item.icon;

            return (
              <MotionReveal
                key={item.title}
                className={`ocean-card ocean-glass p-5 sm:p-6 ${
                  index % 2 === 0 ? "lg:mr-20" : "lg:ml-20"
                }`}
                delay={index * 0.08}
              >
                <div className="flex items-start gap-4">
                  <div className="rounded-2xl bg-linear-to-br from-teal-400 to-blue-600 p-3 text-white">
                    <Icon className="size-5" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                    <p className="text-sm leading-7 text-slate-200/85">{item.description}</p>
                  </div>
                </div>
              </MotionReveal>
            );
          })}
        </div>
      </section>

      <section id="start" className="ocean-shell pb-10 pt-6">
        <MotionReveal>
        <div className="ocean-card ocean-glass bg-linear-to-br from-teal-400/25 to-blue-600/25 px-6 py-12 text-center sm:px-10">
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">Start Organizing Tasks With Confidence</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-100/90 sm:text-base">
            Join teams that have replaced scattered notes and slow status meetings with one clear, modern command center.
          </p>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href={authCtaHref.github}
              className="ocean-cta-primary rounded-xl px-6 py-3 text-sm font-semibold transition hover:-translate-y-0.5 hover:brightness-110"
            >
              Login with GitHub
            </Link>
            <Link
              href={authCtaHref.google}
              className="ocean-cta-secondary rounded-xl px-6 py-3 text-sm font-semibold transition hover:bg-white/20"
            >
              Login with Google
            </Link>
          </div>
        </div>
        </MotionReveal>
      </section>

      <footer className="ocean-shell pb-10 pt-6 text-center text-sm text-slate-300/80">
        <p>Built for focused teams. Powered by calm design, fluid motion, and fast task execution.</p>
      </footer>
    </main>
  );
}
