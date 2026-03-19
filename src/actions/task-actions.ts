"use server";

import { revalidatePath } from "next/cache";
import { randomUUID } from "node:crypto";

import { auth } from "@/auth";
import type { TaskActionState } from "@/actions/task-action-state";
import { db } from "@/lib/db";
import { devError, devLog } from "@/lib/debug";
import { deleteFile } from "@/lib/storage";
import { TaskInput, TaskSchema, validateInput } from "@/lib/validations";

const UpdateTaskSchema = TaskSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  "Minimal satu field harus diisi"
);

export async function createTask(
  _prevState: TaskActionState,
  formData: FormData
): Promise<TaskActionState> {
  devLog("createTask:start");

  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return {
      success: false,
      errors: { _form: ["Silakan login dulu"] },
    };
  }

  const rawData = {
    title: formData.get("title"),
    description: formData.get("description"),
    priority: formData.get("priority") || undefined,
    categoryId: formData.get("categoryId"),
    dueDate: formData.get("dueDate"),
  };

  const validation = validateInput(TaskSchema, rawData);

  if (!validation.success) {
    devLog("createTask:validation_failed", validation.errors);
    return { errors: validation.errors, success: false };
  }

  try {
    const currentCount = await db.task.count({ where: { userId } });

    await db.task.create({
      data: {
        title: validation.data.title,
        description: validation.data.description || null,
        priority: validation.data.priority,
        categoryId: validation.data.categoryId || null,
        dueDate: validation.data.dueDate ? new Date(validation.data.dueDate) : null,
        position: currentCount,
        userId,
      },
    });

    revalidatePath("/");
    revalidatePath("/tasks");
    devLog("createTask:success", { userId });
    return { success: true, errors: null };
  } catch (error) {
    devError("createTask:error", error);
    return {
      success: false,
      errors: { _form: ["Gagal menyimpan task"] },
    };
  }
}

export async function updateTask(
  id: string,
  data: Partial<TaskInput>
) {
  devLog("updateTask:start", { id });

  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return { error: { _form: ["Silakan login dulu"] } };
  }

  const validated = validateInput(UpdateTaskSchema, data);

  if (!validated.success) {
    devLog("updateTask:validation_failed", validated.errors);
    return { error: validated.errors };
  }

  const updated = await db.task.updateMany({
    where: { id, userId },
    data: {
      title: validated.data.title,
      description:
        validated.data.description === undefined
          ? undefined
          : validated.data.description || null,
      priority: validated.data.priority,
      categoryId:
        validated.data.categoryId === undefined
          ? undefined
          : validated.data.categoryId || null,
      dueDate:
        validated.data.dueDate === undefined
          ? undefined
          : validated.data.dueDate
            ? new Date(validated.data.dueDate)
            : null,
    },
  });

  if (updated.count === 0) {
    devLog("updateTask:not_found", { id, userId });
    return { error: { _form: ["Task tidak ditemukan"] } };
  }

  revalidatePath("/");
  revalidatePath("/tasks");
  devLog("updateTask:success", { id, userId });
  return { success: true };
}

export async function toggleTask(id: string) {
  devLog("toggleTask:start", { id });

  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return { error: "Silakan login dulu" };
  }

  const task = await db.task.findFirst({ where: { id, userId } });
  if (!task) return { error: "Task tidak ditemukan" };

  await db.task.updateMany({
    where: { id, userId },
    data: { completed: !task.completed },
  });

  revalidatePath("/");
  revalidatePath("/tasks");
  devLog("toggleTask:success", { id, userId });
  return { success: true };
}

export async function deleteTask(id: string) {
  devLog("deleteTask:start", { id });

  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return { error: "Silakan login dulu" };
  }

  await db.task.deleteMany({ where: { id, userId } });
  revalidatePath("/");
  revalidatePath("/tasks");
  devLog("deleteTask:success", { id, userId });
  return { success: true };
}

export async function reorderTasks(taskIds: string[]) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return { error: "Silakan login dulu" };
  }

  await db.$transaction(
    taskIds.map((taskId, index) =>
      db.task.updateMany({
        where: { id: taskId, userId },
        data: { position: index },
      })
    )
  );

  revalidatePath("/tasks");
  return { success: true };
}

export async function addComment(taskId: string, content: string) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return { error: "Silakan login dulu" };
  }

  const cleaned = content.trim();
  if (!cleaned) {
    return { error: "Komentar tidak boleh kosong" };
  }

  const task = await db.task.findFirst({ where: { id: taskId, userId } });
  if (!task) {
    return { error: "Task tidak ditemukan" };
  }

  await db.taskComment.create({
    data: {
      taskId,
      userId,
      content: cleaned,
    },
  });

  revalidatePath("/tasks");
  return { success: true };
}

export async function deleteComment(commentId: string) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return { error: "Silakan login dulu" };
  }

  await db.taskComment.deleteMany({ where: { id: commentId, userId } });
  revalidatePath("/tasks");
  return { success: true };
}

export async function addAttachment(input: {
  taskId: string;
  url: string;
  path: string;
  name: string;
}) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return { error: "Silakan login dulu" };
  }

  const task = await db.task.findFirst({ where: { id: input.taskId, userId } });
  if (!task) {
    return { error: "Task tidak ditemukan" };
  }

  await db.attachment.create({
    data: {
      taskId: input.taskId,
      userId,
      url: input.url,
      path: input.path,
      name: input.name,
    },
  });

  revalidatePath("/tasks");
  return { success: true };
}

export async function removeAttachment(attachmentId: string) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return { error: "Silakan login dulu" };
  }

  const attachment = await db.attachment.findFirst({
    where: { id: attachmentId, userId },
  });

  if (!attachment) {
    return { error: "Attachment tidak ditemukan" };
  }

  await deleteFile(attachment.path);
  await db.attachment.delete({ where: { id: attachment.id } });

  revalidatePath("/tasks");
  return { success: true };
}

export async function getShareToken() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return { error: "Silakan login dulu" };
  }

  const user = await db.user.findUnique({
    where: { id: userId },
    select: { sharedToken: true },
  });

  if (user?.sharedToken) {
    return { success: true, token: user.sharedToken };
  }

  const token = randomUUID();
  await db.user.update({
    where: { id: userId },
    data: { sharedToken: token },
  });

  return { success: true, token };
}

export async function getReminderTasks() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return [];
  }

  const now = new Date();
  const next24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  return db.task.findMany({
    where: {
      userId,
      completed: false,
      dueDate: {
        lte: next24h,
      },
    },
    select: {
      id: true,
      title: true,
      dueDate: true,
    },
    orderBy: { dueDate: "asc" },
  });
}
