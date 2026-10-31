import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase,
  FileText,
  Clock,
  UserCheck,
  UserX,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import StatusBadge from '../../components/common/StatusBadge';
import EmptyState from '../../components/common/EmptyState';

export default function CandidateDashboard() {
  const navigate = useNavigate();
  const {
    currentCandidate,
    applicants,
    openPositions,
    interviews,
  } = useApp();

  // Filter applications for current candidate
  const myApplications = applicants.filter(
    (a) => a.candidateId === currentCandidate?.id
  );

  const totalApplied = myApplications.length;
  const shortlistedCount = myApplications.filter((a) => a.status === 'Shortlisted').length;
  const interviewScheduledCount = myApplications.filter((a) => a.status === 'Interview Scheduled').length;
  const selectedCount = myApplications.filter((a) => a.status === 'Selected').length;
  const rejectedCount = myApplications.filter((a) => a.status === 'Rejected').length;

  // Filter published positions
  const publishedPositions = openPositions.filter((p) => p.status === 'Published');

  // Candidate upcoming interviews
  const myInterviews = interviews.filter(
    (i) => i.candidateEmail === currentCandidate?.email && i.result === 'Scheduled'
  );

  const stats = [
    { title: 'Total Applications', count: totalApplied, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-100' },
    { title: 'Shortlisted', count: shortlistedCount, icon: CheckCircle, color: 'text-indigo-600', bg: 'bg-indigo-50 border-indigo-100' },
    { title: 'Interviews Scheduled', count: interviewScheduledCount, icon: Clock, color: 'text-purple-600', bg: 'bg-purple-50 border-purple-100' },
    { title: 'Offers / Selected', count: selectedCount, icon: UserCheck, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-100' },
    { title: 'Rejected', count: rejectedCount, icon: UserX, color: 'text-rose-600', bg: 'bg-rose-50 border-rose-100' },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-violet-600 to-purple-700 rounded-2xl p-6 text-white shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-violet-200">
              Candidate Workspace
            </span>
            <h1 className="text-2xl font-bold mt-1 tracking-tight">
              Welcome back, {currentCandidate?.name || 'Applicant'}!
            </h1>
            <p className="text-xs sm:text-sm text-violet-100 mt-1 max-w-xl">
              Track your job applications in real-time, view upcoming interview invitations, and explore open roles.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate('/candidate/jobs')}
            className="self-start sm:self-auto px-4 py-2.5 bg-white text-violet-700 hover:bg-violet-50 text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-2"
          >
            <Briefcase className="h-4 w-4" />
            <span>Browse Available Jobs ({publishedPositions.length})</span>
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-500 uppercase">{s.title}</span>
                <div className={`p-2 rounded-xl border ${s.bg} ${s.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900 mt-3">{s.count}</p>
            </div>
          );
        })}
      </div>

      {/* Upcoming Interviews Alert */}
      {myInterviews.length > 0 && (
        <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-600 text-white font-bold">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-purple-950">You have an upcoming interview scheduled!</p>
              <p className="text-xs text-purple-700">
                {myInterviews[0].stage} for {myInterviews[0].jobTitle} on {myInterviews[0].interviewDate} at {myInterviews[0].interviewTime}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate('/candidate/interviews')}
            className="px-3 py-1.5 text-xs font-semibold bg-purple-600 text-white hover:bg-purple-700 rounded-xl transition-colors cursor-pointer shrink-0"
          >
            View Meeting Link
          </button>
        </div>
      )}

      {/* Grid: My Recent Applications & Featured Jobs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Applications */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">My Applications</h3>
              <p className="text-xs text-slate-500">Live recruitment statuses from HR</p>
            </div>
            <button
              onClick={() => navigate('/candidate/applications')}
              className="text-xs font-semibold text-violet-600 hover:text-violet-700 flex items-center gap-1"
            >
              View All ({myApplications.length})
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {myApplications.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              <FileText className="h-8 w-8 mx-auto text-slate-300 mb-2" />
              <p className="font-semibold text-slate-600">You haven't submitted any applications yet</p>
              <p className="mt-1 text-slate-400">
                Browse open positions and submit your application with one click.
              </p>
              <button
                type="button"
                onClick={() => navigate('/candidate/jobs')}
                className="mt-3 px-3 py-1.5 text-xs font-semibold text-white bg-violet-600 hover:bg-violet-700 rounded-xl"
              >
                Browse Open Roles
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {myApplications.map((app) => (
                <div
                  key={app.id}
                  className="p-3.5 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors flex items-center justify-between"
                >
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{app.jobTitle}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {app.department} • Applied {app.appliedDate}
                    </p>
                  </div>
                  <StatusBadge status={app.status} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Featured Open Positions */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Published Job Openings</h3>
              <p className="text-xs text-slate-500">Open positions currently hiring</p>
            </div>
            <button
              onClick={() => navigate('/candidate/jobs')}
              className="text-xs font-semibold text-violet-600 hover:text-violet-700 flex items-center gap-1"
            >
              Browse All ({publishedPositions.length})
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {publishedPositions.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              <Briefcase className="h-8 w-8 mx-auto text-slate-300 mb-2" />
              <p className="font-semibold text-slate-600">No published positions at this moment</p>
              <p className="mt-1 text-slate-400">
                Switch to HR role to create and publish job positions.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {publishedPositions.slice(0, 3).map((pos) => {
                const hasApplied = myApplications.some((a) => a.positionId === pos.id);
                return (
                  <div
                    key={pos.id}
                    className="p-3.5 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{pos.title}</h4>
                        <span className="text-[10px] font-semibold px-2 py-0.2 rounded-md bg-violet-50 text-violet-700">
                          {pos.department}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-2">
                        <span>{pos.location}</span>
                        <span>•</span>
                        <span>{pos.employmentType}</span>
                      </p>
                    </div>

                    {hasApplied ? (
                      <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                        Applied
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => navigate('/candidate/jobs')}
                        className="px-3 py-1.5 text-xs font-semibold text-white bg-violet-600 hover:bg-violet-700 rounded-xl"
                      >
                        View & Apply
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

