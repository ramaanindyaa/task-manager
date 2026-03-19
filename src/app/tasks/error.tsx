"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-md px-6 py-24 text-center">
      <div className="mb-4 text-4xl">😵</div>
      <h2 className="mb-2 text-xl font-bold text-white">Oops! Ada yang salah</h2>
      <p className="mb-6 text-gray-500">{error.message}</p>
      <button
        onClick={reset}
        className="rounded-xl bg-[#E50914] px-6 py-3 font-bold text-black"
      >
        Coba Lagi
      </button>
    </div>
  );
}
