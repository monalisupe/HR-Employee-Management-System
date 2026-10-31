import React from 'react';
import {
  Clock,
  Calendar,
  Video,
  User,
  ExternalLink,
  Briefcase,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import StatusBadge from '../../components/common/StatusBadge';
import EmptyState from '../../components/common/EmptyState';

export default function CandidateInterviews() {
  const { interviews, currentCandidate } = useApp();

  const myInterviews = interviews.filter(
    (i) => i.candidateEmail === currentCandidate?.email
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              My Scheduled Interviews
            </h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-violet-100 text-violet-800">
              {myInterviews.length} Total
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            Details, conference links, and stages for your upcoming interviews.
          </p>
        </div>
      </div>

      {/* Interviews list */}
      {myInterviews.length === 0 ? (
        <EmptyState
          icon={Clock}
          title="No Scheduled Interviews"
          description="You currently have zero scheduled interviews. When an HR recruiter shortlists your application and books a screening session, it will show up here."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {myInterviews.map((int) => (
            <div
              key={int.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between pb-3 border-b border-slate-100 mb-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-1 rounded-md">
                      {int.stage}
                    </span>
                    <h3 className="font-bold text-base text-slate-900 mt-2">
                      {int.jobTitle}
                    </h3>
                    <p className="text-xs text-slate-500">{int.department} Department</p>
                  </div>
                  <StatusBadge status={int.result} />
                </div>

                <div className="space-y-2.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-violet-600" />
                    <span className="font-semibold text-slate-800">{int.interviewDate}</span>
                    <span>at</span>
                    <span className="font-semibold text-slate-800">{int.interviewTime}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-slate-400" />
                    <span>Panel / Recruiter: <strong>{int.interviewer}</strong></span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Video className="h-4 w-4 text-slate-400" />
                    <span>Format: <strong>{int.format || 'Video Call'}</strong></span>
                  </div>

                  {int.feedback && (
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700 mt-2">
                      <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Recruiter Notes</span>
                      {int.feedback}
                    </div>
                  )}
                </div>
              </div>

              {int.meetingLink && int.result === 'Scheduled' && (
                <div className="mt-5 pt-3 border-t border-slate-100">
                  <a
                    href={int.meetingLink}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold text-white bg-violet-600 hover:bg-violet-700 rounded-xl shadow-xs transition-colors"
                  >
                    <Video className="h-3.5 w-3.5" />
                    <span>Join Online Meeting Room</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

