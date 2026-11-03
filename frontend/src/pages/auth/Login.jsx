import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Eye,
  EyeOff,
  Users,
  Briefcase,
  UserCheck,
  Shield,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import HireFlowLogo from '../../components/common/HireFlowLogo';
import GoogleIcon from '../../components/common/GoogleIcon';
import TeamCollaborationIllustration from '../../components/illustrations/TeamCollaborationIllustration';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, showToast, organization } = useApp();

  const [email, setEmail] = useState('admin@securetenant.io');
  const [password, setPassword] = useState('SecureTenant2026!');
  const [selectedRole, setSelectedRole] = useState('hr');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Carousel feature slides matching the user's design
  const slides = [
    {
      title: 'Smarter HR Starts Here',
      description:
        'Monitor employee performance, manage HR processes, and keep teams aligned with a centralized HR dashboard.',
      badge: '✨ Support Teams with Better HR Insights ✨',
    },
    {
      title: 'Accelerated Talent Pipeline',
      description:
        'Source candidates, organize multi-stage interviews, and automate compliant job offer rollouts seamlessly.',
      badge: '🚀 Streamline Recruitment & Onboarding 🚀',
    },
    {
      title: 'Enterprise Tenant Security',
      description:
        'Multi-tenant data isolation, verified role access permissions, and 256-bit TLS encrypted audit tracking.',
      badge: '🔒 Bank-Grade Multi-Tenant Protection 🔒',
    },
  ];

  // Auto advance slides every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const demoAccounts = [
    {
      role: 'hr',
      label: 'HR Admin',
      email: 'admin@securetenant.io',
      name: 'Sarah Jenkins',
      icon: Users,
    },
    {
      role: 'candidate',
      label: 'Candidate',
      email: 'alex.rivera@example.com',
      name: 'Alex Rivera',
      icon: Briefcase,
    },
    {
      role: 'employee',
      label: 'Employee',
      email: 'jordan.hayes@securetenant.io',
      name: 'Jordan Hayes',
      icon: UserCheck,
    },
  ];

  const handleSelectDemo = (demo) => {
    setSelectedRole(demo.role);
    setEmail(demo.email);
    setPassword('SecureTenant2026!');
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setIsLoading(true);

    try {
      const res = await login({
        email,
        password,
        role: selectedRole,
        rememberMe,
      });

      if (res && res.success) {
        const redirectPath = location.state?.from?.pathname;
        const targetDashboard =
          selectedRole === 'candidate'
            ? '/candidate/dashboard'
            : selectedRole === 'employee'
              ? '/employee/dashboard'
              : '/hr/dashboard';

        const finalPath =
          redirectPath && redirectPath.startsWith(`/${selectedRole}`)
            ? redirectPath
            : targetDashboard;

        navigate(finalPath, { replace: true });
      }
    } catch (err) {
      showToast('Authentication Error', err.message || 'Login failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    showToast(
      'Google Authentication',
      `Simulated sign-in successful as ${demoAccounts.find((d) => d.role === selectedRole)?.name || 'Authorized User'}.`,
      'success'
    );
    handleSubmit();
  };

  return (
    <div className="min-h-screen bg-[#f3f4f8] flex items-center justify-center p-3 sm:p-6 lg:p-8">
      {/* Background Subtle Gradient Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-purple-200/40 rounded-full blur-3xl" />
        <div className="absolute top-2/3 -left-32 w-96 h-96 bg-blue-100/60 rounded-full blur-3xl" />
      </div>

      {/* Main Dual-Column Card Container */}
      <div className="relative max-w-5xl w-full mx-auto bg-white rounded-3xl lg:rounded-[36px] shadow-2xl shadow-indigo-950/5 border border-slate-200/60 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
        {/* Left Column: Form & Actions */}
        <div className="lg:col-span-6 p-6 sm:p-10 lg:p-12 flex flex-col justify-between">
          <div className="max-w-md w-full mx-auto">
            {/* Top Logo */}
            <div className="flex justify-center mb-6">
              <HireFlowLogo size="lg" />
            </div>

            {/* Headline */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight text-center mb-6">
              Welcome to HireFlow
            </h1>

            {/* Pill Segmented Switcher (Sign In / Sign Up) */}
            <div className="bg-[#f3f4f6] p-1 rounded-2xl flex items-center mb-6 shadow-inner">
              <button
                type="button"
                className="flex-1 py-2 text-center text-sm font-semibold rounded-xl bg-white text-slate-900 shadow-xs transition-all cursor-default"
              >
                Sign In
              </button>
              <Link
                to="/register"
                className="flex-1 py-2 text-center text-sm font-medium rounded-xl text-slate-500 hover:text-slate-900 transition-all"
              >
                Sign Up
              </Link>
            </div>

            {/* 1-Click Quick Persona Switcher */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  1-Click Role Switch
                </span>
                <span className="text-[11px] text-purple-600 font-medium">Demo Mode</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {demoAccounts.map((account) => {
                  const Icon = account.icon;
                  const isSelected = selectedRole === account.role;
                  return (
                    <button
                      key={account.role}
                      type="button"
                      onClick={() => handleSelectDemo(account)}
                      className={`py-2 px-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${isSelected
                        ? 'border-purple-600 bg-purple-50/70 text-purple-950 font-semibold ring-2 ring-purple-500/20 shadow-xs'
                        : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100/70 text-slate-600'
                        }`}
                    >
                      <Icon className={`h-3.5 w-3.5 ${isSelected ? 'text-purple-600' : 'text-slate-500'}`} />
                      <span className="text-[11px] font-medium leading-tight truncate w-full">
                        {account.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full px-4 py-2.5 sm:py-3 bg-slate-50/70 hover:bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full px-4 pr-11 py-2.5 sm:py-3 bg-slate-50/70 hover:bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me Toggle & Forgot Password */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  {/* iOS Style Pill Toggle Switch */}
                  <div className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-8 h-4.5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-3.5 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-purple-600" />
                  </div>
                  <span className="text-xs font-normal text-slate-600">Remember me</span>
                </label>

                <button
                  type="button"
                  onClick={() =>
                    showToast(
                      'Password Recovery',
                      'Click any demo role above to auto-fill credentials, or contact your HR administrator.',
                      'info'
                    )
                  }
                  className="text-xs font-semibold text-purple-600 hover:text-purple-700 hover:underline cursor-pointer"
                >
                  Forgot your password?
                </button>
              </div>

              {/* Log in CTA Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3.5 px-4 rounded-xl text-sm font-semibold text-white bg-[#181d27] hover:bg-[#252b37] active:bg-[#0f1217] transition-all shadow-md shadow-slate-900/10 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isLoading ? (
                  <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <span>
                    Log in as {selectedRole === 'hr' ? 'HR Admin' : selectedRole === 'candidate' ? 'Candidate' : 'Employee'}
                  </span>
                )}
              </button>
            </form>

            {/* Divider "or" */}
            <div className="relative my-4 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <span className="relative bg-white px-3 text-xs text-slate-400">or</span>
            </div>

            {/* Google Sign-in Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full py-2.5 sm:py-3 px-4 border border-slate-200 hover:bg-slate-50/80 active:bg-slate-100 rounded-xl text-sm font-medium text-slate-700 transition flex items-center justify-center gap-3 cursor-pointer shadow-2xs"
            >
              <GoogleIcon className="h-4.5 w-4.5 shrink-0" />
              <span>Sign in with Google</span>
            </button>
          </div>

          {/* Micro Footer Notice */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5 text-purple-600" />
              <span>{organization?.name || 'SecureTenant Cloud'}</span>
            </span>
            <span>Tenant: {organization?.tenantId || 'ST-TENANT-001'}</span>
          </div>
        </div>

        {/* Right Column: Hero Visual Showcase Card */}
        <div className="hidden lg:flex lg:col-span-6 p-4 sm:p-5 flex-col">
          <div className="w-full h-full rounded-[28px] bg-gradient-to-b from-[#eef0ff] via-[#f5f0ff] to-[#fcf8ff] border border-purple-100/50 p-8 xl:p-10 flex flex-col justify-between items-center relative overflow-hidden text-center shadow-inner">
            {/* Top Carousel Text Block */}
            <div className="relative z-10 max-w-md mx-auto">
              <h2 className="text-2xl xl:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight transition-all duration-300">
                {slides[currentSlide].title}
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm mt-3 leading-relaxed transition-all duration-300">
                {slides[currentSlide].description}
              </p>

              {/* Sparkle Pill */}
              <div className="mt-4 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium text-amber-800 bg-amber-50/80 border border-amber-200/60 shadow-2xs">
                <span>{slides[currentSlide].badge}</span>
              </div>

              {/* Pagination Dots (Active purple pill + inactive dots) */}
              <div className="flex items-center justify-center gap-1.5 mt-5">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${currentSlide === idx
                      ? 'w-7 bg-purple-600'
                      : 'w-2 bg-purple-200 hover:bg-purple-300'
                      }`}
                    title={`Slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Bottom Illustration (3 teammates collaborating at conference table) */}
            <div className="w-full mt-4 flex items-end justify-center relative z-10">
              <TeamCollaborationIllustration className="w-full max-h-[360px] drop-shadow-sm select-none" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
