"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";

import { initialTaskActionState } from "@/actions/task-action-state";
import { createTask } from "@/actions/task-actions";
import { showToast } from "@/components/ToastContainer";
import { devLog } from "@/lib/debug";

export function TaskForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, action] = useActionState(createTask, initialTaskActionState);

  useEffect(() => {
    devLog("TaskForm:state_change", state);

    if (state.success) {
      formRef.current?.reset();
      showToast("Task berhasil ditambahkan", "success");
      return;
    }

    if (state.errors?._form?.[0]) {
      showToast(state.errors._form[0], "error");
    }
  }, [state]);

  return (
    <form ref={formRef} action={action} className="space-y-4">
      <div>
        <input
          id="new-task-title"
          name="title"
          placeholder="Apa yang mau kamu kerjakan?"
          className="w-full rounded-xl border border-[#222] bg-[#111] px-4 py-3 text-white placeholder-gray-600 focus:border-[#E50914] focus:outline-none"
          required
        />
        {state.errors?.title ? (
          <p className="mt-1 text-sm text-red-400">{state.errors.title[0]}</p>
        ) : null}
      </div>

      <div>
        <textarea
          name="description"
          placeholder="Deskripsi (opsional)"
          className="w-full rounded-xl border border-[#222] bg-[#111] px-4 py-3 text-white placeholder-gray-600 focus:border-[#E50914] focus:outline-none"
          rows={3}
        />
        {state.errors?.description ? (
          <p className="mt-1 text-sm text-red-400">
            {state.errors.description[0]}
          </p>
        ) : null}
      </div>

      <div>
        <input
          name="dueDate"
          type="datetime-local"
          className="w-full rounded-xl border border-[#222] bg-[#111] px-4 py-3 text-white"
        />
        {state.errors?.dueDate ? (
          <p className="mt-1 text-sm text-red-400">{state.errors.dueDate[0]}</p>
        ) : null}
      </div>

      <div>
        <select
          name="priority"
          defaultValue="MEDIUM"
          className="rounded-lg border border-[#222] bg-[#111] px-4 py-2 text-white"
        >
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
          <option value="URGENT">Urgent</option>
        </select>
        {state.errors?.priority ? (
          <p className="mt-1 text-sm text-red-400">{state.errors.priority[0]}</p>
        ) : null}
      </div>

      {state.errors?._form ? (
        <p className="text-sm text-red-400">{state.errors._form[0]}</p>
      ) : null}

      {state.success ? (
        <p className="text-sm text-green-400">Task berhasil ditambahkan.</p>
      ) : null}

      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="flex items-center gap-2 rounded-xl bg-[#E50914] px-6 py-3 font-bold text-black transition-all disabled:opacity-50"
    >
      {pending ? (
        <>
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-black/30 border-t-black" />
          Menyimpan...
        </>
      ) : (
        "Tambah Task"
      )}
    </button>
  );
}
