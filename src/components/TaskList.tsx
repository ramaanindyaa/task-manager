"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Check,
  Clock,
  GripVertical,
  MessageSquare,
  Paperclip,
  Pencil,
  Trash2,
  X,
} from "lucide-react";

import {
  addAttachment,
  addComment,
  deleteComment,
  deleteTask,
  removeAttachment,
  reorderTasks,
  toggleTask,
} from "@/actions/task-actions";
import { EditTaskModal } from "@/components/EditTaskModal";
import { FileUpload } from "@/components/FileUpload";
import { showToast } from "@/components/ToastContainer";

type TaskListItem = {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  dueDate: Date | null;
  isOverdue: boolean;
  position: number;
  createdAt: Date;
  category: { name: string; color: string } | null;
  comments: { id: string; content: string; createdAt: Date }[];
  attachments: { id: string; name: string; path: string; url: string }[];
};

export function TaskList({ tasks }: { tasks: TaskListItem[] }) {
  const [orderedTasks, setOrderedTasks] = useState(tasks);
  const [editingTask, setEditingTask] = useState<TaskListItem | null>(null);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);
  const [openTaskId, setOpenTaskId] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState<Record<string, string>>({});

  useEffect(() => {
    setOrderedTasks(tasks);
  }, [tasks]);

  const sortedTasks = useMemo(
    () => [...orderedTasks].sort((a, b) => a.position - b.position),
    [orderedTasks]
  );

  if (orderedTasks.length === 0) {
    return (
      <div className="py-12 text-center text-gray-600">
        <p className="text-lg">Belum ada task</p>
        <p className="mt-2 text-sm">Tambahkan task pertamamu di atas!</p>
      </div>
    );
  }

  const priorityColors: Record<TaskListItem["priority"], string> = {
    LOW: "#4ade80",
    MEDIUM: "#fbbf24",
    HIGH: "#f97316",
    URGENT: "#ef4444",
  };

  async function onReorder(sourceTaskId: string, targetTaskId: string) {
    if (sourceTaskId === targetTaskId) return;

    const next = [...sortedTasks];
    const sourceIndex = next.findIndex((task) => task.id === sourceTaskId);
    const targetIndex = next.findIndex((task) => task.id === targetTaskId);
    if (sourceIndex < 0 || targetIndex < 0) return;

    const [moved] = next.splice(sourceIndex, 1);
    next.splice(targetIndex, 0, moved);
    const positioned = next.map((task, index) => ({ ...task, position: index }));
    setOrderedTasks(positioned);

    const result = await reorderTasks(positioned.map((task) => task.id));
    if (result?.error) {
      showToast(result.error, "error");
      setOrderedTasks(tasks);
      return;
    }
    showToast("Urutan task diperbarui", "success");
  }

  async function handleAddComment(taskId: string) {
    const content = commentInput[taskId] || "";
    const result = await addComment(taskId, content);
    if (result?.success) {
      showToast("Komentar ditambahkan", "success");
      setCommentInput((prev) => ({ ...prev, [taskId]: "" }));
    } else if (result?.error) {
      showToast(result.error, "error");
    }
  }

  return (
    <div className="space-y-2">
      {sortedTasks.map((task) => (
        <div
          key={task.id}
          draggable
          onDragStart={(event) => {
            event.dataTransfer.setData("text/plain", task.id);
          }}
          onDragOver={(event) => event.preventDefault()}
          onDrop={async (event) => {
            event.preventDefault();
            const sourceTaskId = event.dataTransfer.getData("text/plain");
            await onReorder(sourceTaskId, task.id);
          }}
          className={`group flex items-start gap-3 rounded-xl border border-[#1a1a1a] bg-[#111] p-4 transition-all hover:border-[#333] ${
            task.completed ? "opacity-60" : ""
          }`}
        >
          <span className="mt-1 text-gray-600">
            <GripVertical className="h-4 w-4" />
          </span>

          <button
            onClick={async () => {
              const result = await toggleTask(task.id);
              if (result?.success) {
                showToast("Status task diperbarui", "success");
              } else if (result?.error) {
                showToast(result.error, "error");
              }
            }}
            className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
              task.completed
                ? "border-[#E50914] bg-[#E50914]"
                : "border-gray-600 hover:border-[#E50914]"
            }`}
            aria-label={`Toggle task ${task.title}`}
          >
            {task.completed ? <Check className="h-3.5 w-3.5 text-black" /> : null}
          </button>

          <div className="min-w-0 flex-1">
            <p
              className={`font-medium ${
                task.completed ? "text-gray-600 line-through" : "text-white"
              }`}
            >
              {task.title}
            </p>

            {task.description ? (
              <p className="mt-1 text-sm text-gray-500">{task.description}</p>
            ) : null}

            <div className="mt-2 flex items-center gap-3">
              <span
                className="rounded px-2 py-0.5 text-xs"
                style={{
                  backgroundColor: `${priorityColors[task.priority]}15`,
                  color: priorityColors[task.priority],
                }}
              >
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

              <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                <Clock className="h-3.5 w-3.5" />
                {new Date(task.createdAt).toLocaleDateString("id-ID")}
              </span>

              {task.dueDate ? (
                <span
                  className={`rounded px-2 py-0.5 text-xs ${
                    task.isOverdue
                      ? "bg-red-500/20 text-red-300"
                      : "bg-blue-500/20 text-blue-300"
                  }`}
                >
                  Due {new Date(task.dueDate).toLocaleString("id-ID")}
                </span>
              ) : null}
            </div>

            <button
              onClick={() => setOpenTaskId((prev) => (prev === task.id ? null : task.id))}
              className="mt-3 inline-flex items-center gap-1 text-xs text-gray-400 hover:text-white"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              Notes & Attachments
            </button>

            {openTaskId === task.id ? (
              <div className="mt-3 space-y-3 rounded-lg border border-[#222] bg-[#0d0d0d] p-3">
                <div>
                  <div className="mb-2 text-xs uppercase tracking-wide text-gray-500">
                    Comments
                  </div>
                  <div className="space-y-2">
                    {task.comments.map((comment) => (
                      <div
                        key={comment.id}
                        className="flex items-start justify-between rounded-md bg-[#121212] p-2"
                      >
                        <p className="pr-2 text-xs text-gray-300">{comment.content}</p>
                        <button
                          onClick={async () => {
                            const result = await deleteComment(comment.id);
                            if (result?.success) {
                              showToast("Komentar dihapus", "success");
                            }
                          }}
                          className="text-gray-500 hover:text-red-400"
                          aria-label="Delete comment"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 flex gap-2">
                    <input
                      value={commentInput[task.id] || ""}
                      onChange={(event) =>
                        setCommentInput((prev) => ({
                          ...prev,
                          [task.id]: event.target.value,
                        }))
                      }
                      placeholder="Tambah komentar"
                      className="w-full rounded-md border border-[#222] bg-[#111] px-3 py-2 text-xs text-white"
                    />
                    <button
                      onClick={() => handleAddComment(task.id)}
                      className="rounded-md bg-[#E50914] px-3 py-2 text-xs font-semibold text-black"
                    >
                      Kirim
                    </button>
                  </div>
                </div>

                <div>
                  <div className="mb-2 text-xs uppercase tracking-wide text-gray-500">
                    Attachments
                  </div>
                  <div className="space-y-2">
                    {task.attachments.map((attachment) => (
                      <div
                        key={attachment.id}
                        className="flex items-center justify-between rounded-md bg-[#121212] px-2 py-1"
                      >
                        <a
                          href={attachment.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-blue-300 hover:text-blue-200"
                        >
                          <Paperclip className="h-3.5 w-3.5" />
                          {attachment.name}
                        </a>
                        <button
                          onClick={async () => {
                            const result = await removeAttachment(attachment.id);
                            if (result?.success) {
                              showToast("Attachment dihapus", "success");
                            }
                          }}
                          className="text-gray-500 hover:text-red-400"
                          aria-label="Delete attachment"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="mt-2">
                    <FileUpload
                      onUpload={async ({ url, path, name }) => {
                        const result = await addAttachment({
                          taskId: task.id,
                          url,
                          path,
                          name,
                        });
                        if (result?.success) {
                          showToast("Attachment berhasil ditambahkan", "success");
                        } else if (result?.error) {
                          showToast(result.error, "error");
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          <div className="flex items-center gap-1 opacity-0 transition-all group-hover:opacity-100">
            <button
              onClick={() => setEditingTask(task)}
              className="p-1.5 text-gray-600 transition-all hover:text-blue-400"
              aria-label={`Edit task ${task.title}`}
            >
              <Pencil className="h-4 w-4" />
            </button>

            <button
              onClick={() => setDeletingTaskId(task.id)}
              className="p-1.5 text-gray-600 transition-all hover:text-red-400"
              aria-label={`Delete task ${task.title}`}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}

      {editingTask ? (
        <EditTaskModal
          task={{
            id: editingTask.id,
            title: editingTask.title,
            description: editingTask.description,
            priority: editingTask.priority,
            dueDate: editingTask.dueDate,
          }}
          onClose={() => setEditingTask(null)}
        />
      ) : null}

      {deletingTaskId ? (
        <DeleteConfirm
          taskId={deletingTaskId}
          onClose={() => setDeletingTaskId(null)}
        />
      ) : null}
    </div>
  );
}

function DeleteConfirm({
  taskId,
  onClose,
}: {
  taskId: string;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="max-w-sm rounded-2xl border border-[#222] bg-[#111] p-6">
        <h3 className="mb-2 text-lg font-bold text-white">Hapus Task?</h3>
        <p className="mb-6 text-sm text-gray-500">
          Task yang sudah dihapus tidak bisa dikembalikan.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-[#333] px-4 py-2 text-gray-400"
          >
            Batal
          </button>
          <button
            onClick={async () => {
              const result = await deleteTask(taskId);
              if (result?.success) {
                showToast("Task berhasil dihapus", "success");
              } else if (result?.error) {
                showToast(result.error, "error");
              }
              onClose();
            }}
            className="flex-1 rounded-xl bg-red-500 px-4 py-2 font-bold text-white"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}
