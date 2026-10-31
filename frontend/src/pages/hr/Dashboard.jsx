import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Calendar,
  Plus,
  ArrowRight,
  FileCheck,
  CalendarDays,
  CheckSquare,
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
  } = useApp();

  // Metrics
  const pendingLeaves = leaveRequests.filter((l) => l.status === 'Pending');
  const pendingDocs = onboardingDocuments.filter((d) => d.verificationStatus === 'Pending');
  const underReviewApps = applicants.filter((a) => a.status === 'Under Review' || a.status === 'Applied');
  const upcomingHolidays = holidays.slice(0, 3);

  // Recruitment funnel stage counts
  const stageStats = [
    { label: 'Applied', count: applicants.filter((a) => a.status === 'Applied').length, color: 'bg-blue-500' },
    { label: 'Under Review', count: applicants.filter((a) => a.status === 'Under Review').length, color: 'bg-amber-500' },
    { label: 'Shortlisted', count: applicants.filter((a) => a.status === 'Shortlisted').length, color: 'bg-indigo-500' },
    { label: 'Interview Scheduled', count: applicants.filter((a) => a.status === 'Interview Scheduled').length, color: 'bg-purple-500' },
    { label: 'Selected', count: applicants.filter((a) => a.status === 'Selected').length, color: 'bg-emerald-500' },
    { label: 'Rejected', count: applicants.filter((a) => a.status === 'Rejected').length, color: 'bg-rose-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Title & Quick Actions Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              HR Executive Overview
            </h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-violet-100 text-violet-800">
              {organization.tenantId}
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            {organization.name} • {organization.industry}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => navigate('/hr/positions')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-violet-600 hover:bg-violet-700 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Create Position</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/hr/applicants')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl shadow-2xs transition-colors cursor-pointer"
          >
            <span>Review Applicants</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <SummaryCards />

      {/* Grid: Recruitment Funnel & Pending Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recruitment Pipeline Breakdown */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Recruitment Funnel Progress</h3>
              <p className="text-xs text-slate-500">Live breakdown of current job applicants</p>
            </div>
            <button
              onClick={() => navigate('/hr/applicants')}
              className="text-xs font-semibold text-violet-600 hover:text-violet-700 flex items-center gap-1"
            >
              View All ({applicants.length})
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {applicants.length === 0 ? (
            <div className="py-10 text-center text-xs text-slate-400">
              <Users className="h-8 w-8 mx-auto text-slate-300 mb-2" />
              <p className="font-semibold text-slate-600">Zero active applicants in pipeline</p>
              <p className="mt-1 text-slate-400 max-w-sm mx-auto">
                Candidates applying from the Candidate Portal will dynamically advance through screening, interview, and selection.
              </p>
              <div className="mt-4 flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => navigate('/hr/positions')}
                  className="px-3 py-1.5 text-xs font-medium text-violet-700 bg-violet-50 rounded-lg hover:bg-violet-100 transition-colors"
                >
                  Manage Job Openings
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {stageStats.map((stage) => {
                const percentage = Math.round((stage.count / applicants.length) * 100);
                return (
                  <div key={stage.label}>
                    <div className="flex items-center justify-between text-xs font-medium mb-1.5">
                      <span className="text-slate-700">{stage.label}</span>
                      <span className="text-slate-500 font-semibold">
                        {stage.count} ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                      <div
                        className={`h-2.5 rounded-full transition-all duration-300 ${stage.color}`}
                        style={{ width: `${Math.max(percentage, stage.count > 0 ? 5 : 0)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Pending HR Tasks Widget */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Pending HR Tasks</h3>
              <p className="text-xs text-slate-500">Items requiring administrative action</p>
            </div>
            <div className="p-2 rounded-xl bg-violet-50 text-violet-600">
              <CheckSquare className="h-4 w-4" />
            </div>
          </div>

          <div className="space-y-3">
            {/* Task 1: Pending Leaves */}
            <div
              onClick={() => navigate('/hr/leaves')}
              className="p-3 rounded-xl border border-slate-100 hover:border-amber-200 hover:bg-amber-50/30 transition-all cursor-pointer flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
                  <CalendarDays className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">Pending Leave Approvals</p>
                  <p className="text-[11px] text-slate-500">
                    {pendingLeaves.length} request{pendingLeaves.length === 1 ? '' : 's'} awaiting review
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                {pendingLeaves.length}
              </span>
            </div>

            {/* Task 2: Applications to review */}
            <div
              onClick={() => navigate('/hr/applicants')}
              className="p-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all cursor-pointer flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                  <Users className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">Applications Under Review</p>
                  <p className="text-[11px] text-slate-500">
                    {underReviewApps.length} candidate{underReviewApps.length === 1 ? '' : 's'} to screen
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                {underReviewApps.length}
              </span>
            </div>

            {/* Task 3: Unverified Onboarding Docs */}
            <div
              onClick={() => navigate('/hr/onboarding')}
              className="p-3 rounded-xl border border-slate-100 hover:border-violet-200 hover:bg-violet-50/30 transition-all cursor-pointer flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-violet-50 text-violet-600">
                  <FileCheck className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">Document Verifications</p>
                  <p className="text-[11px] text-slate-500">
                    {pendingDocs.length} employee document{pendingDocs.length === 1 ? '' : 's'} pending
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-violet-100 text-violet-800">
                {pendingDocs.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Upcoming Holidays & Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Holidays Widget */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Upcoming Company Holidays</h3>
              <p className="text-xs text-slate-500">Configured in Holiday Management</p>
            </div>
            <button
              onClick={() => navigate('/hr/holidays')}
              className="text-xs font-semibold text-violet-600 hover:text-violet-700 flex items-center gap-1"
            >
              Calendar & List
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {upcomingHolidays.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              <Calendar className="h-8 w-8 mx-auto text-slate-300 mb-2" />
              <p className="font-semibold text-slate-600">No holidays scheduled</p>
              <p className="mt-1 text-slate-400">
                HR can configure company-wide and departmental holidays.
              </p>
              <button
                type="button"
                onClick={() => navigate('/hr/holidays')}
                className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-violet-700 bg-violet-50 rounded-lg hover:bg-violet-100"
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
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-violet-50 text-violet-700 font-bold text-center min-w-[50px]">
                      <span className="block text-[10px] uppercase text-violet-600">
                        {new Date(hol.date).toLocaleString('default', { month: 'short' })}
                      </span>
                      <span className="block text-sm">
                        {new Date(hol.date).getDate()}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">{hol.name}</p>
                      <p className="text-[11px] text-slate-500">{hol.department || 'All Departments'}</p>
                    </div>
                  </div>
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
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

