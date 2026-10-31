import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  UploadCloud,
  ArrowLeft,
  ShieldCheck,
  Info,
  CheckCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import DocumentUploadForm from './components/DocumentUploadForm';
import EmployeeEmptyState from './components/EmployeeEmptyState';

export default function UploadDocument() {
  const navigate = useNavigate();
  const { currentEmployee, submitDocument } = useApp();

  const employee = currentEmployee;

  if (!employee) {
    return (
      <div className="space-y-6">
        <div className="pb-2 border-b border-slate-200/80">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Upload Document
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Submit compliance verification documents to HR.
          </p>
        </div>

        <EmployeeEmptyState
          heading="No Employee Record Found"
          description="Please contact your HR administrator."
        />
      </div>
    );
  }

  const handleFormSubmit = (docData) => {
    submitDocument(docData);
    navigate('/employee/onboarding');
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link
          to="/employee/onboarding"
          className="hover:text-violet-700 flex items-center gap-1 font-medium transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Onboarding Documents</span>
        </Link>
        <span>/</span>
        <span className="font-semibold text-slate-800">Upload Document</span>
      </div>

      {/* Header */}
      <div className="pb-2 border-b border-slate-200/80">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Submit Compliance Document
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Upload Aadhaar, PAN, degree certificate, or bank verification proof for HR audit.
        </p>
      </div>

      {/* Main Grid: Form (2 cols) + Verification Guidelines (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs">
          <h3 className="text-base font-bold text-slate-900 mb-4 pb-3 border-b border-slate-100">
            Document Upload Form
          </h3>

          <DocumentUploadForm
            onSubmit={handleFormSubmit}
            onCancel={() => navigate('/employee/onboarding')}
          />
        </div>

        {/* Verification Guidelines Card */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 text-violet-700 font-bold text-sm">
              <ShieldCheck className="h-4 w-4" />
              <span>Mandatory Documents</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              To complete statutory employment compliance, ensure you provide:
            </p>
            <ul className="space-y-2 text-xs text-slate-700">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-3.5 w-3.5 text-violet-600 mt-0.5 shrink-0" />
                <span><strong>Aadhaar Card:</strong> Front & back clear scan.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-3.5 w-3.5 text-violet-600 mt-0.5 shrink-0" />
                <span><strong>PAN Card:</strong> National tax identification card.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-3.5 w-3.5 text-violet-600 mt-0.5 shrink-0" />
                <span><strong>Education:</strong> Degree or diploma certificate.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-3.5 w-3.5 text-violet-600 mt-0.5 shrink-0" />
                <span><strong>Bank Proof:</strong> Cancelled cheque with printed name & IFSC.</span>
              </li>
            </ul>
          </div>

          <div className="bg-slate-50/80 rounded-2xl border border-slate-200/80 p-5 text-xs text-slate-600 space-y-2.5">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <Info className="h-4 w-4 text-violet-600" />
              <span>Audit Guidelines</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Documents must be legible, uncropped, and in color where applicable.
              Accepted file types: <strong>PDF, JPG, PNG</strong> up to 10MB each.
            </p>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Auditor turnaround time is typically <strong>1-2 business days</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
