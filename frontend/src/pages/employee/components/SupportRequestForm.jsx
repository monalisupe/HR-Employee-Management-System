import React, { useState } from 'react';
import {
  FileText,
  UploadCloud,
  AlertCircle,
  Clock,
  X,
  Flag,
} from 'lucide-react';

export default function SupportRequestForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    category: 'Salary',
    subject: '',
    description: '',
    priority: 'Medium',
    attachmentName: '',
    attachmentSize: '',
  });

  const [formError, setFormError] = useState('');
  const [fileSelected, setFileSelected] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        attachmentName: file.name,
        attachmentSize: `${Math.round(file.size / 1024)} KB`,
      }));
      setFileSelected(true);
    }
  };

  const handleRemoveFile = () => {
    setFormData((prev) => ({
      ...prev,
      attachmentName: '',
      attachmentSize: '',
    }));
    setFileSelected(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.subject.trim()) {
      setFormError('Please enter a ticket subject.');
      return;
    }

    if (!formData.description.trim()) {
      setFormError('Please describe your query or problem in detail.');
      return;
    }

    if (onSubmit) {
      onSubmit({
        category: formData.category,
        subject: formData.subject.trim(),
        description: formData.description.trim(),
        priority: formData.priority,
        attachmentName: formData.attachmentName,
        attachmentSize: formData.attachmentSize,
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

      {/* Category & Priority Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block font-semibold text-slate-700 mb-1">
            Request Category <span className="text-violet-600">*</span>
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 bg-white font-medium"
          >
            <option value="Salary">Salary (Payroll, Deductions, Bonus)</option>
            <option value="Attendance">Attendance (Timesheet, Clock-in, Overtime)</option>
            <option value="Leave">Leave (Balances, Leave Credits, Policy)</option>
            <option value="Technical Issue">Technical Issue (Portal Access, Equipment)</option>
            <option value="General HR Query">General HR Query (Benefits, Policy, Letter)</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">
            Priority Level <span className="text-violet-600">*</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {['Low', 'Medium', 'High'].map((p) => {
              const isSelected = formData.priority === p;
              const colorClasses =
                p === 'High'
                  ? isSelected
                    ? 'bg-rose-600 text-white border-rose-600 shadow-2xs'
                    : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                  : p === 'Medium'
                  ? isSelected
                    ? 'bg-amber-600 text-white border-amber-600 shadow-2xs'
                    : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                  : isSelected
                  ? 'bg-slate-700 text-white border-slate-700 shadow-2xs'
                  : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200';

              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => setFormData({ ...formData, priority: p })}
                  className={`py-2 px-2 text-xs font-bold rounded-xl border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${colorClasses}`}
                >
                  <Flag className="h-3 w-3" />
                  <span>{p}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Subject */}
      <div>
        <label className="block font-semibold text-slate-700 mb-1">
          Subject / Brief Summary <span className="text-violet-600">*</span>
        </label>
        <input
          type="text"
          required
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          placeholder="e.g. Discrepancy in tax deduction for March payroll"
          className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block font-semibold text-slate-700 mb-1">
          Detailed Description <span className="text-violet-600">*</span>
        </label>
        <textarea
          rows={4}
          required
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Provide explicit context, relevant dates, employee ID reference, and what resolution you require..."
          className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
        />
      </div>

      {/* Optional Attachment */}
      <div>
        <label className="block font-semibold text-slate-700 mb-1 flex items-center justify-between">
          <span>Optional Attachment</span>
          <span className="text-[11px] font-normal text-slate-400">PDF, JPG, PNG (Max 10MB)</span>
        </label>

        {formData.attachmentName ? (
          <div className="p-3 rounded-xl border border-violet-200 bg-violet-50/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-violet-600" />
              <div>
                <p className="font-semibold text-slate-800 text-xs">{formData.attachmentName}</p>
                <p className="text-[10px] text-slate-400">{formData.attachmentSize}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleRemoveFile}
              className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="p-4 border-2 border-dashed border-slate-200 rounded-xl text-center bg-slate-50/50">
            <UploadCloud className="h-6 w-6 text-violet-600 mx-auto mb-1" />
            <p className="font-semibold text-slate-700 text-xs">
              Attach payslip copy, attendance screenshot, or document
            </p>
            <label className="mt-2 inline-block px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 text-xs font-semibold cursor-pointer hover:bg-slate-50 shadow-2xs">
              <span>Choose File</span>
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

      {/* Status Workflow Hint */}
      <div className="p-3 bg-violet-50/60 border border-violet-100 rounded-xl text-[11px] text-violet-900 leading-normal flex items-start gap-2">
        <Clock className="h-4 w-4 shrink-0 text-violet-600 mt-0.5" />
        <span>
          Support request lifecycle: Initially <strong>Open</strong> upon submission, moves to <strong>In Progress</strong> during HR team investigation, and transitions to <strong>Resolved</strong> once addressed.
        </span>
      </div>

      {/* Form Action Buttons */}
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
          Submit HR Support Request
        </button>
      </div>
    </form>
  );
}
