import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileCheck,
  UploadCloud,
  FileText,
  Search,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import StatusBadge from '../../components/common/StatusBadge';
import EmployeeEmptyState from './components/EmployeeEmptyState';

export default function OnboardingDocuments() {
  const navigate = useNavigate();
  const { currentEmployee, onboardingDocuments } = useApp();

  const employee = currentEmployee;

  const [activeFilter, setActiveFilter] = useState('All'); // 'All' | 'Verified' | 'Pending' | 'Rejected'
  const [searchTerm, setSearchTerm] = useState('');

  if (!employee) {
    return (
      <div className="space-y-6">
        <div className="pb-2 border-b border-slate-200/80">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Onboarding Documents
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Submit required joining documents and review verification status from HR auditors.
          </p>
        </div>

        <EmployeeEmptyState
          heading="No Employee Record Found"
          description="Please contact your HR administrator."
        />
      </div>
    );
  }

  // Filter documents for this employee
  const myDocs = onboardingDocuments.filter((d) => d.employeeId === employee.id);

  const filteredDocs = myDocs.filter((d) => {
    const matchesFilter =
      activeFilter === 'All' ||
      d.verificationStatus.toLowerCase() === activeFilter.toLowerCase();
    const matchesSearch =
      d.documentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.documentType.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Calculate compliance milestones
  const complianceMilestones = [
    {
      title: 'Aadhaar (Identity Proof)',
      type: 'Aadhaar',
      status: myDocs.some((d) => (d.documentType === 'Aadhaar' || d.documentType === 'Identity Proof') && d.verificationStatus === 'Verified')
        ? 'Verified'
        : myDocs.some((d) => d.documentType === 'Aadhaar' || d.documentType === 'Identity Proof')
        ? 'Pending Review'
        : 'Required',
      desc: 'National government identity verification document.',
    },
    {
      title: 'PAN Card',
      type: 'PAN',
      status: myDocs.some((d) => d.documentType === 'PAN' && d.verificationStatus === 'Verified')
        ? 'Verified'
        : myDocs.some((d) => d.documentType === 'PAN')
        ? 'Pending Review'
        : 'Required',
      desc: 'Permanent Account Number for corporate tax compliance.',
    },
    {
      title: 'Education Certificate',
      type: 'Education Certificate',
      status: myDocs.some((d) => (d.documentType === 'Education Certificate' || d.documentType === 'Educational Certificate') && d.verificationStatus === 'Verified')
        ? 'Verified'
        : myDocs.some((d) => d.documentType === 'Education Certificate' || d.documentType === 'Educational Certificate')
        ? 'Pending Review'
        : 'Required',
      desc: 'Highest degree or diploma certificate.',
    },
    {
      title: 'Bank Details / Cancelled Cheque',
      type: 'Bank Details',
      status: myDocs.some((d) => (d.documentType === 'Bank Details' || d.documentType === 'Tax Form') && d.verificationStatus === 'Verified')
        ? 'Verified'
        : myDocs.some((d) => d.documentType === 'Bank Details' || d.documentType === 'Tax Form')
        ? 'Pending Review'
        : 'Required',
      desc: 'Direct deposit payroll banking authorization.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Onboarding Documents & Compliance
            </h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-violet-100 text-violet-800">
              {employee.onboardingProgress || 0}% Complete
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            Submit mandated statutory documents and track verification approval from HR auditors.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/employee/upload-document')}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-violet-600 hover:bg-violet-700 rounded-xl shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <UploadCloud className="h-4 w-4" />
          <span>Upload Document</span>
        </button>
      </div>

      {/* 2. Onboarding Milestones Checklist */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">Compliance Milestones</h3>
            <p className="text-xs text-slate-500">
              Audit status updates as HR verifies each statutory document
            </p>
          </div>
          <span className="text-sm font-bold text-violet-700">
            {employee.onboardingProgress || 0}%
          </span>
        </div>

        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-violet-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${employee.onboardingProgress || 0}%` }}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {complianceMilestones.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 flex items-start justify-between gap-3"
            >
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-slate-800">{item.title}</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">{item.desc}</p>
              </div>
              <span
                className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full shrink-0 ${
                  item.status === 'Verified'
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

      {/* 3. Filter & Search Controls */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl w-full sm:w-auto overflow-x-auto">
          {['All', 'Verified', 'Pending', 'Rejected'].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setActiveFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                activeFilter === status
                  ? 'bg-white text-violet-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by document name or type..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
          />
        </div>
      </div>

      {/* 4. Submitted Documents Table */}
      {filteredDocs.length === 0 ? (
        <EmployeeEmptyState
          icon={FileCheck}
          heading={myDocs.length === 0 ? 'No Documents Uploaded' : 'No Matching Documents'}
          description={
            myDocs.length === 0
              ? 'Upload your Aadhaar, PAN, degree certificate, or bank details to start the verification process.'
              : 'No uploaded files match the selected filter criteria.'
          }
          actionLabel="Upload Document"
          onAction={() => navigate('/employee/upload-document')}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900">
              Uploaded Document Records ({filteredDocs.length})
            </h3>
            <span className="text-xs text-slate-500">
              {myDocs.filter((d) => d.verificationStatus === 'Pending').length} Pending Verification
            </span>
          </div>

          {/* Mobile Card Deck (< md) */}
          <div className="block md:hidden divide-y divide-slate-100 p-4 space-y-3">
            {filteredDocs.map((doc) => (
              <div key={doc.id} className="pt-3 first:pt-0 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-violet-600" />
                    <span className="font-bold text-slate-900 text-xs sm:text-sm">
                      {doc.documentName}
                    </span>
                  </div>
                  <StatusBadge status={doc.verificationStatus} size="sm" />
                </div>
                <div className="text-xs text-slate-500 flex items-center justify-between">
                  <span>{doc.documentType} • {doc.fileSize}</span>
                  <span>{doc.submissionDate}</span>
                </div>
                {doc.description && (
                  <p className="text-xs text-slate-500 italic bg-slate-50 p-2 rounded-lg">
                    "{doc.description}"
                  </p>
                )}
                {doc.notes && (
                  <p className="text-xs text-violet-700 bg-violet-50/50 p-2 rounded-lg italic">
                    HR Note: {doc.notes}
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
                {filteredDocs.map((doc) => (
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
                      {doc.notes ||
                        (doc.verificationStatus === 'Pending'
                          ? 'Awaiting HR audit'
                          : 'Document verified')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
