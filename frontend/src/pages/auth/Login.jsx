import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Shield,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  Users,
  Briefcase,
  UserCheck,
  Building2,
  KeyRound,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

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

  const demoAccounts = [
    {
      role: 'hr',
      label: 'HR Admin',
      email: 'admin@securetenant.io',
      name: 'Sarah Jenkins',
      badge: 'Full Access',
      icon: Users,
      color: 'border-violet-200 bg-violet-50/60 text-violet-700',
      activeColor: 'border-violet-600 bg-violet-50 text-violet-900 ring-2 ring-violet-500/20 shadow-xs',
      path: '/hr/dashboard',
    },
    {
      role: 'candidate',
      label: 'Candidate',
      email: 'alex.rivera@example.com',
      name: 'Alex Rivera',
      badge: 'Applicant',
      icon: Briefcase,
      color: 'border-slate-200 bg-slate-50/70 text-slate-700',
      activeColor: 'border-indigo-600 bg-indigo-50 text-indigo-900 ring-2 ring-indigo-500/20 shadow-xs',
      path: '/candidate/dashboard',
    },
    {
      role: 'employee',
      label: 'Employee',
      email: 'jordan.hayes@securetenant.io',
      name: 'Jordan Hayes',
      badge: 'Staff Member',
      icon: UserCheck,
      color: 'border-slate-200 bg-slate-50/70 text-slate-700',
      activeColor: 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500/20 shadow-xs',
      path: '/employee/dashboard',
    },
  ];

  const handleSelectDemo = (demo) => {
    setSelectedRole(demo.role);
    setEmail(demo.email);
    setPassword('SecureTenant2026!');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await login({
        email,
        password,
        role: selectedRole,
        rememberMe,
      });

      if (res && res.success) {
        // Redirect to requested page if appropriate, or to the role dashboard
        const redirectPath = location.state?.from?.pathname;
        const targetDashboard =
          selectedRole === 'candidate'
            ? '/candidate/dashboard'
            : selectedRole === 'employee'
            ? '/employee/dashboard'
            : '/hr/dashboard';

        // Only redirect to saved path if it matches the current role prefix
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

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      {/* Background Decorative Blur */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-violet-400/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-5xl w-full mx-auto bg-white rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* Left Visual / Branding Showcase (Desktop) */}
        <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-slate-900 via-purple-950 to-violet-950 p-10 flex-col justify-between text-white relative overflow-hidden">
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-violet-500/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute top-12 right-12 w-48 h-48 bg-purple-500/15 rounded-full blur-2xl pointer-events-none" />

          {/* Brand header */}
          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  SecureTenant
                  <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-violet-500/30 border border-violet-400/30 text-violet-200">
                    Enterprise
                  </span>
                </h2>
                <p className="text-xs text-slate-300">Multi-Tenant HR & Workforce Portal</p>
              </div>
            </div>

            <div className="mt-10 space-y-4">
              <h3 className="text-2xl font-bold leading-tight">
                Unified Workforce Management & Security Suite
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Seamless multi-tenant isolation connecting HR administrators, job applicants, and active staff in real-time.
              </p>
            </div>
          </div>

          {/* Highlights feature list */}
          <div className="relative z-10 space-y-3.5 my-8">
            <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <CheckCircle2 className="h-5 w-5 text-violet-400 shrink-0 mt-0.5" />
              <div className="text-xs">
                <p className="font-semibold text-white">Multi-Role Simulation</p>
                <p className="text-slate-300 mt-0.5">Instant role switching between HR Admin, Candidate, and Employee portals.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <CheckCircle2 className="h-5 w-5 text-violet-400 shrink-0 mt-0.5" />
              <div className="text-xs">
                <p className="font-semibold text-white">Full Lifecycle Recruitment</p>
                <p className="text-slate-300 mt-0.5">Job postings, candidate applications, interview scheduling & onboarding conversion.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <CheckCircle2 className="h-5 w-5 text-violet-400 shrink-0 mt-0.5" />
              <div className="text-xs">
                <p className="font-semibold text-white">Enterprise Governance</p>
                <p className="text-slate-300 mt-0.5">Automated leave balances, compliance document audit, and performance tracking.</p>
              </div>
            </div>
          </div>

          {/* Tenant badge footer */}
          <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <Building2 className="h-4 w-4 text-violet-400" />
              <span>{organization?.name || 'SecureTenant HQ'}</span>
            </div>
            <span className="font-mono text-[11px] bg-white/10 px-2 py-0.5 rounded-md text-slate-300">
              {organization?.tenantId || 'ST-TENANT-001'}
            </span>
          </div>
        </div>

        {/* Right Panel: Login Form */}
        <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-between">
          <div>
            {/* Mobile Header Branding */}
            <div className="flex lg:hidden items-center gap-3 mb-6 pb-4 border-b border-slate-100">
              <div className="h-10 w-10 rounded-xl bg-violet-600 flex items-center justify-center text-white shadow-md shadow-violet-500/20">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900 leading-tight">SecureTenant</h1>
                <p className="text-xs text-slate-500">Tenant ID: {organization?.tenantId || 'ST-TENANT-001'}</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Sign In</h2>
                <p className="text-sm text-slate-500 mt-1">
                  Access your organization's workforce management portal
                </p>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-violet-50 text-violet-700 border border-violet-100">
                <ShieldCheck className="h-3.5 w-3.5 text-violet-600" />
                Protected Session
              </span>
            </div>

            {/* Quick-Fill Persona Selector */}
            <div className="mt-6">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                1-Click Fast Login by Persona
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {demoAccounts.map((account) => {
                  const Icon = account.icon;
                  const isSelected = selectedRole === account.role;
                  return (
                    <button
                      key={account.role}
                      type="button"
                      onClick={() => handleSelectDemo(account)}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                        isSelected ? account.activeColor : 'border-slate-200 bg-slate-50/70 hover:bg-slate-100/70 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-white/80 shadow-2xs' : 'bg-white border border-slate-200'}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider opacity-75">
                          {account.badge}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs font-bold leading-tight">{account.label}</p>
                        <p className="text-[11px] opacity-75 truncate">{account.name}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Work Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => showToast('Password Recovery', 'Demo mode: Click any persona card above to reset credentials.', 'info')}
                    className="text-xs font-medium text-violet-600 hover:text-violet-700 cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Security notice */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded text-violet-600 focus:ring-violet-500 border-slate-300 cursor-pointer"
                  />
                  <span className="text-xs font-medium text-slate-600">Keep me signed in</span>
                </label>
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <KeyRound className="h-3 w-3 text-emerald-500" />
                  256-bit TLS Encrypted
                </span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-violet-600 hover:bg-violet-700 active:bg-violet-800 shadow-md shadow-violet-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isLoading ? (
                  <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Enter {selectedRole === 'hr' ? 'HR Portal' : selectedRole === 'candidate' ? 'Candidate Portal' : 'Employee Portal'}</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Footer Navigation */}
          <div className="mt-8 pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <p>
              New to SecureTenant?{' '}
              <Link to="/register" className="font-semibold text-violet-600 hover:text-violet-700">
                Register an account
              </Link>
            </p>
            <div className="flex items-center gap-4 text-slate-400">
              <span className="hover:text-slate-600 cursor-pointer">Privacy</span>
              <span>•</span>
              <span className="hover:text-slate-600 cursor-pointer">Security Terms</span>
              <span>•</span>
              <span className="hover:text-slate-600 cursor-pointer">v2.4 LTS</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
