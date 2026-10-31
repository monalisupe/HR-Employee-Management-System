import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Building,
  Calendar,
  Briefcase,
  Eye,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import StatusBadge from '../../components/common/StatusBadge';
import EmptyState from '../../components/common/EmptyState';

export default function CandidateApplications() {
  const navigate = useNavigate();
  const { applicants, currentCandidate, openPositions } = useApp();

  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedApp, setSelectedApp] = useState(null);

  // Candidate applications
  const myApplications = applicants.filter(
    (a) => a.candidateId === currentCandidate?.id
  );

  const filteredApps = myApplications.filter((app) => {
    return selectedStatus === 'All' || app.status === selectedStatus;
  });

  const statuses = ['All', 'Applied', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Selected', 'Rejected'];

  const getStageIndex = (status) => {
    switch (status) {
      case 'Applied': return 0;
      case 'Under Review': return 1;
      case 'Shortlisted': return 2;
      case 'Interview Scheduled': return 3;
      case 'Selected': return 4;
      case 'Rejected': return -1;
      default: return 0;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              My Job Applications
            </h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-violet-100 text-violet-800">
              {myApplications.length} Submissions
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            Review live recruitment status updates, interview progressions, and HR feedback.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/candidate/jobs')}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-violet-600 hover:bg-violet-700 rounded-xl shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Briefcase className="h-4 w-4" />
          <span>Browse More Jobs</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {statuses.map((st) => {
          const count = st === 'All'
            ? myApplications.length
            : myApplications.filter((a) => a.status === st).length;
          return (
            <button
              key={st}
              type="button"
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-colors cursor-pointer ${
                selectedStatus === st
                  ? 'bg-violet-600 text-white shadow-2xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {st} ({count})
            </button>
          );
        })}
      </div>

      {/* Applications List */}
      {filteredApps.length === 0 ? (
        <EmptyState
          icon={FileText}
          title={myApplications.length === 0 ? 'No Applications Submitted' : 'No matching applications'}
          description={
            myApplications.length === 0
              ? 'You have not submitted any job applications yet. Browse published positions to get started!'
              : 'Try clearing your status filter.'
          }
          actionLabel={myApplications.length === 0 ? 'Browse Open Positions' : 'Show All'}
          onAction={
            myApplications.length === 0
              ? () => navigate('/candidate/jobs')
              : () => setSelectedStatus('All')
          }
        />
      ) : (
        <div className="space-y-4">
          {filteredApps.map((app) => {
            const currentStageIdx = getStageIndex(app.status);
            const isRejected = app.status === 'Rejected';

            return (
              <div
                key={app.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs hover:shadow-xs transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 pb-3 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base text-slate-900">{app.jobTitle}</h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-violet-50 text-violet-700">
                        {app.department}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-3">
                      <span>Applied on {app.appliedDate}</span>
                      <span>•</span>
                      <span>Recruiter: {app.recruiter}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <StatusBadge status={app.status} size="md" />
                    <button
                      type="button"
                      onClick={() => setSelectedApp(app)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer"
                      title="View Submission Details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Recruitment Progression Timeline */}
                <div className="mt-4 pt-1">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Recruitment Funnel Timeline
                  </p>

                  {isRejected ? (
                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-rose-600 shrink-0" />
                      <span>Application status marked as Rejected. Other applications remain active.</span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-5 gap-2">
                      {['Applied', 'Review', 'Shortlist', 'Interview', 'Selected'].map((step, idx) => {
                        const isDone = currentStageIdx >= idx;
                        const isCurrent = currentStageIdx === idx;
                        return (
                          <div key={step} className="text-center">
                            <div
                              className={`h-2 rounded-full mb-1.5 transition-all ${
                                isDone ? 'bg-violet-600' : 'bg-slate-100'
                              }`}
                            />
                            <span
                              className={`text-[10px] block leading-tight font-semibold ${
                                isCurrent
                                  ? 'text-violet-700 font-bold'
                                  : isDone
                                  ? 'text-slate-800'
                                  : 'text-slate-400'
                              }`}
                            >
                              {step}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Notes or interview action */}
                {app.status === 'Interview Scheduled' && (
                  <div className="mt-4 p-3 bg-purple-50/70 border border-purple-100 rounded-xl flex items-center justify-between text-xs">
                    <span className="font-semibold text-purple-900">
                      An interview has been scheduled for this role!
                    </span>
                    <button
                      type="button"
                      onClick={() => navigate('/candidate/interviews')}
                      className="px-2.5 py-1 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-lg cursor-pointer"
                    >
                      View Interview Details
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Application Details Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">{selectedApp.jobTitle}</h3>
                <p className="text-xs text-slate-500">
                  {selectedApp.department} • Applied {selectedApp.appliedDate}
                </p>
              </div>
              <StatusBadge status={selectedApp.status} />
            </div>

            <div className="mt-4 space-y-3.5 text-xs text-slate-600">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <p><strong>Candidate:</strong> {selectedApp.candidateName}</p>
                <p><strong>Email:</strong> {selectedApp.candidateEmail}</p>
                <p><strong>Phone:</strong> {selectedApp.candidatePhone}</p>
                <p><strong>Location:</strong> {selectedApp.candidateLocation}</p>
              </div>

              <div>
                <span className="font-bold text-slate-800 uppercase text-[10px] block mb-1">Education</span>
                <p className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-slate-800">
                  {selectedApp.education}
                </p>
              </div>

              <div>
                <span className="font-bold text-slate-800 uppercase text-[10px] block mb-1">Skills</span>
                <div className="flex flex-wrap gap-1">
                  {selectedApp.skills?.map((s, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-violet-50 text-violet-700 rounded text-xs">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {selectedApp.coverNote && (
                <div>
                  <span className="font-bold text-slate-800 uppercase text-[10px] block mb-1">Cover Note</span>
                  <p className="p-2.5 bg-violet-50/50 rounded-xl border border-violet-100 text-slate-700 italic">
                    "{selectedApp.coverNote}"
                  </p>
                </div>
              )}
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedApp(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

