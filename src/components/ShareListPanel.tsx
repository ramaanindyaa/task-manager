"use client";

import { useState } from "react";
import { Copy, Share2 } from "lucide-react";

import { getShareToken } from "@/actions/task-actions";
import { showToast } from "@/components/ToastContainer";

export function ShareListPanel({ initialToken }: { initialToken: string | null }) {
  const [token, setToken] = useState(initialToken);
  const [loading, setLoading] = useState(false);

  const origin = typeof window === "undefined" ? "" : window.location.origin;

  const url = token && origin ? `${origin}/shared/${token}` : null;

  async function generate() {
    setLoading(true);
    const result = await getShareToken();
    if (result.success) {
      setToken(result.token);
      showToast("Share link siap dipakai", "success");
    } else if (result.error) {
      showToast(result.error, "error");
    }
    setLoading(false);
  }

  async function copy() {
    if (!url) return;
    await navigator.clipboard.writeText(url);
    showToast("Link berhasil disalin", "success");
  }

  return (
    <div className="mb-6 rounded-xl border border-[#222] bg-[#111] p-4">
      <div className="mb-3 text-sm text-gray-300">Share task list</div>
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={generate}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg border border-[#333] px-3 py-2 text-sm text-white"
        >
          <Share2 className="h-4 w-4" />
          {loading ? "Generating..." : token ? "Regenerate Link" : "Generate Link"}
        </button>
        {url ? (
          <button
            onClick={copy}
            className="inline-flex items-center gap-2 rounded-lg border border-[#333] px-3 py-2 text-sm text-white"
          >
            <Copy className="h-4 w-4" />
            Copy Link
          </button>
        ) : null}
      </div>
      {url ? <p className="mt-2 break-all text-xs text-gray-500">{url}</p> : null}
    </div>
  );
}
