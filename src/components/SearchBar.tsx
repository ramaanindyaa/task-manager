"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";

export function SearchBar({ defaultValue }: { defaultValue?: string }) {
  const [query, setQuery] = useState(defaultValue || "");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const timer = setTimeout(() => {
      const currentSearch = searchParams.get("search") || "";
      if (currentSearch === query) return;

      const params = new URLSearchParams(searchParams);
      if (query) {
        params.set("search", query);
      } else {
        params.delete("search");
      }
      params.delete("page");
      const queryString = params.toString();
      router.push(queryString ? `/tasks?${queryString}` : "/tasks");
    }, 300);

    return () => clearTimeout(timer);
  }, [query, router, searchParams]);

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-600" />
      <input
        id="task-search-input"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Cari task..."
        className="w-full rounded-xl border border-[#222] bg-[#111] py-3 pl-10 pr-4 text-white"
      />
    </div>
  );
}
