import { notFound } from "next/navigation";

import { db } from "@/lib/db";

type SharedTaskPageProps = {
  params: Promise<{ token: string }>;
};

export const dynamic = "force-dynamic";

export default async function SharedTaskPage({ params }: SharedTaskPageProps) {
  const { token } = await params;

  const user = await db.user.findUnique({
    where: { sharedToken: token },
    select: {
      name: true,
      email: true,
      tasks: {
        include: { category: true },
        orderBy: [{ position: "asc" }, { createdAt: "desc" }],
      },
    },
  });

  if (!user) {
    notFound();
  }

  const completed = user.tasks.filter((task) => task.completed).length;

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-bold text-white">Shared Task List</h1>
      <p className="mt-2 text-sm text-gray-500">
        {user.name || user.email || "Pengguna"} membagikan task list ini.
      </p>
      <p className="mt-1 text-sm text-gray-600">
        {completed}/{user.tasks.length} task selesai
      </p>

      <div className="mt-8 space-y-2">
        {user.tasks.length === 0 ? (
          <div className="rounded-xl border border-[#1a1a1a] bg-[#111] p-4 text-sm text-gray-500">
            Belum ada task.
          </div>
        ) : (
          user.tasks.map((task) => (
            <div
              key={task.id}
              className={`rounded-xl border border-[#1a1a1a] bg-[#111] p-4 ${
                task.completed ? "opacity-70" : ""
              }`}
            >
              <div className="flex flex-wrap items-center gap-2">
                <p
                  className={`font-medium ${
                    task.completed ? "text-gray-500 line-through" : "text-white"
                  }`}
                >
                  {task.title}
                </p>
                <span className="rounded bg-[#1a1a1a] px-2 py-0.5 text-xs text-gray-300">
                  {task.priority}
                </span>
                {task.category ? (
                  <span
                    className="rounded px-2 py-0.5 text-xs"
                    style={{
                      backgroundColor: `${task.category.color}15`,
                      color: task.category.color,
                    }}
                  >
                    {task.category.name}
                  </span>
                ) : null}
              </div>

              {task.description ? (
                <p className="mt-1 text-sm text-gray-500">{task.description}</p>
              ) : null}

              <div className="mt-2 text-xs text-gray-600">
                Created {new Date(task.createdAt).toLocaleString("id-ID")}
                {task.dueDate ? ` • Due ${new Date(task.dueDate).toLocaleString("id-ID")}` : ""}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
