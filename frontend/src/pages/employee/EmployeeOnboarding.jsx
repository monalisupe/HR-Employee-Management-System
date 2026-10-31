import React, { useState } from 'react';
import {
  FileCheck,
  UploadCloud,
  CheckCircle,
  Clock,
  XCircle,
  FileText,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import StatusBadge from '../../components/common/StatusBadge';
import EmptyState from '../../components/common/EmptyState';

export default function EmployeeOnboarding() {
  const {
    currentEmployee,
    onboardingDocuments,
    submitDocument,
    createQuickDemoEmployee,
    switchRole,
  } = useApp();

  const employee = currentEmployee;

  // Filter documents for this employee
  const myDocs = employee
    ? onboardingDocuments.filter((d) => d.employeeId === employee.id)
    : [];

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [docForm, setDocForm] = useState({
    documentName: 'Government_Photo_ID.pdf',
    documentType: 'Identity Proof',
    fileSize: '1.2 MB',
  });

  const [mockFileChosen, setMockFileChosen] = useState(false);

  const handleFakeFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setDocForm({
        ...docForm,
        documentName: file.name,
        fileSize: `${Math.round(file.size / 1024)} KB`,
      });
      setMockFileChosen(true);
    }
  };

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    submitDocument({
      documentName: docForm.documentName,
      documentType: docForm.documentType,
      fileSize: docForm.fileSize,
    });
    setIsUploadModalOpen(false);
    setMockFileChosen(false);
  };

  if (!employee) {
    return (
      <EmptyState
        icon={FileCheck}
        title="No Active Employee Record"
        description="There is currently no active employee logged into this session."
        actionLabel="Create Demo Employee"
        onAction={createQuickDemoEmployee}
      />
    );
  }

  const checklistItems = [
    { title: 'Personal Profile Details', status: 'Completed', desc: 'Contact details, emergency contacts, and personal address.' },
    {
      title: 'Identity Verification Document',
      status: myDocs.some((d) => d.documentType === 'Identity Proof' && d.verificationStatus === 'Verified')
        ? 'Verified'
        : myDocs.some((d) => d.documentType === 'Identity Proof')
        ? 'Pending Review'
        : 'Required',
      desc: 'Government passport, national identity card, or driver license.',
    },
    {
      title: 'Signed Offer Letter & Agreement',
      status: myDocs.some((d) => d.documentType === 'Offer Letter' && d.verificationStatus === 'Verified')
        ? 'Verified'
        : myDocs.some((d) => d.documentType === 'Offer Letter')
        ? 'Pending Review'
        : 'Required',
      desc: 'Executed contract agreement and confidentiality declaration.',
    },
    {
      title: 'Tax Declaration & Banking Details',
      status: myDocs.some((d) => d.documentType === 'Tax Form' && d.verificationStatus === 'Verified')
        ? 'Verified'
        : myDocs.some((d) => d.documentType === 'Tax Form')
        ? 'Pending Review'
        : 'Required',
      desc: 'W-4 / W-9 or direct deposit banking instructions.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Onboarding Checklist & Document Portal
            </h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-violet-100 text-violet-800">
              {employee.onboardingProgress || 0}% Complete
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            Submit required joining documents and review verification status from HR auditors.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsUploadModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-violet-600 hover:bg-violet-700 rounded-xl shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <UploadCloud className="h-4 w-4" />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Checklist Progress */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">Onboarding Milestones</h3>
            <p className="text-xs text-slate-500">Progress updates as HR verifies each document</p>
          </div>
          <span className="text-sm font-bold text-violet-700">{employee.onboardingProgress || 0}%</span>
        </div>

        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-violet-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${employee.onboardingProgress || 0}%` }}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {checklistItems.map((item, idx) => (
            <div key={idx} className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 flex items-start justify-between gap-3">
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-slate-800">{item.title}</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">{item.desc}</p>
              </div>
              <span
                className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full shrink-0 ${
                  item.status === 'Completed' || item.status === 'Verified'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : item.status === 'Pending Review'
                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Submitted Documents Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Submitted Documents</h3>
            <p className="text-xs text-slate-500">Audit trail of submitted verification files</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
            {myDocs.length} Total
          </span>
        </div>

        {myDocs.length === 0 ? (
          <div className="py-10 text-center text-xs text-slate-400">
            <FileText className="h-8 w-8 mx-auto text-slate-300 mb-2" />
            <p className="font-semibold text-slate-600">No documents submitted yet</p>
            <p className="mt-1 text-slate-400">
              Upload your signed offer letter or identity proofs to submit for HR review.
            </p>
            <button
              type="button"
              onClick={() => setIsUploadModalOpen(true)}
              className="mt-3 px-3.5 py-1.5 text-xs font-semibold text-white bg-violet-600 hover:bg-violet-700 rounded-xl cursor-pointer"
            >
              Upload Document Now
            </button>
          </div>
        ) : (
          <>
            {/* Mobile Card Deck (< md) */}
            <div className="block md:hidden divide-y divide-slate-100 p-4 space-y-3">
              {myDocs.map((doc) => (
                <div key={doc.id} className="pt-3 first:pt-0 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-violet-600" />
                      <span className="font-bold text-slate-900 text-xs sm:text-sm">{doc.documentName}</span>
                    </div>
                    <StatusBadge status={doc.verificationStatus} size="sm" />
                  </div>
                  <div className="text-xs text-slate-500 flex items-center justify-between">
                    <span>{doc.documentType} • {doc.fileSize}</span>
                    <span>{doc.submissionDate}</span>
                  </div>
                  {doc.notes && (
                    <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg italic">
                      Auditor Note: {doc.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Desktop Table (>= md) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50/80 text-xs uppercase tracking-wider text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-3.5 font-semibold">Document Name</th>
                    <th className="px-5 py-3.5 font-semibold">Type</th>
                    <th className="px-5 py-3.5 font-semibold">Submitted On</th>
                    <th className="px-5 py-3.5 font-semibold">Verification Status</th>
                    <th className="px-5 py-3.5 font-semibold">HR Auditor Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {myDocs.map((doc) => (
                    <tr key={doc.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="p-2 rounded-xl bg-violet-50 text-violet-700">
                            <FileText className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 text-xs sm:text-sm">
                              {doc.documentName}
                            </p>
                            <p className="text-[11px] text-slate-400">{doc.fileSize}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-xs">
                        <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium">
                          {doc.documentType}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-xs text-slate-600 whitespace-nowrap">
                        {doc.submissionDate}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <StatusBadge status={doc.verificationStatus} />
                      </td>
                      <td className="px-5 py-4 text-xs text-slate-500 italic max-w-xs truncate">
                        {doc.notes || (doc.verificationStatus === 'Pending' ? 'Pending HR review' : 'Verified')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Upload Onboarding Document</h3>
              <button onClick={() => setIsUploadModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleUploadSubmit} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Document Category *</label>
                <select
                  value={docForm.documentType}
                  onChange={(e) => setDocForm({ ...docForm, documentType: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
                >
                  <option value="Identity Proof">Identity Proof (Passport / ID)</option>
                  <option value="Offer Letter">Signed Offer Letter</option>
                  <option value="Tax Form">Tax & Banking Form</option>
                  <option value="Educational Certificate">Educational Degree Certificate</option>
                  <option value="Relieving Letter">Previous Relieving Letter</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Document Title / File Name *</label>
                <input
                  type="text"
                  required
                  value={docForm.documentName}
                  onChange={(e) => setDocForm({ ...docForm, documentName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
                />
              </div>

              <div className="p-4 border-2 border-dashed border-slate-200 rounded-xl text-center bg-slate-50/50">
                <UploadCloud className="h-7 w-7 text-violet-600 mx-auto mb-2" />
                <p className="font-semibold text-slate-800 text-xs">Select or Drop file here</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Supports PDF, PNG, JPG (up to 10MB)</p>
                <label className="mt-3 inline-block px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 font-semibold cursor-pointer hover:bg-slate-50 shadow-2xs">
                  <span>Browse File</span>
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                    onChange={handleFakeFileChange}
                    className="hidden"
                  />
                </label>
              </div>

              {mockFileChosen && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 shrink-0 text-emerald-600" />
                  <span>File "{docForm.documentName}" selected. Click submit to send to HR.</span>
                </div>
              )}

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-3.5 py-2 text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-violet-600 hover:bg-violet-700 rounded-xl font-bold shadow-xs cursor-pointer"
                >
                  Submit for Verification
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
