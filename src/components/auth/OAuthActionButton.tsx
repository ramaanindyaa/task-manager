"use client";

import type { ReactNode } from "react";
import { useFormStatus } from "react-dom";

interface OAuthActionButtonProps {
  label: string;
  pendingLabel: string;
  icon: ReactNode;
  className?: string;
}

export function OAuthActionButton({
  label,
  pendingLabel,
  icon,
  className,
}: OAuthActionButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={`inline-flex w-full items-center justify-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-70 ${className ?? ""}`}
      aria-live="polite"
    >
      {pending ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
      ) : (
        icon
      )}
      <span>{pending ? pendingLabel : label}</span>
    </button>
  );
}
