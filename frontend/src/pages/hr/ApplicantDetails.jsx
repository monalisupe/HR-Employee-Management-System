import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  FileText,
  UserCheck,
  CheckCircle,
  XCircle,
  Clock,
  Building,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import StatusBadge from '../../components/common/StatusBadge';
import ConfirmDialog from '../../components/common/ConfirmDialog';

export default function ApplicantDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    applicants,
    updateApplicationStatus,
    onboardCandidateAsEmployee,
  } = useApp();

  const [rejectDialog, setRejectDialog] = useState(false);
  const [onboardDialog, setOnboardDialog] = useState(false);

  const applicant = applicants.find((a) => a.id === id);

  if (!applicant) {
    return (
      <div className="p-8 sm:p-12 text-center bg-white rounded-3xl border border-slate-200/80 shadow-2xs max-w-lg mx-auto my-12">
        <div className="h-14 w-14 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto mb-4">
          <FileText className="h-7 w-7" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Applicant Not Found</h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed">
          The requested candidate application record does not exist or was removed from current session state.
        </p>
        <button
          onClick={() => navigate('/hr/applicants')}
          className="mt-6 px-5 py-2.5 text-xs font-bold text-white bg-violet-600 hover:bg-violet-700 rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          Back to Applicants Directory
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back button & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/hr/applicants')}
            className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            title="Back to Applicants list"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Candidate Application
              </h1>
              <span className="font-mono text-xs px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600 font-semibold">
                {applicant.id}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Submitted on {applicant.appliedDate} • Assigned to {applicant.recruiter}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <StatusBadge status={applicant.status} size="md" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Applicant Dossier */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-2xs">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-slate-100">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white font-bold flex items-center justify-center text-2xl shadow-sm shadow-violet-500/20 shrink-0">
                  {applicant.candidateName.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">{applicant.candidateName}</h2>
                  <p className="text-xs sm:text-sm text-slate-500 flex items-center gap-2 mt-1">
                    <Briefcase className="h-4 w-4 text-violet-500" />
                    <span className="font-medium text-slate-700">{applicant.jobTitle}</span>
                    <span>•</span>
                    <span className="text-slate-500">{applicant.department}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Info Grid */}
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase block tracking-wider">Email</span>
                <span className="font-semibold text-slate-800 flex items-center gap-1.5 mt-1 truncate">
                  <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <a href={`mailto:${applicant.candidateEmail}`} className="hover:text-violet-600 truncate">
                    {applicant.candidateEmail}
                  </a>
                </span>
              </div>
              <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase block tracking-wider">Phone</span>
                <span className="font-semibold text-slate-800 flex items-center gap-1.5 mt-1">
                  <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  {applicant.candidatePhone || 'Not provided'}
                </span>
              </div>
              <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase block tracking-wider">Location</span>
                <span className="font-semibold text-slate-800 flex items-center gap-1.5 mt-1">
                  <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  {applicant.candidateLocation || 'Remote'}
                </span>
              </div>
            </div>

            {/* Education & Experience */}
            <div className="mt-6 space-y-5">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                  <GraduationCap className="h-4 w-4 text-violet-500" />
                  Education & Qualifications
                </h3>
                <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-100 text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {applicant.education || 'Bachelor Degree in Computer Science or related degree.'}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                  <Briefcase className="h-4 w-4 text-violet-500" />
                  Professional Experience
                </h3>
                <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-100 text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {applicant.experience || 'Demonstrated multi-year domain experience in enterprise software settings.'}
                </div>
              </div>

              {applicant.skills && applicant.skills.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-violet-500" />
                    Skills & Technologies
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {applicant.skills.map((skill, idx) => (
                      <span key={idx} className="px-3 py-1 bg-violet-50 text-violet-700 border border-violet-100/80 rounded-xl text-xs font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {applicant.coverNote && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                    <FileText className="h-4 w-4 text-violet-500" />
                    Candidate Cover Note
                  </h3>
                  <div className="p-4 bg-violet-50/40 rounded-2xl border border-violet-100 text-xs sm:text-sm text-slate-700 italic leading-relaxed">
                    "{applicant.coverNote}"
                  </div>
                </div>
              )}

              {/* Resume File Attachment */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Uploaded Document
                </h3>
                <div className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-200/80 bg-slate-50">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-violet-100 text-violet-700">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 text-xs">
                        {applicant.resumeName || 'Applicant_Resume.pdf'}
                      </p>
                      <p className="text-[11px] text-slate-500">Candidate Submission • PDF Document</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700">
                    Ready for Review
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar: Status & Actions */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
              Recruitment Decisions
            </h3>

            <div className="space-y-2.5">
              {applicant.status !== 'Shortlisted' && applicant.status !== 'Selected' && applicant.status !== 'Rejected' && (
                <button
                  type="button"
                  onClick={() => updateApplicationStatus(applicant.id, 'Shortlisted')}
                  className="w-full py-2.5 px-4 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-xs cursor-pointer text-center"
                >
                  Shortlist Candidate
                </button>
              )}

              {applicant.status !== 'Selected' && (
                <button
                  type="button"
                  onClick={() => updateApplicationStatus(applicant.id, 'Selected')}
                  className="w-full py-2.5 px-4 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all shadow-xs cursor-pointer text-center"
                >
                  Mark as Selected
                </button>
              )}

              {applicant.status === 'Selected' && (
                <button
                  type="button"
                  onClick={() => setOnboardDialog(true)}
                  className="w-full py-3 px-4 text-xs font-bold text-white bg-violet-600 hover:bg-violet-700 rounded-xl shadow-md shadow-violet-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <UserCheck className="h-4 w-4" />
                  Onboard as Employee
                </button>
              )}

              {applicant.status !== 'Rejected' && (
                <button
                  type="button"
                  onClick={() => setRejectDialog(true)}
                  className="w-full py-2.5 px-4 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors cursor-pointer text-center"
                >
                  Reject Application
                </button>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 text-xs text-slate-500 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium text-slate-600">Assigned Recruiter</span>
                <span className="font-semibold text-slate-900">{applicant.recruiter}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium text-slate-600">Current Stage</span>
                <span className="font-semibold text-violet-700">{applicant.status}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={rejectDialog}
        variant="danger"
        title="Reject Application"
        message={`Are you sure you want to mark ${applicant.candidateName}'s application for ${applicant.jobTitle} as Rejected? Note: Rejecting this application does not delete the candidate's account or profile.`}
        confirmText="Confirm Rejection"
        onConfirm={() => {
          updateApplicationStatus(applicant.id, 'Rejected');
          setRejectDialog(false);
        }}
        onClose={() => setRejectDialog(false)}
      />

      <ConfirmDialog
        isOpen={onboardDialog}
        variant="primary"
        title="Start Employee Onboarding"
        message={`Convert ${applicant.candidateName} to an active employee record and generate their onboarding checklist?`}
        confirmText="Start Onboarding"
        onConfirm={() => {
          onboardCandidateAsEmployee(applicant.id);
          setOnboardDialog(false);
          navigate('/hr/employees');
        }}
        onClose={() => setOnboardDialog(false)}
      />
    </div>
  );
}
