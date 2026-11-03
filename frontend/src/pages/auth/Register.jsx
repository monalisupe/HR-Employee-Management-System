import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Shield,
  Eye,
  EyeOff,
  Briefcase,
  Users,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import HireFlowLogo from '../../components/common/HireFlowLogo';
import GoogleIcon from '../../components/common/GoogleIcon';
import TeamCollaborationIllustration from '../../components/illustrations/TeamCollaborationIllustration';

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

  const handleGoogleSignUp = () => {
    showToast('Google Registration', 'Google account linked. Fill details or proceed.', 'info');
    setFormData((prev) => ({
      ...prev,
      fullName: 'Google User',
      email: 'user@google-demo.com',
      password: 'SecureTenant2026!',
      confirmPassword: 'SecureTenant2026!',
    }));
  };

  return (
    <div className="min-h-screen bg-[#f3f4f8] flex items-center justify-center p-3 sm:p-6 lg:p-8">
      {/* Background Subtle Gradient Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-200/40 rounded-full blur-3xl" />
        <div className="absolute top-2/3 -right-32 w-96 h-96 bg-blue-100/60 rounded-full blur-3xl" />
      </div>

      {/* Main Dual-Column Card Container */}
      <div className="relative max-w-5xl w-full mx-auto bg-white rounded-3xl lg:rounded-[36px] shadow-2xl shadow-indigo-950/5 border border-slate-200/60 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
        {/* Left Column: Registration Form */}
        <div className="lg:col-span-6 p-6 sm:p-10 lg:p-12 flex flex-col justify-between">
          <div className="max-w-md w-full mx-auto">
            {/* Top Logo */}
            <div className="flex justify-center mb-6">
              <HireFlowLogo size="lg" />
            </div>

            {/* Headline */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight text-center mb-6">
              Create an Account
            </h1>

            {/* Pill Segmented Switcher (Sign In / Sign Up) */}
            <div className="bg-[#f3f4f6] p-1 rounded-2xl flex items-center mb-6 shadow-inner">
              <Link
                to="/"
                className="flex-1 py-2 text-center text-sm font-medium rounded-xl text-slate-500 hover:text-slate-900 transition-all"
              >
                Sign In
              </Link>
              <button
                type="button"
                className="flex-1 py-2 text-center text-sm font-semibold rounded-xl bg-white text-slate-900 shadow-xs transition-all cursor-default"
              >
                Sign Up
              </button>
            </div>

            {/* Role / Account Type Selector */}
            <div className="mb-5">
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2 text-center sm:text-left">
                Select Account Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setAccountType('candidate')}
                  className={`py-2.5 px-3 rounded-xl border text-center transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    accountType === 'candidate'
                      ? 'border-purple-600 bg-purple-50/70 text-purple-950 font-semibold ring-2 ring-purple-500/20 shadow-xs'
                      : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100/70 text-slate-600'
                  }`}
                >
                  <Briefcase className={`h-4 w-4 ${accountType === 'candidate' ? 'text-purple-600' : 'text-slate-400'}`} />
                  <span className="text-xs font-semibold">Candidate</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAccountType('hr')}
                  className={`py-2.5 px-3 rounded-xl border text-center transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    accountType === 'hr'
                      ? 'border-purple-600 bg-purple-50/70 text-purple-950 font-semibold ring-2 ring-purple-500/20 shadow-xs'
                      : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100/70 text-slate-600'
                  }`}
                >
                  <Users className={`h-4 w-4 ${accountType === 'hr' ? 'text-purple-600' : 'text-slate-400'}`} />
                  <span className="text-xs font-semibold">HR Admin</span>
                </button>
              </div>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="e.g. Alex Morgan"
                  className="w-full px-4 py-2.5 bg-slate-50/70 hover:bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Work Email
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@company.com"
                  className="w-full px-4 py-2.5 bg-slate-50/70 hover:bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 transition-all"
                />
              </div>

              {accountType === 'hr' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    placeholder="Company Name"
                    className="w-full px-4 py-2.5 bg-slate-50/70 hover:bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 transition-all"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Password"
                      className="w-full px-3.5 pr-9 py-2.5 bg-slate-50/70 hover:bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Confirm Password
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="Repeat"
                    className="w-full px-3.5 py-2.5 bg-slate-50/70 hover:bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 transition-all"
                  />
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formData.agreeTerms}
                    onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                    className="h-4 w-4 rounded text-purple-600 focus:ring-purple-500 border-slate-300 cursor-pointer"
                  />
                  <span className="text-xs text-slate-600">
                    I agree to the Terms of Service & Privacy Policy
                  </span>
                </label>
              </div>

              {/* Submit CTA Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3.5 px-4 rounded-xl text-sm font-semibold text-white bg-[#181d27] hover:bg-[#252b37] active:bg-[#0f1217] transition-all shadow-md shadow-slate-900/10 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isLoading ? (
                  <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <span>Create {accountType === 'candidate' ? 'Candidate' : 'HR Admin'} Account</span>
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

            {/* Google Sign-up Button */}
            <button
              type="button"
              onClick={handleGoogleSignUp}
              className="w-full py-2.5 px-4 border border-slate-200 hover:bg-slate-50/80 active:bg-slate-100 rounded-xl text-sm font-medium text-slate-700 transition flex items-center justify-center gap-3 cursor-pointer shadow-2xs"
            >
              <GoogleIcon className="h-4.5 w-4.5 shrink-0" />
              <span>Sign up with Google</span>
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
            {/* Top Showcase Text */}
            <div className="relative z-10 max-w-md mx-auto">
              <h2 className="text-2xl xl:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Smarter HR Starts Here
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm mt-3 leading-relaxed">
                Connect your team with real-time employee workflows, talent pipelines, and transparent HR analytics.
              </p>

              {/* Sparkle Pill */}
              <div className="mt-4 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium text-amber-800 bg-amber-50/80 border border-amber-200/60 shadow-2xs">
                <span>✨ Support Teams with Better HR Insights ✨</span>
              </div>
            </div>

            {/* Bottom Illustration */}
            <div className="w-full mt-4 flex items-end justify-center relative z-10">
              <TeamCollaborationIllustration className="w-full max-h-[360px] drop-shadow-sm select-none" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
