export default function Loading() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <div className="mb-4 h-8 w-48 animate-pulse rounded-lg bg-[#1a1a1a]" />
      <div className="mb-8 h-4 w-32 animate-pulse rounded bg-[#1a1a1a]" />

      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="mb-2 rounded-xl border border-[#1a1a1a] bg-[#111] p-4"
        >
          <div className="flex items-center gap-3">
            <div className="h-6 w-6 animate-pulse rounded-full bg-[#1a1a1a]" />
            <div className="flex-1">
              <div className="h-4 w-3/4 animate-pulse rounded bg-[#1a1a1a]" />
              <div className="mt-2 h-3 w-1/2 animate-pulse rounded bg-[#1a1a1a]" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
