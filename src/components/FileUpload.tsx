"use client";

import Image from "next/image";
import { useState } from "react";
import { Upload, X } from "lucide-react";

type FileUploadProps = {
  onUpload: (payload: { url: string; path: string; name: string }) => void;
};

export function FileUpload({ onUpload }: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    const previewUrl = file.type.startsWith("image/")
      ? URL.createObjectURL(file)
      : null;

    setPreview(previewUrl);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = (await res.json()) as {
        url?: string;
        path?: string;
        error?: string;
      };

      if (!res.ok || !data.url || !data.path) {
        setError(data.error ?? "Upload gagal");
        return;
      }

      onUpload({ url: data.url, path: data.path, name: file.name });
    } catch {
      setError("Upload gagal");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-2">
      <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-gray-700 px-4 py-2 transition-all hover:border-[#E50914]">
        <Upload className="h-4 w-4 text-gray-500" />
        <span className="text-sm text-gray-500">
          {uploading ? "Uploading..." : "Attach file"}
        </span>
        <input
          type="file"
          className="hidden"
          onChange={handleChange}
          accept="image/*,.pdf"
          disabled={uploading}
        />
      </label>

      {preview ? (
        <div className="relative inline-flex">
          <Image
            src={preview}
            alt="Preview"
            width={256}
            height={128}
            unoptimized
            className="max-h-32 w-auto rounded-lg border border-[#222]"
          />
          <button
            type="button"
            onClick={() => setPreview(null)}
            className="absolute -right-2 -top-2 rounded-full bg-black/70 p-1 text-white"
            aria-label="Remove preview"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : null}

      {error ? <p className="text-sm text-red-400">{error}</p> : null}
    </div>
  );
}
