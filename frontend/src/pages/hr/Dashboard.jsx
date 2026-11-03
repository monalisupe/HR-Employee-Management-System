import React, { useState, useMemo } from 'react';
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
  Clock,
  Sparkles,
  RefreshCw,
  ArrowUpRight,
  ChevronRight,
  Layers,
  Inbox,
  Building,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import SummaryCards from '../../components/dashboard/SummaryCards';

export default function Dashboard() {
  const navigate = useNavigate();
  const {
    organization,
    applicants,
    openPositions,
    employees,
    departments,
    leaveRequests,
    holidays,
    onboardingDocuments,
    interviews,
    activities,
    showToast,
  } = useApp();

  // 1. Interactive States
  const [dateFilter, setDateFilter] = useState('all'); // 'today' | 'week' | 'month' | 'all'
  const [selectedFunnelStage, setSelectedFunnelStage] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // 2. Dynamic Date Filtering Engine
  const filterByDate = (items, dateField, period) => {
    if (period === 'all') return items;
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    return items.filter((item) => {
      const dateVal = item[dateField];
      if (!dateVal) return true;
      const d = new Date(dateVal);
      if (isNaN(d.getTime())) return true;
      if (period === 'today') return d >= startOfToday;
      if (period === 'week') return d >= startOfWeek;
      if (period === 'month') return d >= startOfMonth;
      return true;
    });
  };

  const filteredEmployees = useMemo(
    () => filterByDate(employees, 'joiningDate', dateFilter),
    [employees, dateFilter]
  );

  const filteredPositions = useMemo(
    () => filterByDate(openPositions, 'postedDate', dateFilter).filter((p) => p.status === 'Published'),
    [openPositions, dateFilter]
  );

  const filteredApplicants = useMemo(
    () => filterByDate(applicants, 'appliedDate', dateFilter),
    [applicants, dateFilter]
  );

  const filteredLeaves = useMemo(
    () => filterByDate(leaveRequests, 'startDate', dateFilter),
    [leaveRequests, dateFilter]
  );

  const filteredInterviews = useMemo(
    () => filterByDate(interviews, 'interviewDate', dateFilter),
    [interviews, dateFilter]
  );

  // Pending counts
  const pendingLeaves = filteredLeaves.filter((l) => l.status === 'Pending');
  const underReviewApps = filteredApplicants.filter((a) => a.status === 'Under Review' || a.status === 'Applied');
  const pendingInterviews = filteredInterviews.filter((i) => i.result === 'Scheduled');
  const pendingDocs = onboardingDocuments.filter((d) => d.verificationStatus === 'Pending');
  const pendingOnboardingStaff = filteredEmployees.filter((e) => (e.onboardingProgress || 0) < 100);

  const totalPendingCount =
    pendingLeaves.length +
    underReviewApps.length +
    pendingInterviews.length +
    pendingDocs.length +
    pendingOnboardingStaff.length;

  // 3. Funnel Stages Definition
  const funnelStages = [
    {
      id: 'Applied',
      label: 'Applied',
      queryStatus: 'Applied',
      count: filteredApplicants.filter((a) => a.status === 'Applied').length,
      color: 'bg-blue-500',
      textColor: 'text-blue-700',
      badgeBg: 'bg-blue-50 text-blue-700 border-blue-200/60',
      description: 'New submissions awaiting initial check',
    },
    {
      id: 'Screening',
      label: 'Screening',
      queryStatus: 'Under Review',
      count: filteredApplicants.filter((a) => a.status === 'Under Review').length,
      color: 'bg-amber-500',
      textColor: 'text-amber-700',
      badgeBg: 'bg-amber-50 text-amber-700 border-amber-200/60',
      description: 'Profile evaluation & recruiter review',
    },
    {
      id: 'Shortlisted',
      label: 'Shortlisted',
      queryStatus: 'Shortlisted',
      count: filteredApplicants.filter((a) => a.status === 'Shortlisted').length,
      color: 'bg-indigo-500',
      textColor: 'text-indigo-700',
      badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200/60',
      description: 'Shortlisted for panel interviews',
    },
    {
      id: 'Interview',
      label: 'Interview',
      queryStatus: 'Interview Scheduled',
      count: filteredApplicants.filter((a) => a.status === 'Interview Scheduled').length,
      color: 'bg-purple-500',
      textColor: 'text-purple-700',
      badgeBg: 'bg-purple-50 text-purple-700 border-purple-200/60',
      description: 'Technical & culture round assessments',
    },
    {
      id: 'Selected',
      label: 'Selected',
      queryStatus: 'Selected',
      count: filteredApplicants.filter((a) => a.status === 'Selected').length,
      color: 'bg-emerald-500',
      textColor: 'text-emerald-700',
      badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
      description: 'Candidates approved for formal offer',
    },
    {
      id: 'Rejected',
      label: 'Rejected',
      queryStatus: 'Rejected',
      count: filteredApplicants.filter((a) => a.status === 'Rejected').length,
      color: 'bg-rose-500',
      textColor: 'text-rose-700',
      badgeBg: 'bg-rose-50 text-rose-700 border-rose-200/60',
      description: 'Archived for future considerations',
    },
  ];

  // 4. Pending Actions Definition
  const pendingActionItems = [
    {
      title: 'Leave Approvals',
      subtitle: `${pendingLeaves.length} leave request${pendingLeaves.length === 1 ? '' : 's'} pending HR review`,
      count: pendingLeaves.length,
      priority: pendingLeaves.length > 0 ? 'High' : 'Normal',
      priorityColor: pendingLeaves.length > 0 ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-500',
      icon: CalendarDays,
      iconColor: 'text-amber-600',
      iconBg: 'bg-amber-50',
      path: '/hr/leaves',
    },
    {
      title: 'Candidate Reviews',
      subtitle: `${underReviewApps.length} candidate${underReviewApps.length === 1 ? '' : 's'} waiting for screening`,
      count: underReviewApps.length,
      priority: underReviewApps.length > 0 ? 'High' : 'Normal',
      priorityColor: underReviewApps.length > 0 ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-500',
      icon: Users,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-50',
      path: '/hr/applicants?status=Under Review',
    },
    {
      title: 'Interview Evaluations',
      subtitle: `${pendingInterviews.length} candidate interview${pendingInterviews.length === 1 ? '' : 's'} scheduled`,
      count: pendingInterviews.length,
      priority: pendingInterviews.length > 0 ? 'Medium' : 'Normal',
      priorityColor: pendingInterviews.length > 0 ? 'bg-purple-100 text-purple-800' : 'bg-slate-100 text-slate-500',
      icon: Clock,
      iconColor: 'text-purple-600',
      iconBg: 'bg-purple-50',
      path: '/hr/interviews',
    },
    {
      title: 'Employee Document Verification',
      subtitle: `${pendingDocs.length} compliance document${pendingDocs.length === 1 ? '' : 's'} to verify`,
      count: pendingDocs.length,
      priority: pendingDocs.length > 0 ? 'Medium' : 'Normal',
      priorityColor: pendingDocs.length > 0 ? 'bg-indigo-100 text-indigo-800' : 'bg-slate-100 text-slate-500',
      icon: FileCheck,
      iconColor: 'text-indigo-600',
      iconBg: 'bg-indigo-50',
      path: '/hr/onboarding',
    },
    {
      title: 'Onboarding Tasks',
      subtitle: `${pendingOnboardingStaff.length} new hire${pendingOnboardingStaff.length === 1 ? '' : 's'} in progress`,
      count: pendingOnboardingStaff.length,
      priority: pendingOnboardingStaff.length > 0 ? 'Routine' : 'Normal',
      priorityColor: pendingOnboardingStaff.length > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500',
      icon: ShieldCheck,
      iconColor: 'text-emerald-600',
      iconBg: 'bg-emerald-50',
      path: '/hr/onboarding',
    },
  ];

  // Refresh handler
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      showToast('Dashboard Synchronized', 'All workforce statistics refreshed.', 'success');
    }, 500);
  };

  const getActivityIcon = (iconName) => {
    switch (iconName) {
      case 'Briefcase':
        return <Briefcase className="h-3.5 w-3.5 text-purple-600" />;
      case 'Users':
        return <Users className="h-3.5 w-3.5 text-blue-600" />;
      case 'Calendar':
        return <Calendar className="h-3.5 w-3.5 text-indigo-600" />;
      case 'CheckCircle':
        return <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />;
      case 'XCircle':
        return <XCircle className="h-3.5 w-3.5 text-rose-600" />;
      case 'Clock':
        return <Clock className="h-3.5 w-3.5 text-amber-600" />;
      default:
        return <Sparkles className="h-3.5 w-3.5 text-purple-600" />;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* =========================================================================
          1. DASHBOARD HEADER
      ========================================================================= */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-5 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              HR Executive Overview
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 border border-purple-200/70 text-purple-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>{organization?.tenantId || 'TENANT-ST-2026-X'}</span>
              <span className="text-[10px] text-purple-400 font-normal">• Active</span>
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Workforce Operations & Recruitment Intelligence
          </p>
        </div>

        {/* Right Header Actions: Date Filter, Refresh, Create Position */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Dynamic Date Filter */}
          <div className="inline-flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200/70 shadow-2xs">
            {[
              { id: 'today', label: 'Today' },
              { id: 'week', label: 'This Week' },
              { id: 'month', label: 'This Month' },
              { id: 'all', label: 'All Time' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setDateFilter(tab.id)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${dateFilter === tab.id
                    ? 'bg-white text-purple-400 shadow-2xs font-bold'
                    : 'text-slate-500 hover:text-slate-900'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Refresh Button */}
          <button
            type="button"
            onClick={handleRefresh}
            title="Refresh dashboard statistics"
            className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 shadow-2xs transition-all active:scale-95 cursor-pointer"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin text-purple-600' : ''}`} />
          </button>

          {/* Create Position Button */}
          <button
            type="button"
            onClick={() => navigate('/hr/positions?create=true')}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 active:bg-slate-950 rounded-xl shadow-xs hover:shadow transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Create Position</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          2. FOUR PRIMARY KPI STATS (SummaryCards)
      ========================================================================= */}
      <SummaryCards
        dateFilter={dateFilter}
        isLoading={isRefreshing}
        customStats={{
          totalEmployees: filteredEmployees.length,
          openPositions: filteredPositions.length,
          totalApplications: filteredApplicants.length,
          pendingApprovals: totalPendingCount,
        }}
      />

      {/* =========================================================================
          3. RECRUITMENT FUNNEL & PENDING HR ACTIONS (2-Column Grid)
      ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recruitment Funnel Section (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-colors">
          <div>
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-purple-50 text-purple-600">
                  <Layers className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-slate-900">Recruitment Funnel</h2>
                  <p className="text-[11px] text-slate-500">Pipeline stages with dynamic candidate count</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate('/hr/applicants')}
                className="group inline-flex items-center gap-1 text-xs font-semibold text-purple-600 hover:text-purple-700 cursor-pointer"
              >
                <span>View Full Pipeline</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            {/* Compact Funnel Stage Grid (Clickable) */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-4">
              {funnelStages.map((stage) => {
                const isSelected = selectedFunnelStage === stage.id;
                return (
                  <button
                    key={stage.id}
                    type="button"
                    onClick={() => navigate(`/hr/applicants?status=${encodeURIComponent(stage.queryStatus)}`)}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer group ${isSelected
                        ? 'border-purple-600 bg-purple-50/60 ring-2 ring-purple-500/20 shadow-2xs'
                        : 'border-slate-100 bg-slate-50/60 hover:bg-slate-100/80 hover:border-slate-200 hover:-translate-y-0.5'
                      }`}
                    title={`Filter applicants in ${stage.label}`}
                  >
                    <span className="block text-[11px] font-medium text-slate-500 group-hover:text-slate-800 truncate">
                      {stage.label}
                    </span>
                    <span className="block text-base font-extrabold text-slate-900 mt-0.5 group-hover:text-purple-600 transition-colors">
                      {stage.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Funnel Progress Visualization or Clean Empty State */}
            {filteredApplicants.length === 0 ? (
              <div className="py-8 px-4 text-center rounded-xl bg-slate-50/50 border border-dashed border-slate-200">
                <div className="h-10 w-10 rounded-xl bg-purple-100/70 text-purple-600 flex items-center justify-center mx-auto mb-2">
                  <Inbox className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-slate-800 text-xs sm:text-sm">
                  No active applications recorded
                </h3>
                <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
                  When job positions are published, candidate applications will populate and advance here.
                </p>
                <div className="mt-3">
                  <button
                    type="button"
                    onClick={() => navigate('/hr/positions?create=true')}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-2xs cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Create Position</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3 pt-1">
                {funnelStages.map((stage) => {
                  const percentage = Math.round((stage.count / filteredApplicants.length) * 100);
                  return (
                    <div
                      key={stage.id}
                      onClick={() => navigate(`/hr/applicants?status=${encodeURIComponent(stage.queryStatus)}`)}
                      className="group cursor-pointer p-2 rounded-lg hover:bg-slate-50/80 transition-colors"
                    >
                      <div className="flex items-center justify-between text-xs font-medium mb-1">
                        <span className="text-slate-700 font-semibold group-hover:text-purple-600 transition-colors">
                          {stage.label}
                        </span>
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

        {/* Pending HR Actions Section (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-colors">
          <div>
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                  <Clock className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-slate-900">Pending HR Actions</h2>
                  <p className="text-[11px] text-slate-500">Tasks requiring administrative attention</p>
                </div>
              </div>

              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${totalPendingCount === 0
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}>
                {totalPendingCount} Pending
              </span>
            </div>

            {/* Clean empty state when all are 0 */}
            {totalPendingCount === 0 ? (
              <div className="py-6 px-4 text-center rounded-xl bg-emerald-50/40 border border-dashed border-emerald-200/80 mb-3">
                <div className="h-8 w-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-1.5 shadow-2xs">
                  <ShieldCheck className="h-4.5 w-4.5" />
                </div>
                <p className="font-bold text-emerald-950 text-xs">
                  All Clear! No Pending Actions 🎉
                </p>
                <p className="text-[11px] text-emerald-700/80 mt-0.5">
                  Leave requests, application reviews, and document audits are up-to-date.
                </p>
              </div>
            ) : null}

            {/* 5 Compact Pending Action Items */}
            <div className="space-y-2">
              {pendingActionItems.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    onClick={() => navigate(item.path)}
                    className="p-3 rounded-xl border border-slate-100 hover:border-slate-300 hover:bg-slate-50/70 hover:shadow-2xs transition-all cursor-pointer flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${item.iconBg} ${item.iconColor} group-hover:scale-105 transition-transform`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800 group-hover:text-purple-600 transition-colors">
                          {item.title}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {item.subtitle}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.priorityColor}`}>
                        {item.count}
                      </span>
                      <ChevronRight className="h-3.5 w-3.5 text-slate-300 group-hover:text-purple-600 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          4. ADDITIONAL DASHBOARD SECTIONS (Recent Activities & Recruitment Overview)
      ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-1">
        {/* Left: Recent Activities */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 mb-4">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900">Recent Activities</h2>
              <p className="text-[11px] text-slate-500">Audit trail of recruitment and HR actions</p>
            </div>
            <span className="text-xs font-semibold text-slate-400">
              Live Feed
            </span>
          </div>

          {activities.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              <Clock className="h-7 w-7 mx-auto text-slate-300 mb-2" />
              <p className="font-semibold text-slate-600">No activity recorded yet</p>
              <p className="mt-1 text-slate-400 max-w-xs mx-auto">
                Actions like posting positions, screening applicants, and approving leaves will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {activities.slice(0, 5).map((act) => (
                <div
                  key={act.id}
                  className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  <div className="p-1.5 rounded-lg bg-slate-100 mt-0.5 shrink-0">
                    {getActivityIcon(act.icon)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-800">{act.user}</p>
                    <p className="text-xs text-slate-600 mt-0.5 leading-snug">{act.action}</p>
                    <span className="text-[10px] text-slate-400 mt-1 block">{act.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Recruitment & Workforce Overview */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 mb-4">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900">Department Headcount</h2>
              <p className="text-[11px] text-slate-500">Personnel distribution across active departments</p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/hr/employees')}
              className="group text-xs font-semibold text-purple-600 hover:text-purple-700 flex items-center gap-1 cursor-pointer"
            >
              <span>Directory</span>
              <ArrowUpRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Department Breakdown Bars */}
          <div className="space-y-3.5 pt-1">
            {departments.slice(0, 5).map((dept) => {
              const deptEmpCount = employees.filter((e) => e.department === dept.name).length;
              const deptPercentage = employees.length > 0 ? Math.round((deptEmpCount / employees.length) * 100) : 0;

              return (
                <div key={dept.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                      <Building className="h-3 w-3 text-slate-400" />
                      <span>{dept.name}</span>
                    </span>
                    <span className="text-slate-500 font-medium">
                      {deptEmpCount} {deptEmpCount === 1 ? 'member' : 'members'} ({deptPercentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-2 rounded-full bg-purple-600 transition-all duration-300"
                      style={{ width: `${Math.max(deptPercentage, deptEmpCount > 0 ? 5 : 0)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
