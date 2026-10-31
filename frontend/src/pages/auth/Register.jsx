import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Shield,
  Lock,
  Mail,
  User,
  Building2,
  Phone,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  Briefcase,
  Users,
  Sparkles,
  KeyRound,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function Register() {
  const navigate = useNavigate();
  const { register, showToast, organization } = useApp();

  const [accountType, setAccountType] = useState('candidate'); // 'candidate' | 'hr'
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    companyName: 'SecureTenant Systems Inc',
    password: '',
    confirmPassword: '',
    agreeTerms: true,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
      showToast('Validation Error', 'Passwords do not match.', 'error');
      return;
    }

    setIsLoading(true);

    try {
      const res = await register({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        companyName: formData.companyName,
        password: formData.password,
        accountType,
      });

      if (res && res.success) {
        if (accountType === 'candidate') {
          navigate('/candidate/dashboard', { replace: true });
        } else {
          navigate('/hr/dashboard', { replace: true });
        }
      }
    } catch (err) {
      showToast('Registration Error', err.message || 'Failed to complete registration', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      {/* Background Decorative Blur */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-violet-400/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-40 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-5xl w-full mx-auto bg-white rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* Left Branding Panel */}
        <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-slate-900 via-purple-950 to-violet-950 p-10 flex-col justify-between text-white relative overflow-hidden">
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-violet-500/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute top-12 right-12 w-48 h-48 bg-purple-500/15 rounded-full blur-2xl pointer-events-none" />

          {/* Header */}
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
                <p className="text-xs text-slate-300">Identity & Tenant Registration</p>
              </div>
            </div>

            <div className="mt-10 space-y-4">
              <h3 className="text-2xl font-bold leading-tight">
                Create Your Profile on SecureTenant
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Join our integrated workplace ecosystem. Register as an applicant to explore careers or configure an HR organizational workspace.
              </p>
            </div>
          </div>

          {/* Highlights */}
          <div className="relative z-10 space-y-3.5 my-8">
            <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <CheckCircle2 className="h-5 w-5 text-violet-400 shrink-0 mt-0.5" />
              <div className="text-xs">
                <p className="font-semibold text-white">Instant Application Tracking</p>
                <p className="text-slate-300 mt-0.5">Track your resume stages, interviews, and job offers with zero latency.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <CheckCircle2 className="h-5 w-5 text-violet-400 shrink-0 mt-0.5" />
              <div className="text-xs">
                <p className="font-semibold text-white">Digital Document Vault</p>
                <p className="text-slate-300 mt-0.5">Automated onboarding verification and compliant employee files.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <CheckCircle2 className="h-5 w-5 text-violet-400 shrink-0 mt-0.5" />
              <div className="text-xs">
                <p className="font-semibold text-white">Data Privacy Guaranteed</p>
                <p className="text-slate-300 mt-0.5">Isolated role policies and enterprise grade multi-tenant isolation.</p>
              </div>
            </div>
          </div>

          {/* Footer */}
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

        {/* Right Panel: Form */}
        <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-between">
          <div>
            {/* Mobile Header Branding */}
            <div className="flex lg:hidden items-center gap-3 mb-6 pb-4 border-b border-slate-100">
              <div className="h-10 w-10 rounded-xl bg-violet-600 flex items-center justify-center text-white shadow-md shadow-violet-500/20">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900 leading-tight">SecureTenant</h1>
                <p className="text-xs text-slate-500">Create an account</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Get Started</h2>
                <p className="text-sm text-slate-500 mt-1">
                  Choose your account category and set up your profile
                </p>
              </div>
              <span className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-violet-50 text-violet-700 border border-violet-100">
                <Sparkles className="h-3 w-3" />
                Easy Setup
              </span>
            </div>

            {/* Account Category Selector */}
            <div className="mt-6">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                Select Account Type
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setAccountType('candidate')}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                    accountType === 'candidate'
                      ? 'border-indigo-600 bg-indigo-50/90 text-indigo-900 ring-2 ring-indigo-500/20 shadow-xs'
                      : 'border-slate-200 bg-slate-50/70 hover:bg-slate-100/70 text-slate-700'
                  }`}
                >
                  <div className={`p-2 rounded-xl ${accountType === 'candidate' ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}>
                    <Briefcase className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold leading-tight">Job Candidate</p>
                    <p className="text-[11px] opacity-75">Apply to open jobs & track interviews</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setAccountType('hr')}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                    accountType === 'hr'
                      ? 'border-violet-600 bg-violet-50/90 text-violet-900 ring-2 ring-violet-500/20 shadow-xs'
                      : 'border-slate-200 bg-slate-50/70 hover:bg-slate-100/70 text-slate-700'
                  }`}
                >
                  <div className={`p-2 rounded-xl ${accountType === 'hr' ? 'bg-violet-600 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}>
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold leading-tight">HR Administrator</p>
                    <p className="text-[11px] opacity-75">Manage jobs, staff & operations</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <User className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder={accountType === 'candidate' ? 'Alex Rivera' : 'Sarah Jenkins'}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Phone className="h-4 w-4" />
                    </div>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+1 (555) 019-2834"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 transition-all"
                  />
                </div>
              </div>

              {accountType === 'hr' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Organization / Company
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Building2 className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      placeholder="Organization Name"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 transition-all"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="h-4 w-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Minimum 8 characters"
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

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="h-4 w-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      placeholder="Confirm password"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Terms check */}
              <div className="flex items-start gap-2 pt-1">
                <input
                  type="checkbox"
                  id="agreeTerms"
                  required
                  checked={formData.agreeTerms}
                  onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                  className="h-4 w-4 mt-0.5 rounded text-violet-600 focus:ring-violet-500 border-slate-300 cursor-pointer"
                />
                <label htmlFor="agreeTerms" className="text-xs text-slate-600 cursor-pointer select-none">
                  I agree to the <span className="text-violet-600 hover:underline">Terms of Service</span> and acknowledge the <span className="text-violet-600 hover:underline">Privacy Policy</span>.
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-violet-600 hover:bg-violet-700 active:bg-violet-800 shadow-md shadow-violet-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isLoading ? (
                  <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Create My Account</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <p>
              Already registered on SecureTenant?{' '}
              <Link to="/login" className="font-semibold text-violet-600 hover:text-violet-700">
                Sign In
              </Link>
            </p>
            <div className="flex items-center gap-2 text-slate-400">
              <KeyRound className="h-3.5 w-3.5 text-violet-500" />
              <span>Multi-Tenant Auth</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
