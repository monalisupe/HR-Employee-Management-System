
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BriefcaseBusiness,
  UserRound,
  Mail,
  LockKeyhole,
  Phone,
  Eye,
  EyeOff,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  function handleRegister(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!name.trim()) {
      setError("Please enter your full name.");
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

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!acceptedTerms) {
      setError("Please accept the Terms of Service.");
      return;
    }

    setLoading(true);

    // Frontend demo only — no account is saved yet.
    window.setTimeout(() => {
      setLoading(false);
      setMessage("Demo registration successful! Redirecting to login...");

      window.setTimeout(() => {
        navigate("/login");
      }, 1500);
    }, 800);
  }

  const inputClass =
    "h-12 w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400";

  const wrapperClass =
    "flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 transition focus-within:border-violet-500 focus-within:ring-4 focus-within:ring-violet-100";

  return (
    <main className="min-h-screen w-full bg-white p-3 font-sans text-slate-800 sm:p-5">
      <div className="mx-auto grid min-h-[calc(100vh-24px)] w-full max-w-7xl grid-cols-1 overflow-hidden rounded-2xl bg-white shadow-xl sm:min-h-[calc(100vh-40px)] lg:grid-cols-2">

        {/* LEFT: Branding panel */}
        <section className="relative flex flex-col overflow-hidden rounded-2xl bg-linear-to-br from-violet-600 via-purple-600 to-violet-800 px-7 py-8 text-white sm:px-12 sm:py-12 lg:rounded-r-none lg:px-14 lg:py-14">
          <div className="pointer-events-none absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] bg-size-[22px_22px]" />
          </div>

          <div className="relative flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 ring-1 ring-white/20">
              <BriefcaseBusiness className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">
              HireFlow
            </h1>
          </div>

          <div className="relative mx-auto my-10 flex w-full max-w-lg flex-1 flex-col justify-center lg:my-0">
            <span className="mb-5 flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm">
              <ShieldCheck className="h-4 w-4" />
              Your career starts here
            </span>

            <h2 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
              Start your journey
              <br />
              with HireFlow
              <br />
              today.
            </h2>

            <p className="mt-6 max-w-md text-base leading-7 text-white/85">
              Create your candidate account to follow your applications,
              stay informed about interviews, and access documents shared
              with you.
            </p>

            <div className="mt-8 space-y-4">
              {[
                "Track your job applications",
                "Stay updated on interviews",
                "Access shared recruitment documents",
              ].map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full border border-white/40 bg-white/10">
                    <CheckCircle2 className="h-4 w-4" />
                  </span>
                  <span className="text-sm text-white/95 sm:text-base">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <footer className="relative pt-5 text-sm text-white/70">
            © {new Date().getFullYear()} HireFlow. All rights reserved.
          </footer>
        </section>

        {/* RIGHT: Registration form */}
        <section className="flex items-center justify-center bg-white px-5 py-10 sm:px-10 lg:px-14">
          <div className="w-full max-w-md">
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
                <UserRound className="h-7 w-7" />
              </div>

              <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                Create an account
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Enter your details to get started with HireFlow.
              </p>

              <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-700">
                <UserRound className="h-4 w-4" />
                Candidate Registration
              </span>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
              {/* Full name */}
              <div>
                <label
                  htmlFor="register-name"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Full Name
                </label>

                <div className={wrapperClass}>
                  <UserRound className="h-5 w-5 shrink-0 text-slate-400" />
                  <input
                    id="register-name"
                    type="text"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className={inputClass}
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="register-email"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Email Address
                </label>

                <div className={wrapperClass}>
                  <Mail className="h-5 w-5 shrink-0 text-slate-400" />
                  <input
                    id="register-email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className={inputClass}
                    required
                  />
                </div>
              </div>

              {/* Optional phone */}
              <div>
                <label
                  htmlFor="register-phone"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Phone Number <span className="font-normal text-slate-400">(Optional)</span>
                </label>

                <div className={wrapperClass}>
                  <Phone className="h-5 w-5 shrink-0 text-slate-400" />
                  <input
                    id="register-phone"
                    type="tel"
                    autoComplete="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter your phone number"
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="register-password"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Password
                </label>

                <div className={wrapperClass}>
                  <LockKeyhole className="h-5 w-5 shrink-0 text-slate-400" />

                  <input
                    id="register-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 8 characters"
                    className={inputClass}
                    required
                    minLength={8}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="shrink-0 text-slate-400 hover:text-violet-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm password */}
              <div>
                <label
                  htmlFor="register-confirm-password"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Confirm Password
                </label>

                <div className={wrapperClass}>
                  <LockKeyhole className="h-5 w-5 shrink-0 text-slate-400" />

                  <input
                    id="register-confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter your password"
                    className={inputClass}
                    required
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword((value) => !value)
                    }
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                    className="shrink-0 text-slate-400 hover:text-violet-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Terms */}
              <label className="flex cursor-pointer items-start gap-3 pt-1 text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="mt-1 h-4 w-4 accent-violet-600"
                />
                <span>
                  I agree to the{" "}
                  <a
                    href="/terms"
                    onClick={(e) => e.preventDefault()}
                    className="font-semibold text-violet-600 hover:text-violet-800"
                  >
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a
                    href="/privacy"
                    onClick={(e) => e.preventDefault()}
                    className="font-semibold text-violet-600 hover:text-violet-800"
                  >
                    Privacy Policy
                  </a>
                  .
                </span>
              </label>

              {/* Error */}
              {error && (
                <p
                  role="alert"
                  className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                  {error}
                </p>
              )}

              {/* Success */}
              {message && (
                <p
                  role="status"
                  className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
                >
                  {message}
                </p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="flex h-12 w-full items-center justify-center gap-3 rounded-2xl bg-violet-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700 focus:outline-none focus:ring-4 focus:ring-violet-200 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Creating account..." : "Create Account"}
                {!loading && <ArrowRight className="h-5 w-5" />}
              </button>
            </form>

            {/* Login navigation */}
            <p className="mt-7 text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-violet-600 hover:text-violet-800"
              >
                Sign in
              </Link>
            </p>

            <p className="mt-5 text-center text-xs leading-5 text-slate-400">
              Your account will be connected to secure account services
              when the backend is implemented.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
