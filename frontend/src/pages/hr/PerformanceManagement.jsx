import React, { useState } from 'react';
import {
  Award,
  Plus,
  Star,
  Search,
  Filter,
  User,
  Calendar,
  CheckCircle,
  FileText,
  TrendingUp,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import SearchBar from '../../components/common/SearchBar';
import EmptyState from '../../components/common/EmptyState';

export default function PerformanceManagement() {
  const {
    performanceReviews,
    employees,
    departments,
    addPerformanceReview,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [isFormOpen, setIsFormOpen] = useState(false);

  const initialForm = {
    employeeId: employees[0]?.id || '',
    reviewPeriod: 'Q1 2026 Appraisal',
    rating: 5,
    goals: '',
    achievements: '',
    managerFeedback: '',
    trainingNeeds: '',
  };

  const [formData, setFormData] = useState(initialForm);

  const filteredReviews = performanceReviews.filter((r) => {
    const matchesSearch =
      r.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.reviewPeriod.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.department && r.department.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesDept = selectedDept === 'All' || r.department === selectedDept;

    return matchesSearch && matchesDept;
  });

  const handleOpenAdd = () => {
    if (employees.length === 0) {
      alert('Please add or onboard an employee first before recording a performance appraisal.');
      return;
    }
    setFormData({
      ...initialForm,
      employeeId: employees[0].id,
    });
    setIsFormOpen(true);
  };

  const handleSaveReview = (e) => {
    e.preventDefault();
    const emp = employees.find((e) => e.id === formData.employeeId);
    if (!emp) return;

    addPerformanceReview({
      employeeId: emp.id,
      employeeName: emp.name,
      department: emp.department,
      designation: emp.designation,
      reviewPeriod: formData.reviewPeriod,
      rating: parseFloat(formData.rating) || 5,
      goals: formData.goals,
      achievements: formData.achievements,
      managerFeedback: formData.managerFeedback,
      trainingNeeds: formData.trainingNeeds,
    });

    setIsFormOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Employee Performance Management
            </h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-violet-100 text-violet-800">
              {performanceReviews.length} Reviews
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            Quarterly goals, performance ratings, manager feedback, and skill development logs.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-violet-600 hover:bg-violet-700 rounded-xl shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Record Review</span>
        </button>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by employee name or review period..."
          />
        </div>
        <div>
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
        </div>
      </div>

      {/* Performance Reviews List */}
      {filteredReviews.length === 0 ? (
        <EmptyState
          icon={Award}
          title={performanceReviews.length === 0 ? 'No Performance Reviews Recorded' : 'No matching performance records'}
          description={
            performanceReviews.length === 0
              ? 'There are currently zero appraisal records in local state. Once employees are active, HR and managers can record review ratings, goals, and feedback.'
              : 'Try clearing your search query or department filter.'
          }
          actionLabel={performanceReviews.length === 0 && employees.length > 0 ? 'Record First Appraisal' : undefined}
          onAction={handleOpenAdd}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-violet-100 text-violet-700 font-bold flex items-center justify-center text-sm">
                      {rev.employeeName.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{rev.employeeName}</h3>
                      <p className="text-xs text-slate-500">{rev.designation} • {rev.department}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg text-amber-700 font-bold text-xs">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    <span>{rev.rating} / 5.0</span>
                  </div>
                </div>

                <div className="mt-3 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-500">
                    <span className="font-semibold text-slate-700">{rev.reviewPeriod}</span>
                    <span>Reviewed: {rev.reviewDate}</span>
                  </div>

                  {rev.goals && (
                    <div className="mt-2">
                      <span className="font-semibold text-slate-400 uppercase text-[10px] block">Key Goals</span>
                      <p className="text-slate-700 mt-0.5">{rev.goals}</p>
                    </div>
                  )}

                  {rev.achievements && (
                    <div className="mt-2">
                      <span className="font-semibold text-slate-400 uppercase text-[10px] block">Achievements & Milestones</span>
                      <p className="text-slate-700 mt-0.5">{rev.achievements}</p>
                    </div>
                  )}

                  {rev.managerFeedback && (
                    <div className="mt-2 p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="font-semibold text-slate-500 text-[10px] uppercase block">Manager Appraisal Feedback</span>
                      <p className="text-slate-800 text-xs italic mt-0.5">"{rev.managerFeedback}"</p>
                    </div>
                  )}

                  {rev.trainingNeeds && (
                    <div className="mt-2">
                      <span className="font-semibold text-violet-600 text-[10px] uppercase block">Recommended Training</span>
                      <p className="text-slate-700 mt-0.5">{rev.trainingNeeds}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Review Modal Form */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Record Performance Appraisal</h3>
              <button onClick={() => setIsFormOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleSaveReview} className="mt-4 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Select Employee *</label>
                  <select
                    required
                    value={formData.employeeId}
                    onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-violet-500"
                  >
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id}>{emp.name} ({emp.department})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Review Period *</label>
                  <input
                    type="text"
                    required
                    value={formData.reviewPeriod}
                    onChange={(e) => setFormData({ ...formData, reviewPeriod: e.target.value })}
                    placeholder="e.g. Q1 2026 Appraisal"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Performance Rating (1 to 5 Stars) *</label>
                <div className="flex items-center gap-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: star })}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs font-bold transition-colors cursor-pointer ${formData.rating === star
                          ? 'bg-amber-500 text-white border-amber-600'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                    >
                      <Star className="h-3 w-3 fill-current" />
                      <span>{star} Star{star > 1 ? 's' : ''}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Key Goals & Objectives</label>
                <textarea
                  rows={2}
                  value={formData.goals}
                  onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
                  placeholder="Goals achieved during this review cycle..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Key Achievements</label>
                <textarea
                  rows={2}
                  value={formData.achievements}
                  onChange={(e) => setFormData({ ...formData, achievements: e.target.value })}
                  placeholder="Specific milestones, metrics improved, or projects delivered..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Manager Appraisal Feedback *</label>
                <textarea
                  rows={3}
                  required
                  value={formData.managerFeedback}
                  onChange={(e) => setFormData({ ...formData, managerFeedback: e.target.value })}
                  placeholder="Constructive feedback, technical strengths, and leadership..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Training & Development Needs</label>
                <input
                  type="text"
                  value={formData.trainingNeeds}
                  onChange={(e) => setFormData({ ...formData, trainingNeeds: e.target.value })}
                  placeholder="e.g. AWS Cloud Solutions Architect certification"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-3.5 py-2 text-slate-700 bg-white border border-slate-200 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-violet-600 rounded-xl font-semibold shadow-xs"
                >
                  Record Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

