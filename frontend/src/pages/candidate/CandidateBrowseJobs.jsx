import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase,
  Search,
  Filter,
  MapPin,
  Clock,
  DollarSign,
  CheckCircle,
  FileText,
  User,
  ArrowRight,
  Shield,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import SearchBar from '../../components/common/SearchBar';
import EmptyState from '../../components/common/EmptyState';

export default function CandidateBrowseJobs() {
  const navigate = useNavigate();
  const {
    openPositions,
    applicants,
    currentCandidate,
    applyForJob,
    departments,
    switchRole,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedType, setSelectedType] = useState('All');

  // Modals state
  const [selectedJobForModal, setSelectedJobForModal] = useState(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [jobToApply, setJobToApply] = useState(null);

  // Application form state (prefilled from candidate profile)
  const [applicationForm, setApplicationForm] = useState({
    name: currentCandidate?.name || '',
    email: currentCandidate?.email || '',
    phone: currentCandidate?.phone || '',
    location: currentCandidate?.location || '',
    education: currentCandidate?.education || '',
    experience: currentCandidate?.experience || '',
    skills: currentCandidate?.skills || [],
    skillsInput: currentCandidate?.skills?.join(', ') || '',
    coverNote: '',
    resumeName: currentCandidate?.resumeName || 'Candidate_Resume.pdf',
  });

  // Only show published positions
  const publishedPositions = openPositions.filter((p) => p.status === 'Published');

  // Filter positions
  const filteredPositions = publishedPositions.filter((pos) => {
    const matchesSearch =
      pos.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pos.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pos.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (pos.skills && pos.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())));

    const matchesDept = selectedDept === 'All' || pos.department === selectedDept;
    const matchesType = selectedType === 'All' || pos.employmentType === selectedType;

    return matchesSearch && matchesDept && matchesType;
  });

  // Candidate applications
  const myApplications = applicants.filter(
    (a) => a.candidateId === currentCandidate?.id
  );

  const hasApplied = (positionId) => {
    return myApplications.some((a) => a.positionId === positionId);
  };

  const handleOpenApplyModal = (job) => {
    if (hasApplied(job.id)) return;
    setJobToApply(job);
    setApplicationForm({
      name: currentCandidate?.name || 'Alex Rivera',
      email: currentCandidate?.email || 'alex.rivera@example.com',
      phone: currentCandidate?.phone || '+1 (555) 432-8765',
      location: currentCandidate?.location || 'San Francisco, CA',
      education: currentCandidate?.education || 'B.S. in Computer Science',
      experience: currentCandidate?.experience || '4+ years of relevant domain experience',
      skills: currentCandidate?.skills || ['React', 'Python'],
      skillsInput: currentCandidate?.skills?.join(', ') || 'React, Python',
      coverNote: '',
      resumeName: currentCandidate?.resumeName || 'Alex_Rivera_Resume.pdf',
    });
    setIsApplyModalOpen(true);
  };

  const handleSubmitApplication = (e) => {
    e.preventDefault();
    if (!jobToApply) return;

    const parsedSkills = applicationForm.skillsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const success = applyForJob(jobToApply.id, {
      ...applicationForm,
      skills: parsedSkills,
    });

    if (success) {
      setIsApplyModalOpen(false);
      setJobToApply(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Explore Career Opportunities
            </h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-violet-100 text-violet-800">
              {publishedPositions.length} Published Roles
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            Discover active openings, inspect required skillsets, and apply directly.
          </p>
        </div>

        {publishedPositions.length === 0 && (
          <button
            type="button"
            onClick={() => switchRole('hr')}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-violet-700 bg-violet-50 hover:bg-violet-100 border border-violet-200 rounded-xl transition-colors cursor-pointer self-start sm:self-auto"
          >
            <span>Switch to HR to Publish a Job</span>
          </button>
        )}
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs flex flex-col md:flex-row gap-3">
        <div className="flex-1">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by job title, skills (e.g. Python), or city..."
          />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="px-3 py-2 text-xs font-medium bg-white border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-violet-500"
          >
            <option value="All">All Departments</option>
            {departments.map((d) => (
              <option key={d.id} value={d.name}>{d.name}</option>
            ))}
          </select>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 text-xs font-medium bg-white border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-violet-500"
          >
            <option value="All">All Employment Types</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
          </select>
        </div>
      </div>

      {/* Published Positions Grid */}
      {filteredPositions.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title={publishedPositions.length === 0 ? 'No Published Positions Available' : 'No matching positions found'}
          description={
            publishedPositions.length === 0
              ? 'There are currently zero open positions published. HR administrators can create and publish jobs in Open Positions.'
              : 'Try clearing your search query or department filters.'
          }
          actionLabel={publishedPositions.length === 0 ? 'Switch to HR Dashboard' : 'Clear Search'}
          onAction={
            publishedPositions.length === 0
              ? () => switchRole('hr')
              : () => {
                  setSearchQuery('');
                  setSelectedDept('All');
                  setSelectedType('All');
                }
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPositions.map((job) => {
            const alreadyApplied = hasApplied(job.id);
            return (
              <div
                key={job.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs hover:shadow-xs transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-violet-700 bg-violet-50 px-2.5 py-1 rounded-md">
                      {job.department}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      {job.employmentType}
                    </span>
                  </div>

                  <h3 className="mt-2 text-base font-bold text-slate-900 leading-snug">
                    {job.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">{job.designation}</p>

                  <div className="mt-3 flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" />
                      {job.location}
                    </span>
                    {job.salaryRange && (
                      <span className="font-semibold text-slate-700">
                        {job.salaryRange}
                      </span>
                    )}
                  </div>

                  <p className="mt-3 text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {job.description}
                  </p>

                  {/* Skills tags */}
                  {job.skills && job.skills.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1">
                      {job.skills.map((s, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-[10px] font-medium"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setSelectedJobForModal(job)}
                    className="text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                  >
                    View Details
                  </button>

                  {alreadyApplied ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 font-semibold text-xs border border-emerald-200">
                      <CheckCircle className="h-3.5 w-3.5" />
                      Applied
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleOpenApplyModal(job)}
                      className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <span>Apply Now</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* View Job Details Modal */}
      {selectedJobForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-xl bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-violet-700 bg-violet-50 px-2 py-0.5 rounded-md">
                  {selectedJobForModal.department}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  {selectedJobForModal.title}
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedJobForModal.location} • {selectedJobForModal.employmentType}
                </p>
              </div>
              <button onClick={() => setSelectedJobForModal(null)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <div className="mt-4 space-y-4 text-xs sm:text-sm text-slate-600">
              <div>
                <h4 className="font-bold text-slate-800 uppercase text-xs tracking-wider mb-1">
                  Job Description
                </h4>
                <p className="leading-relaxed whitespace-pre-line text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {selectedJobForModal.description}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 uppercase text-xs tracking-wider mb-1">
                  Qualifications & Experience
                </h4>
                <p className="leading-relaxed text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {selectedJobForModal.qualifications || 'Relevant education and practical domain background.'}
                </p>
              </div>

              {selectedJobForModal.skills && (
                <div>
                  <h4 className="font-bold text-slate-800 uppercase text-xs tracking-wider mb-1.5">
                    Required Skills
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedJobForModal.skills.map((skill, i) => (
                      <span key={i} className="px-2.5 py-1 bg-violet-50 text-violet-700 border border-violet-100 rounded-lg text-xs font-semibold">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-500 flex justify-between">
                <span>Assigned Recruiter: <strong>{selectedJobForModal.recruiter}</strong></span>
                <span>Posted: <strong>{selectedJobForModal.postedDate}</strong></span>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setSelectedJobForModal(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer"
              >
                Close
              </button>
              {!hasApplied(selectedJobForModal.id) ? (
                <button
                  type="button"
                  onClick={() => {
                    const job = selectedJobForModal;
                    setSelectedJobForModal(null);
                    handleOpenApplyModal(job);
                  }}
                  className="px-4 py-2 text-xs font-semibold text-white bg-violet-600 hover:bg-violet-700 rounded-xl shadow-xs cursor-pointer"
                >
                  Apply for this Role
                </button>
              ) : (
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl">
                  Already Applied
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Apply Form Modal */}
      {isApplyModalOpen && jobToApply && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-xl bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Submit Application
                </h3>
                <p className="text-xs text-slate-500">
                  Position: <strong>{jobToApply.title}</strong> ({jobToApply.department})
                </p>
              </div>
              <button onClick={() => setIsApplyModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleSubmitApplication} className="mt-4 space-y-3.5 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={applicationForm.name}
                    onChange={(e) => setApplicationForm({ ...applicationForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={applicationForm.email}
                    onChange={(e) => setApplicationForm({ ...applicationForm, email: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone Number *</label>
                  <input
                    type="text"
                    required
                    value={applicationForm.phone}
                    onChange={(e) => setApplicationForm({ ...applicationForm, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Location *</label>
                  <input
                    type="text"
                    required
                    value={applicationForm.location}
                    onChange={(e) => setApplicationForm({ ...applicationForm, location: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Education & Qualifications *</label>
                <input
                  type="text"
                  required
                  value={applicationForm.education}
                  onChange={(e) => setApplicationForm({ ...applicationForm, education: e.target.value })}
                  placeholder="e.g. B.S. in Computer Science, State University"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Experience Summary *</label>
                <input
                  type="text"
                  required
                  value={applicationForm.experience}
                  onChange={(e) => setApplicationForm({ ...applicationForm, experience: e.target.value })}
                  placeholder="e.g. 4+ years software development experience"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Skills (Comma separated) *</label>
                <input
                  type="text"
                  required
                  value={applicationForm.skillsInput}
                  onChange={(e) => setApplicationForm({ ...applicationForm, skillsInput: e.target.value })}
                  placeholder="e.g. React, Python, PostgreSQL, Docker"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-violet-500"
                />
              </div>

              {/* Resume selection preview */}
              <div className="p-3 bg-violet-50/60 border border-violet-100 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <FileText className="h-5 w-5 text-violet-600" />
                  <div>
                    <p className="font-bold text-slate-800 text-xs">
                      {applicationForm.resumeName}
                    </p>
                    <p className="text-[11px] text-slate-500">Selected Candidate Document</p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-violet-700">Attached</span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Cover Note / Why this role?</label>
                <textarea
                  rows={3}
                  value={applicationForm.coverNote}
                  onChange={(e) => setApplicationForm({ ...applicationForm, coverNote: e.target.value })}
                  placeholder="Explain why your background aligns with this position..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-violet-500 text-xs sm:text-sm"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsApplyModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-violet-600 hover:bg-violet-700 rounded-xl shadow-xs cursor-pointer"
                >
                  Confirm & Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

