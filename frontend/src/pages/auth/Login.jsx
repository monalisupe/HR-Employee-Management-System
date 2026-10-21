

import { useState } from "react";

function BriefcaseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6">
      <rect x="3" y="7" width="18" height="14" rx="2" />
      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M12 7v14M3 12h18" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
      <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" />
    </svg>
  );
}

function UserIcon({ group = false }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
      <circle cx="10" cy="7" r="4" />
      <path d="M3 21v-2a7 7 0 0 1 14 0v2" />
      {group && <path d="M16 3.5a4 4 0 0 1 0 7.5M19 14a6 6 0 0 1 2 4v3" />}
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
      <rect x="4" y="10" width="16" height="11" rx="2" />
      <path d="M8 10V7a4 4 0 1 1 8 0v3" />
    </svg>
  );
}

function EyeIcon({ visible }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
      {visible && <path d="M4 4 20 20" />}
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12 3 3 5-6" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
      <path d="M5 12h14m-7-7 7 7-7 7" />
    </svg>
  );
}

function RoleButton({ role, selected, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`flex min-w-0 flex-1 flex-col items-center justify-center gap-2 rounded-2xl border-2 px-2 py-3 transition duration-200 ${
        selected
          ? "border-violet-500 bg-violet-50 text-violet-700 shadow-sm"
          : "border-slate-200 bg-white text-slate-600 hover:border-violet-300 hover:bg-violet-50/50"
      }`}
    >
      {children}
      <span className="text-sm font-medium">{role}</span>
    </button>
  );
}

function Login() {
  const [role, setRole] = useState("hr");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  function handleRoleChange(nextRole) {
    setRole(nextRole);
    setError("");
    setMessage("");
  }

  function handleLogin(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!email.trim() || !password) {
      setError("Please enter your email address and password.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    setLoading(true);

    // Frontend demo only; backend authentication comes later.
    window.setTimeout(() => {
      setLoading(false);

      const roleName =
        role === "hr"
          ? "HR / Admin"
          : role === "candidate"
          ? "Candidate"
          : "Employee";

      setMessage(`Demo login successful! Selected role: ${roleName}.`);

      console.log("Demo login:", {
        email: email.trim(),
        role,
        rememberMe,
      });
    }, 700);
  }

  function handleForgotPassword(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resetEmail.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    setShowForgotPassword(false);
    setMessage("Demo only: password reset will be connected later.");
    setResetEmail("");
  }

  function handleCreateAccount() {
    setMessage("Connect this button to your Register page through App.jsx.");
  }

  return (
    <div className="min-h-screen w-full bg-white p-0 font-sans text-slate-800">
      <div className="mx-auto grid min-h-screen w-full grid-cols-1 overflow-hidden rounded-2xl bg-white shadow-xl lg:grid-cols-2">

        {/* LEFT: Branding panel */}
        <section className="relative flex min-h-[400px] flex-col overflow-hidden rounded-l-2xl bg-gradient-to-br from-violet-600 via-purple-500 to-purple-600 px-8 py-10 text-white sm:px-12 lg:min-h-screen lg:px-16 lg:py-16">
          <div className="pointer-events-none absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:22px_22px]" />
          </div>

          <div className="relative flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 ring-1 ring-white/20">
              <BriefcaseIcon />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">HireFlow</h1>
          </div>

          <div className="relative mx-auto my-12 flex w-full max-w-lg flex-1 flex-col justify-center lg:my-0">
            <h2 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
              Manage your
              <br />
              workforce,
              <br />
              effortlessly.
            </h2>

            <p className="mt-8 max-w-md text-base leading-7 text-white/90 sm:text-lg">
              HireFlow is your all-in-one HR &amp; employee lifecycle platform —
              from recruitment and onboarding to performance and offboarding.
            </p>

            <div className="mt-9 space-y-4">
              {[
                "Streamlined hiring pipeline",
                "Centralised employee records",
                "Automated onboarding workflows",
              ].map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full border border-white/50 bg-white/10">
                    <CheckIcon />
                  </span>
                  <span className="text-sm text-white/95 sm:text-base">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <footer className="relative pt-5 text-center text-sm text-white/70 lg:text-left">
            © {new Date().getFullYear()} HireFlow. All rights reserved.
          </footer>
        </section>

        {/* RIGHT: Login form */}
        <section className="flex items-center justify-center rounded-r-2xl bg-white px-5 py-10 sm:px-10 lg:px-12">
          <div className="w-full max-w-md">
            {!showForgotPassword ? (
              <>
                <div className="mb-8 text-center">
                  <h2 className="text-3xl font-bold tracking-tight text-black">
                    Welcome back
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-base">
                    Sign in to your HireFlow account to continue.
                  </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                  <div>
                    <p className="mb-2 text-center text-sm font-medium uppercase tracking-wide text-slate-400">
                      I am signing in as
                    </p>

                    <div className="flex gap-3">
                      <RoleButton
                        role="HR / Admin"
                        selected={role === "hr"}
                        onClick={() => handleRoleChange("hr")}
                      >
                        <ShieldIcon />
                      </RoleButton>

                      <RoleButton
                        role="Candidate"
                        selected={role === "candidate"}
                        onClick={() => handleRoleChange("candidate")}
                      >
                        <UserIcon />
                      </RoleButton>

                      <RoleButton
                        role="Employee"
                        selected={role === "employee"}
                        onClick={() => handleRoleChange("employee")}
                      >
                        <UserIcon group />
                      </RoleButton>
                    </div>

                    <p className="mt-2 text-center text-[11px] leading-4 text-slate-400">
                      Role selection is for demo navigation only. Actual
                      permissions will be verified by the backend.
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="login-email"
                      className="mb-2 block text-center text-sm font-semibold text-slate-700"
                    >
                      Email address
                    </label>

                    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 transition focus-within:border-violet-500 focus-within:ring-4 focus-within:ring-violet-100">
                      <span className="text-slate-400">
                        <MailIcon />
                      </span>
                      <input
                        id="login-email"
                        type="email"
                        autoComplete="email"
                        value={email}
                        onChange={(event) => {
                          setEmail(event.target.value);
                          setError("");
                          setMessage("");
                        }}
                        placeholder="you@company.com"
                        className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="login-password"
                      className="mb-2 block text-center text-sm font-semibold text-slate-700"
                    >
                      Password
                    </label>

                    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 transition focus-within:border-violet-500 focus-within:ring-4 focus-within:ring-violet-100">
                      <span className="text-slate-400">
                        <LockIcon />
                      </span>
                      <input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        value={password}
                        onChange={(event) => {
                          setPassword(event.target.value);
                          setError("");
                          setMessage("");
                        }}
                        placeholder="Enter your password"
                        className="h-12 w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-slate-400"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((current) => !current)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        className="shrink-0 text-slate-400 transition hover:text-violet-600"
                      >
                        <EyeIcon visible={showPassword} />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(event) => setRememberMe(event.target.checked)}
                        className="h-4 w-4 accent-violet-600"
                      />
                      Remember me
                    </label>

                    <button
                      type="button"
                      onClick={() => {
                        setError("");
                        setMessage("");
                        setShowForgotPassword(true);
                      }}
                      className="text-sm font-semibold text-violet-600 hover:text-violet-800"
                    >
                      Forgot password?
                    </button>
                  </div>

                  {error && (
                    <p
                      role="alert"
                      className="rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
                    >
                      {error}
                    </p>
                  )}

                  {message && (
                    <p
                      role="status"
                      className="rounded-2xl border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700"
                    >
                      {message}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex h-12 w-full items-center justify-center gap-3 rounded-2xl bg-violet-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700 focus:outline-none focus:ring-4 focus:ring-violet-200 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {loading ? "Signing in..." : "Sign In"}
                    {!loading && <ArrowIcon />}
                  </button>
                </form>

                <div className="my-7 flex items-center gap-3">
                  <div className="h-px flex-1 bg-slate-200" />
                  <span className="text-sm text-slate-400">OR</span>
                  <div className="h-px flex-1 bg-slate-200" />
                </div>

                <p className="text-center text-sm text-slate-500">
                  Don&apos;t have an account?{" "}
                  <button
                    type="button"
                    onClick={handleCreateAccount}
                    className="font-semibold text-violet-600 hover:text-violet-800"
                  >
                    Create Account
                  </button>
                </p>

                {/* White demo credentials box */}
                <div className="mt-7 rounded-2xl border border-violet-100 bg-white px-4 py-4 text-center text-xs leading-5 text-violet-700 shadow-sm">
                  Demo credentials: use any valid email and a password with at
                  least 8 characters.
                  <br />
                  Example password:{" "}
                  <code className="rounded-2xl border border-violet-200 bg-white px-3 py-1 font-semibold text-violet-700">
                    password123
                  </code>
                </div>
              </>
            ) : (
              <div>
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(false);
                    setError("");
                    setMessage("");
                  }}
                  className="mb-8 text-sm font-semibold text-violet-600 hover:text-violet-800"
                >
                  ← Back to login
                </button>

                <h2 className="text-3xl font-bold text-slate-900">
                  Forgot password?
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Enter your email address to continue with the demo
                  password-reset flow.
                </p>

                <form onSubmit={handleForgotPassword} className="mt-8 space-y-5">
                  <div>
                    <label
                      htmlFor="reset-email"
                      className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      Email address
                    </label>
                    <input
                      id="reset-email"
                      type="email"
                      value={resetEmail}
                      onChange={(event) => {
                        setResetEmail(event.target.value);
                        setError("");
                      }}
                      placeholder="you@company.com"
                      className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                    />
                  </div>

                  {error && (
                    <p role="alert" className="text-sm text-red-600">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    className="h-12 w-full rounded-2xl bg-violet-600 font-semibold text-white transition hover:bg-violet-700 focus:outline-none focus:ring-4 focus:ring-violet-200"
                  >
                    Continue
                  </button>
                </form>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Login;
