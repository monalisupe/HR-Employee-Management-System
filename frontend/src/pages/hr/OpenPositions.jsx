import React, { useState } from 'react';
import {
  Briefcase,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Users,
  Eye,
  CheckCircle2,
  XCircle,
  Building,
  MapPin,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import SearchBar from '../../components/common/SearchBar';
import StatusBadge from '../../components/common/StatusBadge';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import EmptyState from '../../components/common/EmptyState';

export default function OpenPositions() {
  const {
    openPositions,
    applicants,
    departments,
    designations,
    recruiters,
    createPosition,
    updatePosition,
    deletePosition,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPosition, setEditingPosition] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, pos: null });

  // Form State
  const initialFormState = {
    title: '',
    department: 'IT',
    designation: 'Software Developer',
    location: 'Austin, TX (Remote Available)',
    employmentType: 'Full-time',
    description: '',
    qualifications: '',
    skillsInput: '',
    experience: '2+ years',
    recruiter: 'Sarah Jenkins',
    status: 'Published',
    salaryRange: '$90,000 - $120,000',
  };

  const [formData, setFormData] = useState(initialFormState);

  // Filter positions
  const filteredPositions = openPositions.filter((pos) => {
    const matchesSearch =
      pos.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pos.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pos.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDept = selectedDept === 'All' || pos.department === selectedDept;
    const matchesStatus = selectedStatus === 'All' || pos.status === selectedStatus;

    return matchesSearch && matchesDept && matchesStatus;
  });

  const handleOpenCreateModal = () => {
    setEditingPosition(null);
    setFormData(initialFormState);
    setIsFormOpen(true);
  };

  const handleOpenEditModal = (pos) => {
    setEditingPosition(pos);
    setFormData({
      title: pos.title,
      department: pos.department,
      designation: pos.designation,
      location: pos.location,
      employmentType: pos.employmentType,
      description: pos.description,
      qualifications: pos.qualifications,
      skillsInput: Array.isArray(pos.skills) ? pos.skills.join(', ') : '',
      experience: pos.experience,
      recruiter: pos.recruiter,
      status: pos.status,
      salaryRange: pos.salaryRange || '$80,000 - $110,000',
    });
    setIsFormOpen(true);
  };

  const handleSavePosition = (e) => {
    e.preventDefault();
    const skills = formData.skillsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const positionPayload = {
      title: formData.title,
      department: formData.department,
      designation: formData.designation,
      location: formData.location,
      employmentType: formData.employmentType,
      description: formData.description,
      qualifications: formData.qualifications,
      skills,
      experience: formData.experience,
      recruiter: formData.recruiter,
      status: formData.status,
      salaryRange: formData.salaryRange,
    };

    if (editingPosition) {
      updatePosition(editingPosition.id, positionPayload);
    } else {
      createPosition(positionPayload);
    }

    setIsFormOpen(false);
  };

  const handleToggleStatus = (pos) => {
    const nextStatus = pos.status === 'Published' ? 'Closed' : 'Published';
    updatePosition(pos.id, { status: nextStatus });
  };

  const handleConfirmDelete = () => {
    if (!deleteDialog.pos) return;
    deletePosition(deleteDialog.pos.id);
    setDeleteDialog({ isOpen: false, pos: null });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Open Positions Management
            </h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-violet-100 text-violet-800">
              {openPositions.length} Total
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            Create, publish, and manage job openings. Published positions are live on the Candidate Portal.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-violet-600 hover:bg-violet-700 rounded-xl shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Create New Position</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs flex flex-col md:flex-row gap-3">
        <div className="flex-1">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by job title, department, or location..."
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
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 text-xs font-medium bg-white border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-violet-500"
          >
            <option value="All">All Statuses</option>
            <option value="Published">Published (Active)</option>
            <option value="Draft">Draft</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Positions Grid / List */}
      {filteredPositions.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title={openPositions.length === 0 ? 'No Job Positions Created' : 'No matching positions'}
          description={
            openPositions.length === 0
              ? 'Start by creating your first job opening. You can set it to Published so candidates can browse and apply.'
              : 'Try clearing your filters or search keywords.'
          }
          actionLabel={openPositions.length === 0 ? 'Create First Job Opening' : 'Clear Filters'}
          onAction={
            openPositions.length === 0
              ? handleOpenCreateModal
              : () => {
                setSearchQuery('');
                setSelectedDept('All');
                setSelectedStatus('All');
              }
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPositions.map((pos) => {
            const applicantCount = applicants.filter((a) => a.positionId === pos.id).length;

            return (
              <div
                key={pos.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs hover:shadow-xs transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-violet-600 bg-violet-50 px-2 py-0.5 rounded-md">
                        {pos.department}
                      </span>
                      <h3 className="mt-2 text-base font-bold text-slate-900 group-hover:text-violet-600 transition-colors">
                        {pos.title}
                      </h3>
                      <p className="text-xs text-slate-500">{pos.designation}</p>
                    </div>
                    <StatusBadge status={pos.status} />
                  </div>

                  <p className="mt-3 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {pos.description}
                  </p>

                  {/* Skills tags */}
                  {pos.skills && pos.skills.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {pos.skills.slice(0, 3).map((s, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-[10px] font-medium"
                        >
                          {s}
                        </span>
                      ))}
                      {pos.skills.length > 3 && (
                        <span className="px-1.5 py-0.5 text-slate-400 text-[10px]">
                          +{pos.skills.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Meta Details */}
                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-500">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-slate-400" />
                        {pos.location}
                      </span>
                      <span className="font-semibold text-slate-700">{pos.employmentType}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Recruiter:</span>
                      <span className="font-medium text-slate-700">{pos.recruiter}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Applications:</span>
                      <span className="font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded-full">
                        {applicantCount} applicant{applicantCount === 1 ? '' : 's'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(pos)}
                    className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors cursor-pointer ${pos.status === 'Published'
                        ? 'text-rose-700 bg-rose-50 hover:bg-rose-100'
                        : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                      }`}
                  >
                    {pos.status === 'Published' ? 'Close Position' : 'Reopen / Publish'}
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(pos)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                      title="Edit Position"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteDialog({ isOpen: true, pos })}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete Position"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create / Edit Position Modal Form */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-2xl bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">
                {editingPosition ? 'Edit Job Opening' : 'Create Job Opening'}
              </h3>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSavePosition} className="mt-4 space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Job Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Senior Python Developer"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Department *</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-violet-500"
                  >
                    {departments.map((d) => (
                      <option key={d.id} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Job Designation *</label>
                  <select
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-violet-500"
                  >
                    {designations.map((desig) => (
                      <option key={desig.id} value={desig.title}>{desig.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Assigned Recruiter *</label>
                  <select
                    value={formData.recruiter}
                    onChange={(e) => setFormData({ ...formData, recruiter: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-violet-500"
                  >
                    {recruiters.map((r) => (
                      <option key={r.id} value={r.name}>{r.name} ({r.role})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Location *</label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Remote or Austin, TX"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Employment Type *</label>
                  <select
                    value={formData.employmentType}
                    onChange={(e) => setFormData({ ...formData, employmentType: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-violet-500"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Publish Status *</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-violet-500"
                  >
                    <option value="Published">Published (Live to Candidates)</option>
                    <option value="Draft">Draft</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Required Skills (Comma separated) *</label>
                <input
                  type="text"
                  required
                  value={formData.skillsInput}
                  onChange={(e) => setFormData({ ...formData, skillsInput: e.target.value })}
                  placeholder="e.g. Python, FastAPI, PostgreSQL, Docker"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Job Description *</label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detail the core expectations, team mission, and deliverables..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-violet-500 text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Qualifications & Experience</label>
                <textarea
                  rows={2}
                  value={formData.qualifications}
                  onChange={(e) => setFormData({ ...formData, qualifications: e.target.value })}
                  placeholder="e.g. Bachelor's in CS or equivalent, 3+ years experience..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-violet-500 text-xs sm:text-sm"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-violet-600 hover:bg-violet-700 rounded-xl shadow-xs cursor-pointer"
                >
                  {editingPosition ? 'Save Changes' : 'Create Position'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        variant="danger"
        title="Delete Job Position"
        message={`Are you sure you want to delete "${deleteDialog.pos?.title}"? This position will no longer appear on the candidate job board.`}
        confirmText="Delete Position"
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteDialog({ isOpen: false, pos: null })}
      />
    </div>
  );
}

