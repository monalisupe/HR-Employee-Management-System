import React, { useState } from 'react';
import {
  Clock,
  Calendar,
  Plus,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Video,
  User,
  Edit2,
  Trash2,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import SearchBar from '../../components/common/SearchBar';
import StatusBadge from '../../components/common/StatusBadge';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import EmptyState from '../../components/common/EmptyState';

export default function Interviews() {
  const {
    interviews,
    applicants,
    recruiters,
    scheduleInterview,
    updateInterview,
    cancelInterview,
    updateApplicationStatus,
    switchRole,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedResult, setSelectedResult] = useState('All');
  const [selectedStage, setSelectedStage] = useState('All');

  // Modal State
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [editingInterview, setEditingInterview] = useState(null);
  const [cancelDialog, setCancelDialog] = useState({ isOpen: false, interview: null });

  const initialForm = {
    applicationId: applicants[0]?.id || '',
    interviewDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    interviewTime: '14:00 (2:00 PM CST)',
    interviewer: 'Sarah Jenkins',
    stage: 'Technical Round',
    format: 'Google Meet Video Call',
    meetingLink: 'https://meet.securetenant.dev/interview-room',
    feedback: '',
  };

  const [formData, setFormData] = useState(initialForm);

  const filteredInterviews = interviews.filter((i) => {
    const matchesSearch =
      i.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.interviewer.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesResult = selectedResult === 'All' || i.result === selectedResult;
    const matchesStage = selectedStage === 'All' || i.stage === selectedStage;

    return matchesSearch && matchesResult && matchesStage;
  });

  const handleOpenSchedule = () => {
    if (applicants.length === 0) {
      alert('There are zero applicants in the system. Switch to Candidate role and submit an application first, or load demo data.');
      return;
    }
    setEditingInterview(null);
    setFormData({
      ...initialForm,
      applicationId: applicants[0].id,
    });
    setIsScheduleOpen(true);
  };

  const handleSaveInterview = (e) => {
    e.preventDefault();
    const app = applicants.find((a) => a.id === formData.applicationId);
    if (!app) return;

    if (editingInterview) {
      updateInterview(editingInterview.id, {
        interviewDate: formData.interviewDate,
        interviewTime: formData.interviewTime,
        interviewer: formData.interviewer,
        stage: formData.stage,
        format: formData.format,
        meetingLink: formData.meetingLink,
        feedback: formData.feedback,
      });
    } else {
      scheduleInterview({
        applicationId: app.id,
        candidateName: app.candidateName,
        candidateEmail: app.candidateEmail,
        jobTitle: app.jobTitle,
        department: app.department,
        interviewDate: formData.interviewDate,
        interviewTime: formData.interviewTime,
        interviewer: formData.interviewer,
        stage: formData.stage,
        format: formData.format,
        meetingLink: formData.meetingLink,
        feedback: formData.feedback,
      });
    }

    setIsScheduleOpen(false);
  };

  const handleRecordResult = (interview, resultStatus) => {
    updateInterview(interview.id, { result: resultStatus });
    if (resultStatus === 'Passed') {
      updateApplicationStatus(interview.applicationId, 'Selected', 'Passed final interview rounds successfully.');
    } else if (resultStatus === 'Failed') {
      updateApplicationStatus(interview.applicationId, 'Rejected', 'Did not meet requirements during technical interview.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Interview Coordination
            </h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-violet-100 text-violet-800">
              {interviews.length} Scheduled
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            Coordinate interview schedules, stages, panel assignments, and feedback scoring.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenSchedule}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-violet-600 hover:bg-violet-700 rounded-xl shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Schedule Interview</span>
        </button>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs flex flex-col md:flex-row gap-3">
        <div className="flex-1">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by candidate name, position, or interviewer..."
          />
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
          <select
            value={selectedStage}
            onChange={(e) => setSelectedStage(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 text-xs font-medium bg-white border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
          >
            <option value="All">All Stages</option>
            <option value="Initial Screening">Initial Screening</option>
            <option value="Technical Round">Technical Round</option>
            <option value="Managerial Round">Managerial Round</option>
            <option value="Culture & HR Round">Culture & HR Round</option>
          </select>

          <select
            value={selectedResult}
            onChange={(e) => setSelectedResult(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 text-xs font-medium bg-white border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
          >
            <option value="All">All Results</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Completed">Completed</option>
            <option value="Passed">Passed</option>
            <option value="Failed">Failed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Interviews Table & Mobile Cards */}
      {filteredInterviews.length === 0 ? (
        <EmptyState
          icon={Clock}
          title={interviews.length === 0 ? 'No Interviews Scheduled' : 'No matching interviews'}
          description={
            interviews.length === 0
              ? 'There are currently zero interviews recorded in local state. Review applicants on the Applicants page to schedule screening and technical rounds.'
              : 'Try clearing your search keyword or stage filters.'
          }
          actionLabel={interviews.length === 0 ? 'Go to Applicants' : 'Clear Filters'}
          onAction={
            interviews.length === 0
              ? () => switchRole('hr')
              : () => {
                  setSearchQuery('');
                  setSelectedResult('All');
                  setSelectedStage('All');
                }
          }
        />
      ) : (
        <>
          {/* Mobile Card Deck (< md) */}
          <div className="block md:hidden space-y-3">
            {filteredInterviews.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm leading-tight">{item.candidateName}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{item.jobTitle} • {item.department}</p>
                  </div>
                  <StatusBadge status={item.result} size="sm" />
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Stage</span>
                    <span className="font-semibold text-purple-700">{item.stage}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Interviewer</span>
                    <span className="font-medium text-slate-700">{item.interviewer}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Scheduled Time</span>
                    <span className="font-medium text-slate-800">{item.interviewDate} at {item.interviewTime}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  {item.meetingLink ? (
                    <a
                      href={item.meetingLink}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-violet-700 bg-violet-50 hover:bg-violet-100 rounded-lg transition-colors"
                    >
                      <Video className="h-3.5 w-3.5" />
                      <span>Join Room</span>
                    </a>
                  ) : <span />}

                  {item.result === 'Scheduled' && (
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleRecordResult(item, 'Passed')}
                        className="px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg cursor-pointer"
                      >
                        Pass
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRecordResult(item, 'Failed')}
                        className="px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg cursor-pointer"
                      >
                        Fail
                      </button>
                      <button
                        type="button"
                        onClick={() => setCancelDialog({ isOpen: true, interview: item })}
                        className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
                        title="Cancel"
                      >
                        <XCircle className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table (>= md) */}
          <div className="hidden md:block bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50/80 text-xs uppercase tracking-wider text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-3.5 font-semibold">Candidate</th>
                    <th className="px-5 py-3.5 font-semibold">Job Position</th>
                    <th className="px-5 py-3.5 font-semibold">Stage</th>
                    <th className="px-5 py-3.5 font-semibold">Date & Time</th>
                    <th className="px-5 py-3.5 font-semibold">Interviewer(s)</th>
                    <th className="px-5 py-3.5 font-semibold">Status / Result</th>
                    <th className="px-5 py-3.5 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredInterviews.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Candidate */}
                      <td className="px-5 py-4">
                        <p className="font-semibold text-slate-900 leading-tight">
                          {item.candidateName}
                        </p>
                        <p className="text-xs text-slate-500">{item.candidateEmail}</p>
                      </td>

                      {/* Position */}
                      <td className="px-5 py-4 text-xs font-semibold text-slate-800">
                        {item.jobTitle}
                        <span className="block text-[11px] text-slate-400 font-normal">{item.department}</span>
                      </td>

                      {/* Stage */}
                      <td className="px-5 py-4 text-xs">
                        <span className="px-2.5 py-0.5 rounded-md bg-purple-50 text-purple-700 font-semibold border border-purple-100">
                          {item.stage}
                        </span>
                      </td>

                      {/* Date & Time */}
                      <td className="px-5 py-4 text-xs whitespace-nowrap">
                        <p className="font-semibold text-slate-800">{item.interviewDate}</p>
                        <p className="text-[11px] text-slate-500">{item.interviewTime}</p>
                      </td>

                      {/* Interviewer */}
                      <td className="px-5 py-4 text-xs text-slate-700 font-medium">
                        {item.interviewer}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <StatusBadge status={item.result} />
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {item.result === 'Scheduled' && (
                            <>
                              <button
                                type="button"
                                onClick={() => handleRecordResult(item, 'Passed')}
                                className="px-2.5 py-1 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-2xs transition-colors cursor-pointer"
                                title="Mark Passed & Select Candidate"
                              >
                                Pass
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRecordResult(item, 'Failed')}
                                className="px-2.5 py-1 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors cursor-pointer"
                                title="Mark Failed"
                              >
                                Fail
                              </button>
                              <button
                                type="button"
                                onClick={() => setCancelDialog({ isOpen: true, interview: item })}
                                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
                                title="Cancel Interview"
                              >
                                <XCircle className="h-4 w-4" />
                              </button>
                            </>
                          )}

                          {item.meetingLink && (
                            <a
                              href={item.meetingLink}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 text-violet-600 hover:bg-violet-50 rounded-lg transition-colors"
                              title="Join Meeting Room"
                            >
                              <Video className="h-4 w-4" />
                            </a>
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

      {/* Schedule Interview Modal Form */}
      {isScheduleOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Schedule Candidate Interview</h3>
              <button onClick={() => setIsScheduleOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleSaveInterview} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Candidate *</label>
                <select
                  required
                  value={formData.applicationId}
                  onChange={(e) => setFormData({ ...formData, applicationId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
                >
                  {applicants.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.candidateName} — {a.jobTitle} ({a.department})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.interviewDate}
                    onChange={(e) => setFormData({ ...formData, interviewDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Time & Timezone *</label>
                  <input
                    type="text"
                    required
                    value={formData.interviewTime}
                    onChange={(e) => setFormData({ ...formData, interviewTime: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Stage *</label>
                  <select
                    value={formData.stage}
                    onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
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
                    value={formData.interviewer}
                    onChange={(e) => setFormData({ ...formData, interviewer: e.target.value })}
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
                  value={formData.format}
                  onChange={(e) => setFormData({ ...formData, format: e.target.value })}
                  placeholder="e.g. Google Meet Video Call"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Meeting Link</label>
                <input
                  type="text"
                  value={formData.meetingLink}
                  onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsScheduleOpen(false)}
                  className="px-3.5 py-2 text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-violet-600 hover:bg-violet-700 rounded-xl font-bold shadow-xs cursor-pointer"
                >
                  Confirm Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cancel Confirmation */}
      <ConfirmDialog
        isOpen={cancelDialog.isOpen}
        variant="warning"
        title="Cancel Interview"
        message={`Are you sure you want to cancel the scheduled interview for ${cancelDialog.interview?.candidateName}?`}
        confirmText="Cancel Interview"
        onConfirm={() => {
          cancelInterview(cancelDialog.interview.id);
          setCancelDialog({ isOpen: false, interview: null });
        }}
        onClose={() => setCancelDialog({ isOpen: false, interview: null })}
      />
    </div>
  );
}
