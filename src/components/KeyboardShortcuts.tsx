"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function KeyboardShortcuts() {
  const router = useRouter();

  useEffect(() => {
    let gPressed = false;

    function handler(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const isTyping =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.getAttribute("contenteditable") === "true";

      if (event.key.toLowerCase() === "g") {
        gPressed = true;
        setTimeout(() => {
          gPressed = false;
        }, 600);
        return;
      }

      if (gPressed && event.key.toLowerCase() === "d") {
        router.push("/dashboard");
        gPressed = false;
        return;
      }

      if (isTyping) return;

      if (event.key === "/") {
        event.preventDefault();
        document.getElementById("task-search-input")?.focus();
      }

      if (event.key.toLowerCase() === "n") {
        event.preventDefault();
        document.getElementById("new-task-title")?.focus();
      }
    }

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [router]);

  return null;
}
