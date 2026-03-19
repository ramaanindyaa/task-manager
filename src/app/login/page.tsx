import { Github } from "lucide-react";

import { signIn } from "@/auth";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-sm rounded-2xl border border-[#1a1a1a] bg-[#111] p-8">
        <h1 className="mb-6 text-center text-2xl font-bold text-white">
          Login ke Task Manager
        </h1>

        <form
          action={async () => {
            "use server";
            await signIn("github", { redirectTo: "/tasks" });
          }}
        >
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-black hover:bg-gray-100"
          >
            <Github className="h-5 w-5" />
            Login dengan GitHub
          </button>
        </form>
      </div>
    </div>
  );
}
