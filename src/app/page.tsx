import { TaskForm } from "@/components/TaskForm";

export default function Home() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-3xl p-6 md:p-10">
      <section className="space-y-4 rounded-2xl border border-zinc-800 bg-black/80 p-6">
        <h1 className="text-2xl font-bold text-white md:text-3xl">Task Manager</h1>
        <p className="text-sm text-zinc-400">
          Tambah task baru lewat Server Actions dengan validasi Zod.
        </p>
        <TaskForm />
      </section>
      <section className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-950 p-4 text-sm text-zinc-400">
        Endpoint API tersedia di /api/tasks, /api/tasks/:id, dan /api/categories.
      </section>
    </main>
  );
}
