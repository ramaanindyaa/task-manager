"use client";

import { useEffect, useState } from "react";
import { CheckCircle, X, XCircle } from "lucide-react";

type ToastType = "success" | "error";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastEventDetail {
  id: string;
  message: string;
  type: ToastType;
}

export function showToast(message: string, type: ToastType) {
  if (typeof window === "undefined") return;

  const event = new CustomEvent<ToastEventDetail>("toast", {
    detail: {
      id: crypto.randomUUID(),
      message,
      type,
    },
  });

  window.dispatchEvent(event);
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    function handler(event: Event) {
      const customEvent = event as CustomEvent<ToastEventDetail>;
      const toast = customEvent.detail;

      setToasts((prev) => [...prev, toast]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((item) => item.id !== toast.id));
      }, 3000);
    }

    window.addEventListener("toast", handler as EventListener);
    return () => {
      window.removeEventListener("toast", handler as EventListener);
    };
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="animate-slide-up flex items-center gap-2 rounded-xl border border-[#222] bg-[#111] px-4 py-3 text-sm shadow-lg"
        >
          {toast.type === "success" ? (
            <CheckCircle className="h-4 w-4 text-green-400" />
          ) : (
            <XCircle className="h-4 w-4 text-red-400" />
          )}
          <span className="text-white">{toast.message}</span>
          <button
            onClick={() =>
              setToasts((prev) => prev.filter((item) => item.id !== toast.id))
            }
            className="ml-1 text-gray-500 hover:text-white"
            aria-label="Close toast"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
