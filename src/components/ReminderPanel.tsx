"use client";

import { Bell } from "lucide-react";
import { useEffect } from "react";

type ReminderItem = {
  id: string;
  title: string;
  dueDate: Date | null;
};

export function ReminderPanel({ reminders }: { reminders: ReminderItem[] }) {
  useEffect(() => {
    if (!("Notification" in window)) return;
    if (Notification.permission === "default") {
      Notification.requestPermission().catch(() => undefined);
    }

    if (Notification.permission === "granted") {
      reminders.forEach((item) => {
        if (!item.dueDate) return;
        const due = new Date(item.dueDate).getTime();
        if (due <= Date.now()) {
          new Notification("Task Reminder", {
            body: `${item.title} sudah melewati due date`,
          });
        }
      });
    }
  }, [reminders]);

  if (reminders.length === 0) {
    return null;
  }

  return (
    <div className="mb-6 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
      <div className="mb-2 inline-flex items-center gap-2 text-amber-300">
        <Bell className="h-4 w-4" />
        <span className="text-sm font-medium">Reminders</span>
      </div>
      <ul className="space-y-1 text-sm text-amber-200">
        {reminders.map((item) => (
          <li key={item.id}>
            {item.title} - {item.dueDate ? new Date(item.dueDate).toLocaleString("id-ID") : "No due date"}
          </li>
        ))}
      </ul>
    </div>
  );
}
