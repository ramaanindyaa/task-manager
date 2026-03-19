import Link from "next/link";
import { Priority } from "@prisma/client";

import { requireAuth } from "@/lib/auth-helpers";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

const priorityLabel: Record<Priority, string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
  URGENT: "Urgent",
};

export default async function DashboardPage() {
  const user = await requireAuth();
  const now = new Date();
  const next24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  const [
    total,
    completed,
    overdue,
    dueSoon,
    priorityBreakdown,
    categories,
  ] = await Promise.all([
    db.task.count({ where: { userId: user.id } }),
    db.task.count({ where: { userId: user.id, completed: true } }),
    db.task.count({
      where: {
        userId: user.id,
        completed: false,
        dueDate: { lt: now },
      },
    }),
    db.task.count({
      where: {
        userId: user.id,
        completed: false,
        dueDate: { gte: now, lte: next24h },
      },
    }),
    db.task.groupBy({
      by: ["priority"],
      where: { userId: user.id },
      _count: { _all: true },
      orderBy: { priority: "asc" },
    }),
    db.category.findMany({
      where: { userId: user.id },
      select: {
        id: true,
        name: true,
        color: true,
        _count: { select: { tasks: true } },
      },
      orderBy: { name: "asc" },
    }),
  ]);

  const pending = total - completed;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Task Analytics</h1>
          <p className="mt-2 text-sm text-gray-500">
            Ringkasan performa task kamu saat ini.
          </p>
        </div>
        <Link
          href="/tasks"
          className="rounded-lg border border-[#222] bg-[#111] px-3 py-2 text-sm text-gray-300 transition-colors hover:text-white"
        >
          Back to Tasks
        </Link>
      </div>

      <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total" value={total} />
        <StatCard label="Completed" value={completed} accent="text-emerald-300" />
        <StatCard label="Pending" value={pending} accent="text-amber-300" />
        <StatCard label="Overdue" value={overdue} accent="text-red-300" />
      </div>

      <div className="mb-8 rounded-xl border border-[#1f1f1f] bg-[#101010] p-5">
        <div className="mb-2 text-sm text-gray-400">Completion rate</div>
        <div className="mb-3 text-3xl font-bold text-white">{completionRate}%</div>
        <div className="h-2 rounded-full bg-[#1a1a1a]">
          <div
            className="h-full rounded-full bg-[#E50914] transition-all"
            style={{ width: `${completionRate}%` }}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-[#1f1f1f] bg-[#101010] p-5">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-400">
            Priority Breakdown
          </h2>
          <ul className="space-y-2 text-sm">
            {Object.values(Priority).map((priority) => {
              const hit = priorityBreakdown.find((item) => item.priority === priority);
              return (
                <li
                  key={priority}
                  className="flex items-center justify-between rounded-lg border border-[#1d1d1d] bg-[#0c0c0c] px-3 py-2 text-gray-300"
                >
                  <span>{priorityLabel[priority]}</span>
                  <span className="font-semibold text-white">{hit?._count._all ?? 0}</span>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="rounded-xl border border-[#1f1f1f] bg-[#101010] p-5">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-400">
            Category Breakdown
          </h2>
          {categories.length === 0 ? (
            <p className="text-sm text-gray-500">Belum ada kategori.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {categories.map((category) => (
                <li
                  key={category.id}
                  className="flex items-center justify-between rounded-lg border border-[#1d1d1d] bg-[#0c0c0c] px-3 py-2"
                >
                  <span className="inline-flex items-center gap-2 text-gray-300">
                    <span
                      className="inline-block h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    {category.name}
                  </span>
                  <span className="font-semibold text-white">{category._count.tasks}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-[#1f1f1f] bg-[#101010] p-4 text-sm text-gray-300">
        Task due dalam 24 jam: <span className="font-semibold text-amber-300">{dueSoon}</span>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: string;
}) {
  return (
    <div className="rounded-xl border border-[#1f1f1f] bg-[#101010] p-4">
      <div className="text-xs uppercase tracking-wide text-gray-500">{label}</div>
      <div className={`mt-2 text-2xl font-bold ${accent ?? "text-white"}`}>{value}</div>
    </div>
  );
}
