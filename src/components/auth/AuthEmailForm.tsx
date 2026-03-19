"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle2, Eye, EyeOff, Mail } from "lucide-react";
import { useMemo, useState } from "react";

type FormMode = "login" | "signup";
type AuthMethod = "password" | "magic-link";

interface PasswordChecks {
  minLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
}

interface FormState {
  fullName: string;
  email: string;
  password: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getPasswordChecks(password: string): PasswordChecks {
  return {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecial: /[^A-Za-z0-9]/.test(password),
  };
}

export function AuthEmailForm() {
  const [formMode, setFormMode] = useState<FormMode>("login");
  const [authMethod, setAuthMethod] = useState<AuthMethod>("password");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [formState, setFormState] = useState<FormState>({
    fullName: "",
    email: "",
    password: "",
  });

  const emailValid = useMemo(() => EMAIL_REGEX.test(formState.email), [formState.email]);
  const passwordChecks = useMemo(() => getPasswordChecks(formState.password), [formState.password]);
  const passwordStrong = useMemo(
    () => Object.values(passwordChecks).every(Boolean),
    [passwordChecks]
  );

  const emailFeedbackVisible = formState.email.length > 0 || submitted;
  const passwordFeedbackVisible =
    authMethod === "password" && (formState.password.length > 0 || submitted);

  const canSubmitPassword =
    emailValid &&
    passwordStrong &&
    (formMode === "login" || formState.fullName.trim().length >= 2);
  const canSubmitMagicLink = emailValid;

  const submitLabel =
    authMethod === "magic-link"
      ? "Send Magic Link"
      : formMode === "signup"
        ? "Create Account"
        : "Sign In";

  const handleInputChange = (field: keyof FormState, value: string) => {
    setStatusMessage(null);
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    setStatusMessage(null);

    const canSubmit = authMethod === "magic-link" ? canSubmitMagicLink : canSubmitPassword;
    if (!canSubmit) {
      return;
    }

    setIsSubmitting(true);

    await new Promise((resolve) => {
      window.setTimeout(resolve, 900);
    });

    if (authMethod === "magic-link") {
      setStatusMessage("Magic link sent. Check your inbox to continue.");
    } else if (formMode === "signup") {
      setStatusMessage("Your account request looks great. Complete OAuth to continue.");
    } else {
      setStatusMessage("Credentials are validated. Continue with an OAuth provider above.");
    }

    setIsSubmitting(false);
  };

  return (
    <div className="space-y-5">
      <div className="flex rounded-xl border border-white/20 bg-white/5 p-1">
        <button
          type="button"
          onClick={() => {
            setFormMode("login");
            setStatusMessage(null);
          }}
          className={`w-1/2 rounded-lg px-3 py-2 text-sm font-medium transition ${
            formMode === "login"
              ? "bg-white/20 text-white"
              : "text-slate-300 hover:text-white"
          }`}
        >
          Login
        </button>
        <button
          type="button"
          onClick={() => {
            setFormMode("signup");
            setStatusMessage(null);
          }}
          className={`w-1/2 rounded-lg px-3 py-2 text-sm font-medium transition ${
            formMode === "signup"
              ? "bg-white/20 text-white"
              : "text-slate-300 hover:text-white"
          }`}
        >
          Signup
        </button>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        {formMode === "signup" && authMethod === "password" ? (
          <div className="relative">
            <input
              id="fullName"
              value={formState.fullName}
              onChange={(event) => handleInputChange("fullName", event.target.value)}
              placeholder=" "
              className="peer w-full rounded-xl border border-white/20 bg-slate-950/60 px-4 pb-2 pt-5 text-sm text-white outline-none transition focus:border-cyan-300"
            />
            <label
              htmlFor="fullName"
              className="pointer-events-none absolute left-4 top-2.5 text-xs text-slate-300 transition peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-2.5 peer-focus:text-xs peer-focus:text-cyan-200"
            >
              Full name
            </label>
          </div>
        ) : null}

        <div className="relative">
          <input
            id="email"
            type="email"
            value={formState.email}
            onChange={(event) => handleInputChange("email", event.target.value)}
            placeholder=" "
            className="peer w-full rounded-xl border border-white/20 bg-slate-950/60 px-4 pb-2 pt-5 text-sm text-white outline-none transition focus:border-cyan-300"
            aria-invalid={emailFeedbackVisible ? !emailValid : false}
          />
          <label
            htmlFor="email"
            className="pointer-events-none absolute left-4 top-2.5 text-xs text-slate-300 transition peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-2.5 peer-focus:text-xs peer-focus:text-cyan-200"
          >
            Work email
          </label>
        </div>

        <AnimatePresence>
          {emailFeedbackVisible ? (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className={`flex items-center gap-2 text-xs ${
                emailValid ? "text-emerald-300" : "text-rose-300"
              }`}
            >
              {emailValid ? <CheckCircle2 className="size-3.5" /> : <AlertCircle className="size-3.5" />}
              {emailValid ? "Email format looks good." : "Please enter a valid email address."}
            </motion.p>
          ) : null}
        </AnimatePresence>

        {authMethod === "password" ? (
          <>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formState.password}
                onChange={(event) => handleInputChange("password", event.target.value)}
                placeholder=" "
                className="peer w-full rounded-xl border border-white/20 bg-slate-950/60 px-4 pb-2 pt-5 text-sm text-white outline-none transition focus:border-cyan-300"
                aria-invalid={passwordFeedbackVisible ? !passwordStrong : false}
              />
              <label
                htmlFor="password"
                className="pointer-events-none absolute left-4 top-2.5 text-xs text-slate-300 transition peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-2.5 peer-focus:text-xs peer-focus:text-cyan-200"
              >
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-300 transition hover:text-white"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>

            <AnimatePresence>
              {passwordFeedbackVisible ? (
                <motion.ul
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="grid gap-1 text-xs"
                >
                  {[
                    { ok: passwordChecks.minLength, text: "At least 8 characters" },
                    { ok: passwordChecks.hasUppercase, text: "One uppercase letter" },
                    { ok: passwordChecks.hasLowercase, text: "One lowercase letter" },
                    { ok: passwordChecks.hasNumber, text: "One number" },
                    { ok: passwordChecks.hasSpecial, text: "One special character" },
                  ].map((item) => (
                    <li key={item.text} className={`flex items-center gap-2 ${item.ok ? "text-emerald-300" : "text-rose-300"}`}>
                      {item.ok ? <CheckCircle2 className="size-3.5" /> : <AlertCircle className="size-3.5" />}
                      <span>{item.text}</span>
                    </li>
                  ))}
                </motion.ul>
              ) : null}
            </AnimatePresence>
          </>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="ocean-cta-primary inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition hover:-translate-y-0.5 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-75"
        >
          {isSubmitting ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-r-transparent" />
              <span>Processing...</span>
            </>
          ) : (
            submitLabel
          )}
        </button>
      </form>

      <div className="flex items-center justify-between gap-3 text-xs text-slate-300">
        <button
          type="button"
          onClick={() => {
            setAuthMethod((prev) => (prev === "password" ? "magic-link" : "password"));
            setStatusMessage(null);
          }}
          className="inline-flex items-center gap-1 text-cyan-200 transition hover:text-cyan-100"
        >
          <Mail className="size-3.5" />
          {authMethod === "password"
            ? "Send me a Magic Link instead"
            : "Use password instead"}
        </button>
        <p>{authMethod === "magic-link" ? "No password needed" : "Secure & encrypted"}</p>
      </div>

      <AnimatePresence>
        {statusMessage ? (
          <motion.p
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="rounded-lg border border-emerald-300/40 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-200"
          >
            {statusMessage}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
