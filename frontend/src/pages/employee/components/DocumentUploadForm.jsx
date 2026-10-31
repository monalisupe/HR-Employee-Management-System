import React, { useState } from 'react';
import {
  UploadCloud,
  FileText,
  AlertCircle,
  Calendar,
  ShieldCheck,
  X,
} from 'lucide-react';

export default function DocumentUploadForm({ onSubmit, onCancel }) {
  const todayDate = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    documentType: 'Aadhaar',
    documentName: '',
    description: '',
    submissionDate: todayDate,
    fileSize: '',
  });

  const [formError, setFormError] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const handleTypeChange = (newType) => {
    setFormData((prev) => ({
      ...prev,
      documentType: newType,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setFormData((prev) => ({
        ...prev,
        documentName: file.name,
        fileSize: `${Math.round(file.size / 1024)} KB`,
      }));
      setFormError('');
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFormData((prev) => ({
      ...prev,
      fileSize: '',
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.documentName.trim()) {
      setFormError('Please enter a document name.');
      return;
    }

    if (!selectedFile && !formData.fileSize) {
      setFormError('Please select a file to upload (PDF, JPG, or PNG).');
      return;
    }

    if (onSubmit) {
      onSubmit({
        documentType: formData.documentType,
        documentName: formData.documentName.trim(),
        description: formData.description.trim(),
        submissionDate: formData.submissionDate,
        fileSize: formData.fileSize || '1.0 MB',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
      {formError && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
          <span>{formError}</span>
        </div>
      )}

      {/* Document Type Selection */}
      <div>
        <label className="block font-semibold text-slate-700 mb-1">
          Document Classification <span className="text-violet-600">*</span>
        </label>
        <select
          value={formData.documentType}
          onChange={(e) => handleTypeChange(e.target.value)}
          className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 bg-white font-medium"
        >
          <option value="Aadhaar">Aadhaar (National Identity Proof)</option>
          <option value="PAN">PAN (Permanent Account Number)</option>
          <option value="Education Certificate">Education Certificate (Degree / Diploma)</option>
          <option value="Experience Letter">Experience Letter (Previous Employer)</option>
          <option value="Bank Details">Bank Details (Cancelled Cheque / Passbook)</option>
          <option value="Other">Other Compliance Document</option>
        </select>
      </div>

      {/* Document Name */}
      <div>
        <label className="block font-semibold text-slate-700 mb-1">
          Document File Name / Title <span className="text-violet-600">*</span>
        </label>
        <input
          type="text"
          required
          value={formData.documentName}
          onChange={(e) => setFormData({ ...formData, documentName: e.target.value })}
          placeholder="e.g. Aadhaar_Card_Front_Back.pdf"
          className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
        />
      </div>

      {/* File Upload Box */}
      <div>
        <label className="block font-semibold text-slate-700 mb-1">
          File Attachment (PDF, JPG, PNG) <span className="text-violet-600">*</span>
        </label>

        {formData.fileSize ? (
          <div className="p-3.5 rounded-xl border border-violet-200 bg-violet-50/50 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-violet-100 text-violet-700">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <p className="font-bold text-slate-900 text-xs sm:text-sm">{formData.documentName}</p>
                <p className="text-[11px] text-slate-500">{formData.fileSize} • Ready to submit</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleRemoveFile}
              className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-white cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="p-5 border-2 border-dashed border-slate-200 rounded-xl text-center bg-slate-50/50 hover:bg-slate-50 transition-colors">
            <UploadCloud className="h-8 w-8 text-violet-600 mx-auto mb-2" />
            <p className="font-bold text-slate-800 text-xs sm:text-sm">
              Click to select or drag and drop file here
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              Supports high-resolution PDF, JPG, and PNG scans (up to 10MB)
            </p>
            <label className="mt-3 inline-block px-4 py-1.5 bg-white border border-slate-200 rounded-xl text-slate-700 text-xs font-semibold cursor-pointer hover:bg-slate-50 shadow-2xs">
              <span>Browse Computer</span>
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>
        )}
      </div>

      {/* Optional Description / Notes */}
      <div>
        <label className="block font-semibold text-slate-700 mb-1">
          Description & Notes for HR Auditor
        </label>
        <textarea
          rows={3}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Include any remarks, certificate dates, or document identification numbers..."
          className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
        />
      </div>

      {/* Automatic Submission Date */}
      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-slate-400" />
          <span>Automatic Submission Date:</span>
        </div>
        <span className="font-bold text-slate-800">{formData.submissionDate}</span>
      </div>

      {/* Notice on Verification Status */}
      <div className="p-3 bg-violet-50/60 border border-violet-100 rounded-xl text-[11px] text-violet-900 leading-normal flex items-start gap-2">
        <ShieldCheck className="h-4 w-4 shrink-0 text-violet-600 mt-0.5" />
        <span>
          Uploaded records are cataloged under <strong>Pending</strong> status until verified and authorized by HR compliance officers.
        </span>
      </div>

      {/* Submit Controls */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 font-medium cursor-pointer"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="px-5 py-2 text-white bg-violet-600 hover:bg-violet-700 rounded-xl font-bold shadow-xs transition-colors cursor-pointer"
        >
          Submit Document for HR Verification
        </button>
      </div>
    </form>
  );
}
