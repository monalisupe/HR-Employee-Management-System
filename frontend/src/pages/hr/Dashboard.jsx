import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Briefcase,
  Calendar,
  Plus,
  ArrowRight,
  FileCheck,
  CalendarDays,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  Inbox,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import SummaryCards from '../../components/dashboard/SummaryCards';
import RecentActivities from '../../components/dashboard/RecentActivities';

export default function Dashboard() {
  const navigate = useNavigate();
  const {
    organization,
    applicants,
    leaveRequests,
    holidays,
    onboardingDocuments,
    openPositions,
  } = useApp();

  // Metrics
  const pendingLeaves = leaveRequests.filter((l) => l.status === 'Pending');
  const pendingDocs = onboardingDocuments.filter((d) => d.verificationStatus === 'Pending');
  const underReviewApps = applicants.filter((a) => a.status === 'Under Review' || a.status === 'Applied');
  const upcomingHolidays = holidays.slice(0, 3);
  const totalPendingActions = pendingLeaves.length + underReviewApps.length + pendingDocs.length;

  // Pipeline stages
  const stages = [
    { label: 'Applied', count: applicants.filter((a) => a.status === 'Applied').length, color: 'bg-blue-500' },
    { label: 'Screening', count: applicants.filter((a) => a.status === 'Under Review').length, color: 'bg-amber-500' },
    { label: 'Shortlisted', count: applicants.filter((a) => a.status === 'Shortlisted').length, color: 'bg-indigo-500' },
    { label: 'Interview', count: applicants.filter((a) => a.status === 'Interview Scheduled').length, color: 'bg-purple-500' },
    { label: 'Offer / Selected', count: applicants.filter((a) => a.status === 'Selected').length, color: 'bg-emerald-500' },
    { label: 'Rejected', count: applicants.filter((a) => a.status === 'Rejected').length, color: 'bg-rose-500' },
  ];

  return (
    <div className="space-y-8">
      {/* 1. Spacious Clean Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200/70">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Executive Overview
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 border border-purple-200/80 text-purple-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>{organization?.tenantId || 'TENANT-ST-2026-X'}</span>
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            {organization?.name || 'HireFlow HR Cloud'} • Workforce Operations & Recruitment Intelligence
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/hr/positions')}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Create Position</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/hr/applicants')}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl shadow-2xs transition-colors cursor-pointer"
          >
            <span>Applicants</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600">
              {applicants.length}
            </span>
          </button>
        </div>
      </div>

      {/* 2. Streamlined KPI Stats (Generous breathing room, zero clutter) */}
      <SummaryCards />

      {/* 3. Main Operational Sections (Dual Column Grid with Airy Spacing) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        {/* Left: Recruitment Pipeline Overview (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div>
                <h2 className="text-base font-bold text-slate-900">Recruitment Funnel</h2>
                <p className="text-xs text-slate-500 mt-0.5">Live candidate flow across hiring stages</p>
              </div>
              <button
                onClick={() => navigate('/hr/applicants')}
                className="text-xs font-semibold text-purple-600 hover:text-purple-700 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>View Full Pipeline</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Pipeline State */}
            {applicants.length === 0 ? (
              <div className="py-12 px-6 text-center rounded-2xl bg-slate-50/50 border border-dashed border-slate-200 my-2">
                <div className="h-12 w-12 rounded-2xl bg-purple-100/70 text-purple-600 flex items-center justify-center mx-auto mb-3 shadow-2xs">
                  <Inbox className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-slate-800 text-sm">
                  No active applicants in pipeline
                </h3>
                <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                  Published job openings and incoming candidate submissions will automatically track here in real time.
                </p>
                <div className="mt-5">
                  <button
                    type="button"
                    onClick={() => navigate('/hr/positions')}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-xl transition-all cursor-pointer shadow-xs"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Open First Position</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 pt-2">
                {stages.map((stage) => {
                  const percentage = Math.round((stage.count / applicants.length) * 100);
                  return (
                    <div key={stage.label}>
                      <div className="flex items-center justify-between text-xs font-medium mb-1.5">
                        <span className="text-slate-700 font-semibold">{stage.label}</span>
                        <span className="text-slate-500 font-semibold">
                          {stage.count} ({percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${stage.color}`}
                          style={{ width: `${Math.max(percentage, stage.count > 0 ? 5 : 0)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right: Actionable Pending Tasks (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div>
                <h2 className="text-base font-bold text-slate-900">Pending Actions</h2>
                <p className="text-xs text-slate-500 mt-0.5">Tasks requiring HR review & approval</p>
              </div>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                totalPendingActions === 0
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                  : 'bg-amber-50 text-amber-700 border border-amber-200/60'
              }`}>
                {totalPendingActions} {totalPendingActions === 1 ? 'task' : 'tasks'}
              </span>
            </div>

            {totalPendingActions === 0 ? (
              <div className="py-10 px-4 text-center rounded-2xl bg-emerald-50/40 border border-dashed border-emerald-200/80 mb-4">
                <div className="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2 shadow-2xs">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <p className="font-bold text-emerald-950 text-xs sm:text-sm">
                  All Clear! Zero Pending Approvals
                </p>
                <p className="text-[11px] text-emerald-700/80 mt-1 max-w-xs mx-auto">
                  Leave requests, application evaluations, and employee document verifications are up-to-date.
                </p>
              </div>
            ) : null}

            <div className="space-y-3">
              {/* Task 1: Leave Requests */}
              <div
                onClick={() => navigate('/hr/leaves')}
                className="p-4 rounded-xl border border-slate-100 hover:border-amber-200 hover:bg-amber-50/20 transition-all cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 group-hover:scale-105 transition-transform">
                    <CalendarDays className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">Leave Approvals</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {pendingLeaves.length} request{pendingLeaves.length === 1 ? '' : 's'} awaiting decision
                    </p>
                  </div>
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                  pendingLeaves.length > 0 ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-500'
                }`}>
                  {pendingLeaves.length}
                </span>
              </div>

              {/* Task 2: Applications to review */}
              <div
                onClick={() => navigate('/hr/applicants')}
                className="p-4 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/20 transition-all cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600 group-hover:scale-105 transition-transform">
                    <Users className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">Applicant Reviews</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {underReviewApps.length} profile{underReviewApps.length === 1 ? '' : 's'} in screening
                    </p>
                  </div>
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                  underReviewApps.length > 0 ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-500'
                }`}>
                  {underReviewApps.length}
                </span>
              </div>

              {/* Task 3: Document Verifications */}
              <div
                onClick={() => navigate('/hr/onboarding')}
                className="p-4 rounded-xl border border-slate-100 hover:border-purple-200 hover:bg-purple-50/20 transition-all cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="p-2.5 rounded-lg bg-purple-50 text-purple-600 group-hover:scale-105 transition-transform">
                    <FileCheck className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">Compliance Documents</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {pendingDocs.length} verification{pendingDocs.length === 1 ? '' : 's'} required
                    </p>
                  </div>
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                  pendingDocs.length > 0 ? 'bg-purple-100 text-purple-800' : 'bg-slate-100 text-slate-500'
                }`}>
                  {pendingDocs.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Bottom Grid: Upcoming Holidays & Recent Activities (Balanced & Calm) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 pt-2">
        {/* Upcoming Holidays */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
            <div>
              <h2 className="text-base font-bold text-slate-900">Upcoming Company Holidays</h2>
              <p className="text-xs text-slate-500 mt-0.5">Official company-wide non-working days</p>
            </div>
            <button
              onClick={() => navigate('/hr/holidays')}
              className="text-xs font-semibold text-purple-600 hover:text-purple-700 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>Full Schedule</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {upcomingHolidays.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              <Calendar className="h-8 w-8 mx-auto text-slate-300 mb-2" />
              <p className="font-semibold text-slate-600">No holidays scheduled</p>
              <p className="mt-1 text-slate-400">
                Configure annual company-wide and departmental holidays.
              </p>
              <button
                type="button"
                onClick={() => navigate('/hr/holidays')}
                className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-purple-700 bg-purple-50 rounded-lg hover:bg-purple-100 cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Holiday</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingHolidays.map((hol) => (
                <div
                  key={hol.id}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 hover:bg-slate-50/80 transition-colors"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="p-2 rounded-xl bg-purple-50 text-purple-700 font-bold text-center min-w-[50px]">
                      <span className="block text-[10px] uppercase text-purple-600 font-semibold">
                        {new Date(hol.date).toLocaleString('default', { month: 'short' })}
                      </span>
                      <span className="block text-sm font-extrabold">
                        {new Date(hol.date).getDate()}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">{hol.name}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{hol.department || 'All Company Departments'}</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    {hol.type}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent HR Activities Timeline */}
        <RecentActivities />
      </div>
    </div>
  );
}
