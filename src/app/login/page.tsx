import type { Metadata } from "next";
import { Chrome, Github } from "lucide-react";
import Link from "next/link";

import { AuthEmailForm } from "@/components/auth/AuthEmailForm";
import { AuthHeroPanel } from "@/components/auth/AuthHeroPanel";

export const metadata: Metadata = {
  title: "Login",
  description:
    "Sign in to Task Manager with Google or GitHub, or use email, password, and magic link options.",
};

export default function LoginPage() {
  const hasGoogleProvider = Boolean(
    process.env.GOOGLE_ID && process.env.GOOGLE_SECRET
  );
  const hasGithubProvider = Boolean(
    process.env.GITHUB_ID && process.env.GITHUB_SECRET
  );
  const googleSignInHref = "/api/auth/signin?provider=google&callbackUrl=%2Ftasks";
  const githubSignInHref = "/api/auth/signin?provider=github&callbackUrl=%2Ftasks";

  return (
    <main className="relative min-h-screen overflow-hidden bg-ocean-deep text-ocean-foam">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_10%_10%,rgba(45,212,191,0.12),transparent_45%),radial-gradient(circle_at_90%_20%,rgba(59,130,246,0.16),transparent_40%),radial-gradient(circle_at_30%_90%,rgba(14,165,233,0.12),transparent_42%)]" />
      <div className="ocean-grid absolute inset-0 -z-10 opacity-40" />

      <section className="ocean-shell py-6 sm:py-10">
        <div className="grid min-h-[calc(100vh-3rem)] items-stretch gap-6 lg:grid-cols-2 lg:gap-8">
          <AuthHeroPanel />

          <div className="ocean-card ocean-glass flex flex-col justify-center px-5 py-7 sm:px-8 sm:py-9">
            <div className="mx-auto w-full max-w-md space-y-6">
              <div className="space-y-2 text-left">
                <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">Welcome Back</p>
                <h1 className="text-3xl font-semibold text-white sm:text-4xl">Authenticate In Seconds</h1>
                <p className="text-sm leading-7 text-slate-200/85">
                  Choose OAuth for the fastest path, or continue with email and password.
                </p>
              </div>

              <div className="space-y-3">
                {hasGoogleProvider ? (
                  <Link
                    href={googleSignInHref}
                    className="ocean-cta-primary inline-flex w-full items-center justify-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition hover:-translate-y-0.5 hover:brightness-110"
                  >
                    <Chrome className="size-4" />
                    <span>Continue with Google</span>
                  </Link>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="inline-flex w-full cursor-not-allowed items-center justify-center gap-3 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold text-slate-300/75"
                  >
                    <Chrome className="size-4" />
                    <span>Google login not configured</span>
                  </button>
                )}

                {hasGithubProvider ? (
                  <Link
                    href={githubSignInHref}
                    className="ocean-cta-secondary inline-flex w-full items-center justify-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition hover:-translate-y-0.5 hover:bg-white/20"
                  >
                    <Github className="size-4" />
                    <span>Continue with GitHub</span>
                  </Link>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="inline-flex w-full cursor-not-allowed items-center justify-center gap-3 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold text-slate-300/75"
                  >
                    <Github className="size-4" />
                    <span>GitHub login not configured</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-300">
                <span className="h-px flex-1 bg-white/20" />
                <span>or continue with email</span>
                <span className="h-px flex-1 bg-white/20" />
              </div>

              <AuthEmailForm />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
