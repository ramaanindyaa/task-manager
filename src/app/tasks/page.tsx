import { Priority, Prisma } from "@prisma/client";
import Link from "next/link";

import { getReminderTasks } from "@/actions/task-actions";
import { FilterBar } from "@/components/FilterBar";
import { KeyboardShortcuts } from "@/components/KeyboardShortcuts";
import { Pagination } from "@/components/Pagination";
import { ReminderPanel } from "@/components/ReminderPanel";
import { SearchBar } from "@/components/SearchBar";
import { ShareListPanel } from "@/components/ShareListPanel";
import { TaskForm } from "@/components/TaskForm";
import { TaskList } from "@/components/TaskList";
import { ThemeToggle } from "@/components/ThemeToggle";
import { requireAuth } from "@/lib/auth-helpers";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

interface TasksPageProps {
  searchParams: Promise<{
    search?: string;
    priority?: string;
    completed?: string;
    page?: string;
  }>;
}

const PER_PAGE = 10;
const PRIORITIES = new Set<Priority>([
  Priority.LOW,
  Priority.MEDIUM,
  Priority.HIGH,
  Priority.URGENT,
]);

export default async function TasksPage({ searchParams }: TasksPageProps) {
  const params = await searchParams;
  const user = await requireAuth();
  const page = Number(params.page) > 0 ? Number(params.page) : 1;

  const priority =
    params.priority && PRIORITIES.has(params.priority as Priority)
      ? (params.priority as Priority)
      : undefined;

  const where: Prisma.TaskWhereInput = {
    userId: user.id,
    ...(params.search && {
      OR: [
        { title: { contains: params.search, mode: "insensitive" } },
        { description: { contains: params.search, mode: "insensitive" } },
      ],
    }),
    ...(priority && { priority }),
    ...(params.completed !== undefined && {
      completed: params.completed === "true",
    }),
  };

  const [tasks, total, completedTotal, reminders, userData] = await Promise.all([
    db.task.findMany({
      where,
      include: {
        category: true,
        comments: {
          orderBy: { createdAt: "asc" },
        },
        attachments: {
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: [{ position: "asc" }, { createdAt: "desc" }],
      skip: (page - 1) * PER_PAGE,
      take: PER_PAGE,
    }),
    db.task.count({ where }),
    db.task.count({ where: { ...where, completed: true } }),
    getReminderTasks(),
    db.user.findUnique({
      where: { id: user.id },
      select: { sharedToken: true },
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));
  const now = new Date();
  const tasksForList = tasks.map((task) => ({
    ...task,
    isOverdue: !!task.dueDate && task.dueDate.getTime() < now.getTime() && !task.completed,
  }));

  const stats = {
    total,
    completed: completedTotal,
    pending: total - completedTotal,
  };

  const progressPercent =
    stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <KeyboardShortcuts />

      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">My Tasks</h1>
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard"
            className="rounded-lg border border-[#222] bg-[#111] px-3 py-2 text-sm text-gray-300 transition-colors hover:text-white"
          >
            Dashboard
          </Link>
          <ThemeToggle />
        </div>
      </div>
      <p className="mb-1 text-gray-500">
        {stats.completed}/{stats.total} selesai
      </p>
      <p className="mb-8 text-sm text-gray-600">{stats.pending} task pending</p>

      <ReminderPanel reminders={reminders} />

      <ShareListPanel initialToken={userData?.sharedToken ?? null} />

      <div className="mb-8 h-2 w-full rounded-full bg-[#1a1a1a]">
        <div
          className="h-full rounded-full bg-[#E50914] transition-all"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="mb-8">
        <TaskForm />
      </div>

      <div className="mb-4">
        <SearchBar defaultValue={params.search} />
      </div>

      <div className="mb-4">
        <FilterBar priority={params.priority} completed={params.completed} />
      </div>

      <TaskList tasks={tasksForList} />

      <Pagination currentPage={page} totalPages={totalPages} />
    </div>
  );
}
