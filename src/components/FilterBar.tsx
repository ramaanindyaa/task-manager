"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function FilterBar({
  priority,
  completed,
}: {
  priority?: string;
  completed?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateFilter(key: "priority" | "completed", value: string) {
    const params = new URLSearchParams(searchParams);

    if (!value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    params.delete("page");
    const queryString = params.toString();
    router.push(queryString ? `/tasks?${queryString}` : "/tasks");
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <select
        value={priority || ""}
        onChange={(e) => updateFilter("priority", e.target.value)}
        className="rounded-lg border border-[#222] bg-[#111] px-3 py-2 text-sm text-white"
      >
        <option value="">Semua Priority</option>
        <option value="LOW">Low</option>
        <option value="MEDIUM">Medium</option>
        <option value="HIGH">High</option>
        <option value="URGENT">Urgent</option>
      </select>

      <select
        value={completed || ""}
        onChange={(e) => updateFilter("completed", e.target.value)}
        className="rounded-lg border border-[#222] bg-[#111] px-3 py-2 text-sm text-white"
      >
        <option value="">Semua Status</option>
        <option value="false">Pending</option>
        <option value="true">Completed</option>
      </select>
    </div>
  );
}
