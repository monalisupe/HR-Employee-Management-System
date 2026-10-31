import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Calendar,
  UserCheck,
  FileText,
  Mail,
  Phone,
  Building,
  Briefcase,
  Sparkles,
  MapPin,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import SearchBar from '../../components/common/SearchBar';
import StatusBadge from '../../components/common/StatusBadge';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import EmptyState from '../../components/common/EmptyState';

export default function Applicants() {
  const navigate = useNavigate();
  const {
    applicants,
    openPositions,
    departments,
    recruiters,
    updateApplicationStatus,
    scheduleInterview,
    onboardCandidateAsEmployee,
    preloadDemoData,
  } = useApp();

  // Search & Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedPosition, setSelectedPosition] = useState('All');
  const [selectedRecruiter, setSelectedRecruiter] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Modals state
  const [selectedAppForDetails, setSelectedAppForDetails] = useState(null);
  const [rejectDialog, setRejectDialog] = useState({ isOpen: false, app: null });
  const [onboardDialog, setOnboardDialog] = useState({ isOpen: false, app: null });
  const [scheduleModal, setScheduleModal] = useState({ isOpen: false, app: null });

  // Interview scheduling form
  const [interviewForm, setInterviewForm] = useState({
    interviewDate: '',
    interviewTime: '14:00',
    interviewer: 'Sarah Jenkins',
    stage: 'Technical Round',
    format: 'Google Meet Video Call',
    meetingLink: 'https://meet.securetenant.dev/room-hr',
  });

  // Filter applicants
  const filteredApplicants = applicants.filter((app) => {
    const matchesSearch =
      app.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.candidateEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.skills && app.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())));

    const matchesDept = selectedDept === 'All' || app.department === selectedDept;
    const matchesPosition = selectedPosition === 'All' || app.jobTitle === selectedPosition;
    const matchesRecruiter = selectedRecruiter === 'All' || app.recruiter === selectedRecruiter;
    const matchesStatus = selectedStatus === 'All' || app.status === selectedStatus;

    return matchesSearch && matchesDept && matchesPosition && matchesRecruiter && matchesStatus;
  });

  // Unique positions in filter
  const uniquePositions = Array.from(new Set(openPositions.map((p) => p.title)));

  const handleOpenScheduleModal = (app) => {
    setInterviewForm({
      interviewDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      interviewTime: '14:00 (2:00 PM CST)',
      interviewer: app.recruiter || 'Sarah Jenkins',
      stage: 'Technical Round',
      format: 'Google Meet Video Call',
      meetingLink: 'https://meet.securetenant.dev/room-' + Math.floor(Math.random() * 1000),
    });
    setScheduleModal({ isOpen: true, app });
  };

  const handleConfirmSchedule = (e) => {
    e.preventDefault();
    if (!scheduleModal.app) return;

    scheduleInterview({
      applicationId: scheduleModal.app.id,
      candidateName: scheduleModal.app.candidateName,
      candidateEmail: scheduleModal.app.candidateEmail,
      jobTitle: scheduleModal.app.jobTitle,
      department: scheduleModal.app.department,
      interviewDate: interviewForm.interviewDate,
      interviewTime: interviewForm.interviewTime,
      interviewer: interviewForm.interviewer,
      stage: interviewForm.stage,
      format: interviewForm.format,
      meetingLink: interviewForm.meetingLink,
      feedback: 'Scheduled via HR Applicants Portal.',
    });

    setScheduleModal({ isOpen: false, app: null });
  };

  const handleConfirmReject = () => {
    if (!rejectDialog.app) return;
    updateApplicationStatus(
      rejectDialog.app.id,
      'Rejected',
      'Application does not match current profile specifications.'
    );
    setRejectDialog({ isOpen: false, app: null });
  };

  const handleConfirmOnboard = () => {
    if (!onboardDialog.app) return;
    onboardCandidateAsEmployee(onboardDialog.app.id, {
      joiningDate: new Date().toISOString().split('T')[0],
    });
    setOnboardDialog({ isOpen: false, app: null });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Recruitment & Applicants
            </h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-violet-100 text-violet-800">
              {applicants.length} Total
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            Review candidate resumes, shortlist, schedule interviews, and initiate onboarding.
          </p>
        </div>

        {applicants.length === 0 && (
          <button
            type="button"
            onClick={preloadDemoData}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-violet-700 bg-violet-50 hover:bg-violet-100 border border-violet-200 rounded-xl transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Sparkles className="h-4 w-4" />
            <span>Load Demo Applicant Scenario</span>
          </button>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
          <div className="sm:col-span-2 lg:col-span-4">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search candidate name, email, skills..."
            />
          </div>

          <div className="lg:col-span-2">
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full px-3 py-2 text-xs font-medium bg-white border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 transition-all"
            >
              <option value="All">All Departments</option>
              {departments.map((d) => (
                <option key={d.id} value={d.name}>{d.name}</option>
              ))}
            </select>
          </div>

          <div className="lg:col-span-2">
            <select
              value={selectedPosition}
              onChange={(e) => setSelectedPosition(e.target.value)}
              className="w-full px-3 py-2 text-xs font-medium bg-white border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 transition-all"
            >
              <option value="All">All Positions</option>
              {uniquePositions.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <div className="lg:col-span-2">
            <select
              value={selectedRecruiter}
              onChange={(e) => setSelectedRecruiter(e.target.value)}
              className="w-full px-3 py-2 text-xs font-medium bg-white border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 transition-all"
            >
              <option value="All">All Recruiters</option>
              {recruiters.map((r) => (
                <option key={r.id} value={r.name}>{r.name}</option>
              ))}
            </select>
          </div>

          <div className="lg:col-span-2">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 text-xs font-medium bg-white border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 transition-all"
            >
              <option value="All">All Statuses</option>
              <option value="Applied">Applied</option>
              <option value="Under Review">Under Review</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Interview Scheduled">Interview Scheduled</option>
              <option value="Selected">Selected</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Filter Pill counters */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs text-slate-500 overflow-x-auto pb-1">
          <span className="font-semibold text-slate-700 mr-1 shrink-0">Filter:</span>
          {['All', 'Applied', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Selected', 'Rejected'].map((status) => {
            const count = status === 'All'
              ? applicants.length
              : applicants.filter((a) => a.status === status).length;
            const isSelected = selectedStatus === status;
            return (
              <button
                key={status}
                type="button"
                onClick={() => setSelectedStatus(status)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-violet-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
                }`}
              >
                {status} <span className="opacity-75">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Applicants List / Table */}
      {filteredApplicants.length === 0 ? (
        <EmptyState
          icon={Users}
          title={applicants.length === 0 ? 'Zero Job Applicants' : 'No matching applicants found'}
          description={
            applicants.length === 0
              ? 'There are currently no job applications in the system. Switch to the Candidate role to browse published positions and submit an application.'
              : 'Try clearing your search query or loosening your filter criteria.'
          }
          actionLabel={applicants.length === 0 ? 'Go to Published Positions' : 'Clear Filters'}
          onAction={
            applicants.length === 0
              ? () => navigate('/hr/positions')
              : () => {
                  setSearchQuery('');
                  setSelectedDept('All');
                  setSelectedPosition('All');
                  setSelectedRecruiter('All');
                  setSelectedStatus('All');
                }
          }
        />
      ) : (
        <>
          {/* Mobile Card Deck View (< md) */}
          <div className="block md:hidden space-y-3">
            {filteredApplicants.map((app) => (
              <div
                key={app.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs space-y-3.5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-xl bg-violet-100 text-violet-700 font-bold flex items-center justify-center text-sm shrink-0">
                      {app.candidateName.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 leading-tight">
                        {app.candidateName}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">{app.candidateEmail}</p>
                    </div>
                  </div>
                  <StatusBadge status={app.status} size="sm" />
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Position</span>
                    <span className="font-semibold text-slate-800">{app.jobTitle}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Department</span>
                    <span className="font-medium text-slate-700">{app.department}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Applied Date</span>
                    <span className="font-medium text-slate-600">{app.appliedDate}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Recruiter</span>
                    <span className="font-medium text-slate-600">{app.recruiter}</span>
                  </div>
                </div>

                {/* Mobile Action Buttons */}
                <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedAppForDetails(app)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>View Details</span>
                  </button>

                  <div className="flex items-center gap-1.5 ml-auto">
                    {app.status === 'Applied' && (
                      <button
                        type="button"
                        onClick={() => updateApplicationStatus(app.id, 'Under Review')}
                        className="px-2.5 py-1.5 text-xs font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors cursor-pointer"
                      >
                        Under Review
                      </button>
                    )}

                    {(app.status === 'Applied' || app.status === 'Under Review') && (
                      <button
                        type="button"
                        onClick={() => updateApplicationStatus(app.id, 'Shortlisted')}
                        className="px-2.5 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors cursor-pointer"
                      >
                        Shortlist
                      </button>
                    )}

                    {app.status === 'Shortlisted' && (
                      <button
                        type="button"
                        onClick={() => handleOpenScheduleModal(app)}
                        className="px-3 py-1.5 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <Calendar className="h-3 w-3" />
                        Schedule
                      </button>
                    )}

                    {app.status === 'Interview Scheduled' && (
                      <button
                        type="button"
                        onClick={() => updateApplicationStatus(app.id, 'Selected')}
                        className="px-2.5 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <CheckCircle className="h-3 w-3" />
                        Select
                      </button>
                    )}

                    {app.status === 'Selected' && (
                      <button
                        type="button"
                        onClick={() => setOnboardDialog({ isOpen: true, app })}
                        className="px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-2xs transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <UserCheck className="h-3.5 w-3.5" />
                        Onboard
                      </button>
                    )}

                    {app.status !== 'Rejected' && app.status !== 'Selected' && (
                      <button
                        type="button"
                        onClick={() => setRejectDialog({ isOpen: true, app })}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Reject Application"
                      >
                        <XCircle className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View (>= md) */}
          <div className="hidden md:block bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50/80 text-xs uppercase tracking-wider text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-3.5 font-semibold">Candidate</th>
                    <th className="px-5 py-3.5 font-semibold">Job Position</th>
                    <th className="px-5 py-3.5 font-semibold">Department</th>
                    <th className="px-5 py-3.5 font-semibold">Recruiter</th>
                    <th className="px-5 py-3.5 font-semibold">Applied Date</th>
                    <th className="px-5 py-3.5 font-semibold">Status</th>
                    <th className="px-5 py-3.5 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredApplicants.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Candidate Name & Contact */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-violet-100 text-violet-700 font-bold flex items-center justify-center text-sm shrink-0">
                            {app.candidateName.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 leading-tight">
                              {app.candidateName}
                            </p>
                            <p className="text-xs text-slate-500 mt-0.5">{app.candidateEmail}</p>
                            {app.candidatePhone && (
                              <p className="text-[11px] text-slate-400">{app.candidatePhone}</p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Position */}
                      <td className="px-5 py-4">
                        <p className="font-semibold text-slate-800">{app.jobTitle}</p>
                        <p className="text-xs text-slate-500">{app.designation || 'Specialist'}</p>
                      </td>

                      {/* Department */}
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-700">
                          {app.department}
                        </span>
                      </td>

                      {/* Recruiter */}
                      <td className="px-5 py-4 text-xs text-slate-700 font-medium">
                        {app.recruiter}
                      </td>

                      {/* Date */}
                      <td className="px-5 py-4 text-xs text-slate-500 whitespace-nowrap">
                        {app.appliedDate}
                      </td>

                      {/* Status Badge */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <StatusBadge status={app.status} />
                      </td>

                      {/* Action Buttons */}
                      <td className="px-5 py-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View Details */}
                          <button
                            type="button"
                            onClick={() => setSelectedAppForDetails(app)}
                            className="p-1.5 text-slate-500 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors cursor-pointer"
                            title="View Full Profile & Application"
                          >
                            <Eye className="h-4 w-4" />
                          </button>

                          {/* Status Progression Quick Actions */}
                          {app.status === 'Applied' && (
                            <button
                              type="button"
                              onClick={() => updateApplicationStatus(app.id, 'Under Review')}
                              className="px-2.5 py-1 text-xs font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors cursor-pointer"
                            >
                              Mark Review
                            </button>
                          )}

                          {(app.status === 'Applied' || app.status === 'Under Review') && (
                            <button
                              type="button"
                              onClick={() => updateApplicationStatus(app.id, 'Shortlisted')}
                              className="px-2.5 py-1 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors cursor-pointer"
                            >
                              Shortlist
                            </button>
                          )}

                          {app.status === 'Shortlisted' && (
                            <button
                              type="button"
                              onClick={() => handleOpenScheduleModal(app)}
                              className="px-2.5 py-1 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                            >
                              <Calendar className="h-3 w-3" />
                              Schedule
                            </button>
                          )}

                          {app.status === 'Interview Scheduled' && (
                            <button
                              type="button"
                              onClick={() => updateApplicationStatus(app.id, 'Selected')}
                              className="px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                            >
                              <CheckCircle className="h-3 w-3" />
                              Select
                            </button>
                          )}

                          {app.status === 'Selected' && (
                            <button
                              type="button"
                              onClick={() => setOnboardDialog({ isOpen: true, app })}
                              className="px-2.5 py-1 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-2xs transition-colors cursor-pointer flex items-center gap-1"
                            >
                              <UserCheck className="h-3 w-3" />
                              Onboard as Employee
                            </button>
                          )}

                          {app.status !== 'Rejected' && app.status !== 'Selected' && (
                            <button
                              type="button"
                              onClick={() => setRejectDialog({ isOpen: true, app })}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="Reject Application"
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Applicant Details Modal */}
      {selectedAppForDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-2xl bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-violet-100 text-violet-700 font-bold flex items-center justify-center text-lg">
                  {selectedAppForDetails.candidateName.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {selectedAppForDetails.candidateName}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Applied for {selectedAppForDetails.jobTitle} • {selectedAppForDetails.department}
                  </p>
                </div>
              </div>
              <StatusBadge status={selectedAppForDetails.status} />
            </div>

            <div className="mt-4 space-y-4 text-xs sm:text-sm text-slate-600">
              {/* Contact Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 block">Email Address</span>
                  <span className="font-medium text-slate-800">{selectedAppForDetails.candidateEmail}</span>
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 block">Phone</span>
                  <span className="font-medium text-slate-800">{selectedAppForDetails.candidatePhone || 'Not provided'}</span>
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 block">Location</span>
                  <span className="font-medium text-slate-800">{selectedAppForDetails.candidateLocation || 'Remote'}</span>
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 block">Application Date</span>
                  <span className="font-medium text-slate-800">{selectedAppForDetails.appliedDate}</span>
                </div>
              </div>

              {/* Education & Experience */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Education & Background</h4>
                <p className="p-3 bg-white border border-slate-200 rounded-xl text-slate-800">
                  {selectedAppForDetails.education || 'B.S. in Computer Science or equivalent'}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Experience Summary</h4>
                <p className="p-3 bg-white border border-slate-200 rounded-xl text-slate-800">
                  {selectedAppForDetails.experience || 'Multi-year hands-on professional background.'}
                </p>
              </div>

              {/* Skills */}
              {selectedAppForDetails.skills && selectedAppForDetails.skills.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Candidate Skills</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedAppForDetails.skills.map((skill, i) => (
                      <span key={i} className="px-2.5 py-1 bg-violet-50 text-violet-700 border border-violet-100 rounded-lg text-xs font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Cover Note */}
              {selectedAppForDetails.coverNote && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Cover Note</h4>
                  <p className="p-3 bg-violet-50/50 border border-violet-100 rounded-xl text-slate-700 italic">
                    "{selectedAppForDetails.coverNote}"
                  </p>
                </div>
              )}

              {/* Resume File Info */}
              <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50">
                <div className="flex items-center gap-2.5">
                  <FileText className="h-5 w-5 text-violet-600" />
                  <div>
                    <p className="font-semibold text-slate-800 text-xs">
                      {selectedAppForDetails.resumeName || 'Candidate_Resume.pdf'}
                    </p>
                    <p className="text-[11px] text-slate-400">Attached Candidate Document</p>
                  </div>
                </div>
                <span className="text-xs font-medium text-violet-600 bg-violet-50 px-2.5 py-1 rounded-md">
                  Verified Local Document
                </span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setSelectedAppForDetails(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer"
              >
                Close
              </button>
              {selectedAppForDetails.status !== 'Selected' && selectedAppForDetails.status !== 'Rejected' && (
                <button
                  type="button"
                  onClick={() => {
                    const app = selectedAppForDetails;
                    setSelectedAppForDetails(null);
                    handleOpenScheduleModal(app);
                  }}
                  className="px-4 py-2 text-xs font-semibold text-white bg-violet-600 hover:bg-violet-700 rounded-xl cursor-pointer"
                >
                  Schedule Interview
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Schedule Interview Modal */}
      {scheduleModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-purple-50 text-purple-700">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Schedule Interview</h3>
                  <p className="text-xs text-slate-500">
                    Candidate: {scheduleModal.app?.candidateName} ({scheduleModal.app?.jobTitle})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setScheduleModal({ isOpen: false, app: null })}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmSchedule} className="mt-4 space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Interview Date *</label>
                  <input
                    type="date"
                    required
                    value={interviewForm.interviewDate}
                    onChange={(e) => setInterviewForm({ ...interviewForm, interviewDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Time & Timezone *</label>
                  <input
                    type="text"
                    required
                    value={interviewForm.interviewTime}
                    onChange={(e) => setInterviewForm({ ...interviewForm, interviewTime: e.target.value })}
                    placeholder="e.g. 14:00 CST"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Interview Stage *</label>
                  <select
                    value={interviewForm.stage}
                    onChange={(e) => setInterviewForm({ ...interviewForm, stage: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
                  >
                    <option value="Initial Screening">Initial Screening</option>
                    <option value="Technical Round">Technical Round</option>
                    <option value="Managerial Round">Managerial Round</option>
                    <option value="Culture & HR Round">Culture & HR Round</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Interviewer *</label>
                  <select
                    value={interviewForm.interviewer}
                    onChange={(e) => setInterviewForm({ ...interviewForm, interviewer: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
                  >
                    {recruiters.map((r) => (
                      <option key={r.id} value={r.name}>{r.name} ({r.role})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Format & Location</label>
                <input
                  type="text"
                  value={interviewForm.format}
                  onChange={(e) => setInterviewForm({ ...interviewForm, format: e.target.value })}
                  placeholder="e.g. Google Meet Video Call or Room 402"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Meeting Link / Instructions</label>
                <input
                  type="text"
                  value={interviewForm.meetingLink}
                  onChange={(e) => setInterviewForm({ ...interviewForm, meetingLink: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
                />
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setScheduleModal({ isOpen: false, app: null })}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-xs cursor-pointer"
                >
                  Schedule Interview
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reject Confirmation Dialog */}
      <ConfirmDialog
        isOpen={rejectDialog.isOpen}
        variant="danger"
        title="Reject Application"
        message={`Are you sure you want to mark ${rejectDialog.app?.candidateName}'s application for ${rejectDialog.app?.jobTitle} as Rejected? Note: Rejecting this application does not delete the candidate's account or profile and will not reject any other applications.`}
        confirmText="Confirm Rejection"
        onConfirm={handleConfirmReject}
        onClose={() => setRejectDialog({ isOpen: false, app: null })}
      />

      {/* Onboard As Employee Confirmation Dialog */}
      <ConfirmDialog
        isOpen={onboardDialog.isOpen}
        variant="primary"
        title="Transition Candidate to Employee Onboarding"
        message={`Candidate ${onboardDialog.app?.candidateName} has been selected! Do you want to generate an official employee record, employee ID code, and initiate their onboarding document checklist?`}
        confirmText="Confirm & Start Onboarding"
        onConfirm={handleConfirmOnboard}
        onClose={() => setOnboardDialog({ isOpen: false, app: null })}
      />
    </div>
  );
}
