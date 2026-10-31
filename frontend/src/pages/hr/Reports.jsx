import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Users,
  Briefcase,
  CalendarDays,
  Award,
  FileCheck,
  Building,
  PieChart,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function Reports() {
  const {
    openPositions,
    applicants,
    employees,
    leaveRequests,
    onboardingDocuments,
    performanceReviews,
    departments,
  } = useApp();

  // Metrics
  const totalEmployees = employees.length;
  const totalApplicants = applicants.length;
  const publishedPositions = openPositions.filter((p) => p.status === 'Published').length;
  const selectedCount = applicants.filter((a) => a.status === 'Selected').length;
  const rejectedCount = applicants.filter((a) => a.status === 'Rejected').length;
  const pendingLeaves = leaveRequests.filter((l) => l.status === 'Pending').length;
  const approvedLeaves = leaveRequests.filter((l) => l.status === 'Approved').length;

  // Headcount by department
  const headcountByDept = departments.map((d) => ({
    name: d.name,
    count: employees.filter((e) => e.department === d.name).length,
  }));

  // Recruitment status counts
  const recruitmentStatusCounts = [
    { label: 'Applied', count: applicants.filter((a) => a.status === 'Applied').length, color: 'bg-blue-500' },
    { label: 'Under Review', count: applicants.filter((a) => a.status === 'Under Review').length, color: 'bg-amber-500' },
    { label: 'Shortlisted', count: applicants.filter((a) => a.status === 'Shortlisted').length, color: 'bg-indigo-500' },
    { label: 'Interview Scheduled', count: applicants.filter((a) => a.status === 'Interview Scheduled').length, color: 'bg-purple-500' },
    { label: 'Selected', count: selectedCount, color: 'bg-emerald-500' },
    { label: 'Rejected', count: rejectedCount, color: 'bg-rose-500' },
  ];

  // Average performance rating
  const avgRating = performanceReviews.length > 0
    ? (performanceReviews.reduce((sum, r) => sum + (r.rating || 0), 0) / performanceReviews.length).toFixed(1)
    : '0.0';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Reports & Operational Analytics
            </h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-violet-100 text-violet-800">
              Live Aggregate
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            Real-time analytics computed strictly from current local tenant records.
          </p>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
            Hiring Conversion Rate
          </span>
          <p className="text-2xl font-bold text-slate-900 mt-1">
            {totalApplicants > 0 ? `${Math.round((selectedCount / totalApplicants) * 100)}%` : '0%'}
          </p>
          <span className="text-[11px] text-slate-500 mt-1 block">
            {selectedCount} selected of {totalApplicants} applicants
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
            Active Job Openings
          </span>
          <p className="text-2xl font-bold text-indigo-700 mt-1">
            {publishedPositions}
          </p>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Across {departments.length} departments
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
            Leave Approval Rate
          </span>
          <p className="text-2xl font-bold text-emerald-700 mt-1">
            {leaveRequests.length > 0 ? `${Math.round((approvedLeaves / leaveRequests.length) * 100)}%` : '0%'}
          </p>
          <span className="text-[11px] text-slate-500 mt-1 block">
            {approvedLeaves} approved of {leaveRequests.length} total
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
            Avg. Performance Score
          </span>
          <p className="text-2xl font-bold text-amber-600 mt-1">
            ★ {avgRating} <span className="text-xs font-normal text-slate-400">/ 5.0</span>
          </p>
          <span className="text-[11px] text-slate-500 mt-1 block">
            {performanceReviews.length} appraisals recorded
          </span>
        </div>
      </div>

      {/* Grid: Headcount & Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Headcount by Department */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Department Headcount</h3>
              <p className="text-xs text-slate-500">Distribution of active personnel</p>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-violet-50 text-violet-700">
              {totalEmployees} Employees
            </span>
          </div>

          {totalEmployees === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              <Users className="h-8 w-8 mx-auto text-slate-300 mb-2" />
              <p className="font-semibold text-slate-600">Zero Employees Recorded</p>
              <p className="mt-1 text-slate-400 max-w-xs mx-auto">
                As employees are added or candidates are onboarded, departmental counts calculate dynamically.
              </p>
            </div>
          ) : (
            <div className="space-y-3.5">
              {headcountByDept.map((dept) => {
                const pct = totalEmployees > 0 ? Math.round((dept.count / totalEmployees) * 100) : 0;
                return (
                  <div key={dept.name}>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-slate-700">{dept.name}</span>
                      <span className="text-slate-500">{dept.count} ({pct}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div
                        className="bg-violet-600 h-2 rounded-full transition-all"
                        style={{ width: `${Math.max(pct, dept.count > 0 ? 5 : 0)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recruitment Funnel Breakdown */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Application Pipeline Status</h3>
              <p className="text-xs text-slate-500">Candidate progression across stages</p>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
              {totalApplicants} Applications
            </span>
          </div>

          {totalApplicants === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              <BarChart3 className="h-8 w-8 mx-auto text-slate-300 mb-2" />
              <p className="font-semibold text-slate-600">Zero Applications in Pipeline</p>
              <p className="mt-1 text-slate-400 max-w-xs mx-auto">
                Candidate applications will display here broken down by review stage.
              </p>
            </div>
          ) : (
            <div className="space-y-3.5">
              {recruitmentStatusCounts.map((item) => {
                const pct = Math.round((item.count / totalApplicants) * 100);
                return (
                  <div key={item.label}>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-slate-700">{item.label}</span>
                      <span className="text-slate-500">{item.count} ({pct}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${item.color}`}
                        style={{ width: `${Math.max(pct, item.count > 0 ? 5 : 0)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Grid: Onboarding & Leave Summaries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Onboarding Compliance */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
          <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100 mb-4">
            Onboarding & Document Verification Status
          </h3>
          {onboardingDocuments.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              <FileCheck className="h-8 w-8 mx-auto text-slate-300 mb-2" />
              <p className="font-semibold text-slate-600">No Document Submissions</p>
              <p className="mt-1">0 documents submitted or verified.</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-xs text-slate-500">Submitted</span>
                <p className="text-xl font-bold text-slate-800 mt-1">{onboardingDocuments.length}</p>
              </div>
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-100">
                <span className="text-xs text-amber-700">Pending</span>
                <p className="text-xl font-bold text-amber-800 mt-1">
                  {onboardingDocuments.filter((d) => d.verificationStatus === 'Pending').length}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                <span className="text-xs text-emerald-700">Verified</span>
                <p className="text-xl font-bold text-emerald-800 mt-1">
                  {onboardingDocuments.filter((d) => d.verificationStatus === 'Verified').length}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Leave Requests Summary */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
          <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100 mb-4">
            Time-Off & Leave Status Summary
          </h3>
          {leaveRequests.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              <CalendarDays className="h-8 w-8 mx-auto text-slate-300 mb-2" />
              <p className="font-semibold text-slate-600">No Leave Requests</p>
              <p className="mt-1">0 time-off requests submitted.</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-xs text-slate-500">Total Requests</span>
                <p className="text-xl font-bold text-slate-800 mt-1">{leaveRequests.length}</p>
              </div>
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-100">
                <span className="text-xs text-amber-700">Pending</span>
                <p className="text-xl font-bold text-amber-800 mt-1">{pendingLeaves}</p>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                <span className="text-xs text-emerald-700">Approved</span>
                <p className="text-xl font-bold text-emerald-800 mt-1">{approvedLeaves}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

