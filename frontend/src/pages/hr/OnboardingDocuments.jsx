import React, { useState } from 'react';
import {
  FileCheck,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  FileText,
  User,
  ShieldCheck,
  Search,
  Filter,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import SearchBar from '../../components/common/SearchBar';
import StatusBadge from '../../components/common/StatusBadge';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import EmptyState from '../../components/common/EmptyState';

export default function OnboardingDocuments() {
  const {
    onboardingDocuments,
    employees,
    verifyDocument,
    switchRole,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [reviewDialog, setReviewDialog] = useState({
    isOpen: false,
    doc: null,
    status: 'Verified',
    notes: '',
  });

  const filteredDocs = onboardingDocuments.filter((doc) => {
    const matchesSearch =
      doc.documentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.documentType.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = selectedStatus === 'All' || doc.verificationStatus === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const handleOpenReview = (doc, status) => {
    setReviewDialog({
      isOpen: true,
      doc,
      status,
      notes: status === 'Verified' ? 'Document verified and meets compliance criteria.' : 'Document is incomplete or illegible. Please resubmit.',
    });
  };

  const handleConfirmReview = () => {
    if (!reviewDialog.doc) return;
    verifyDocument(reviewDialog.doc.id, reviewDialog.status, reviewDialog.notes);
    setReviewDialog({ isOpen: false, doc: null, status: 'Verified', notes: '' });
  };

  const pendingCount = onboardingDocuments.filter((d) => d.verificationStatus === 'Pending').length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Onboarding & Document Verification
            </h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-violet-100 text-violet-800">
              {pendingCount} Pending Review
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            Audit compliance forms, signed offer letters, tax filings, and identity proofs.
          </p>
        </div>

        {onboardingDocuments.length === 0 && (
          <button
            type="button"
            onClick={() => switchRole('employee')}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-colors cursor-pointer self-start sm:self-auto"
          >
            <span>Switch to Employee to Submit Document</span>
          </button>
        )}
      </div>

      {/* Onboarding Overview Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Submissions</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{onboardingDocuments.length}</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs">
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-600">Pending Verification</p>
          <p className="text-2xl font-bold text-amber-700 mt-1">
            {pendingCount}
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs">
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">Verified & Compliant</p>
          <p className="text-2xl font-bold text-emerald-700 mt-1">
            {onboardingDocuments.filter((d) => d.verificationStatus === 'Verified').length}
          </p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by document name, employee, or type..."
          />
        </div>
        <div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 text-xs font-medium bg-white border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
          >
            <option value="All">All Verification Statuses</option>
            <option value="Pending">Pending Review</option>
            <option value="Verified">Verified</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Document Records Table */}
      {filteredDocs.length === 0 ? (
        <EmptyState
          icon={FileCheck}
          title={onboardingDocuments.length === 0 ? 'No Onboarding Documents' : 'No matching documents'}
          description={
            onboardingDocuments.length === 0
              ? 'There are currently zero submitted onboarding documents. Select a candidate in HR to onboard them or upload documents via the Employee Portal.'
              : 'Try clearing your search keyword or status filter.'
          }
          actionLabel={onboardingDocuments.length === 0 ? 'View Recruitment Applicants' : 'Clear Filters'}
          onAction={
            onboardingDocuments.length === 0
              ? () => switchRole('hr')
              : () => {
                  setSearchQuery('');
                  setSelectedStatus('All');
                }
          }
        />
      ) : (
        <>
          {/* Mobile Card Deck (< md) */}
          <div className="block md:hidden space-y-3">
            {filteredDocs.map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-violet-50 text-violet-700">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm leading-tight">
                        {doc.documentName}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">{doc.employeeName}</p>
                    </div>
                  </div>
                  <StatusBadge status={doc.verificationStatus} size="sm" />
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Category</span>
                    <span className="font-semibold text-slate-800">{doc.documentType}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Submitted</span>
                    <span className="font-medium text-slate-600">{doc.submissionDate}</span>
                  </div>
                </div>

                {doc.notes && (
                  <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 italic">
                    Note: "{doc.notes}"
                  </p>
                )}

                {/* Actions */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                  {doc.verificationStatus === 'Pending' ? (
                    <>
                      <button
                        type="button"
                        onClick={() => handleOpenReview(doc, 'Verified')}
                        className="px-3.5 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-2xs transition-colors cursor-pointer"
                      >
                        Verify
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenReview(doc, 'Rejected')}
                        className="px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors cursor-pointer"
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleOpenReview(doc, doc.verificationStatus === 'Verified' ? 'Rejected' : 'Verified')}
                      className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
                    >
                      Re-evaluate
                    </button>
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
                    <th className="px-5 py-3.5 font-semibold">Document</th>
                    <th className="px-5 py-3.5 font-semibold">Employee</th>
                    <th className="px-5 py-3.5 font-semibold">Type</th>
                    <th className="px-5 py-3.5 font-semibold">Submission Date</th>
                    <th className="px-5 py-3.5 font-semibold">Status</th>
                    <th className="px-5 py-3.5 font-semibold">HR Auditor</th>
                    <th className="px-5 py-3.5 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredDocs.map((doc) => (
                    <tr key={doc.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Doc Name & Icon */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="p-2 rounded-xl bg-violet-50 text-violet-700">
                            <FileText className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 text-xs leading-tight">
                              {doc.documentName}
                            </p>
                            <p className="text-[11px] text-slate-400">{doc.fileSize || 'PDF Document'}</p>
                          </div>
                        </div>
                      </td>

                      {/* Employee */}
                      <td className="px-5 py-4 font-semibold text-slate-800 text-xs">
                        {doc.employeeName}
                      </td>

                      {/* Type */}
                      <td className="px-5 py-4 text-xs">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium">
                          {doc.documentType}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="px-5 py-4 text-xs text-slate-500 whitespace-nowrap">
                        {doc.submissionDate}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <StatusBadge status={doc.verificationStatus} />
                      </td>

                      {/* Auditor */}
                      <td className="px-5 py-4 text-xs text-slate-500">
                        {doc.verifiedBy || 'Pending'}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {doc.verificationStatus === 'Pending' ? (
                            <>
                              <button
                                type="button"
                                onClick={() => handleOpenReview(doc, 'Verified')}
                                className="px-2.5 py-1 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-2xs transition-colors cursor-pointer"
                              >
                                Verify
                              </button>
                              <button
                                type="button"
                                onClick={() => handleOpenReview(doc, 'Rejected')}
                                className="px-2.5 py-1 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors cursor-pointer"
                              >
                                Reject
                              </button>
                            </>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleOpenReview(doc, doc.verificationStatus === 'Verified' ? 'Rejected' : 'Verified')}
                              className="px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                            >
                              Re-evaluate
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

      {/* Review Dialog */}
      {reviewDialog.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                Confirm Document {reviewDialog.status}
              </h3>
              <button
                onClick={() => setReviewDialog({ ...reviewDialog, isOpen: false })}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="mt-3 text-xs sm:text-sm text-slate-600">
              Set status for <strong>{reviewDialog.doc?.documentName}</strong> ({reviewDialog.doc?.employeeName}) to{' '}
              <strong className={reviewDialog.status === 'Verified' ? 'text-emerald-700' : 'text-rose-700'}>{reviewDialog.status}</strong>?
            </p>

            <div className="mt-4">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Auditor Notes & Verification Feedback
              </label>
              <textarea
                rows={2}
                value={reviewDialog.notes}
                onChange={(e) => setReviewDialog({ ...reviewDialog, notes: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
              />
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setReviewDialog({ ...reviewDialog, isOpen: false })}
                className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReview}
                className={`px-4 py-2 text-xs font-bold text-white rounded-xl shadow-xs cursor-pointer ${
                  reviewDialog.status === 'Verified'
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : 'bg-rose-600 hover:bg-rose-700'
                }`}
              >
                Confirm {reviewDialog.status}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
