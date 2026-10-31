import React, { useState } from 'react';
import {
  CalendarDays,
  FileText,
  UploadCloud,
  AlertCircle,
  Info,
} from 'lucide-react';

export default function LeaveRequestForm({
  onSubmit,
  onCancel,
  leaveBalances = {
    casual: 7,
    sick: 10,
    earned: 15,
    unpaid: 0,
  },
  initialData = {},
}) {
  const [formData, setFormData] = useState({
    leaveType: initialData.leaveType || 'Casual',
    startDate: initialData.startDate || '',
    endDate: initialData.endDate || '',
    daysCount: initialData.daysCount || 0,
    reason: initialData.reason || '',
    attachmentName: initialData.attachmentName || '',
    attachmentSize: initialData.attachmentSize || '',
  });

  const [formError, setFormError] = useState('');
  const [fileSelected, setFileSelected] = useState(false);

  // Auto calculate duration in days
  const handleDateChange = (field, value) => {
    const updated = { ...formData, [field]: value };
    if (updated.startDate && updated.endDate) {
      const start = new Date(updated.startDate);
      const end = new Date(updated.endDate);
      const diffTime = end - start;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

      if (diffDays > 0) {
        updated.daysCount = diffDays;
        setFormError('');
      } else {
        updated.daysCount = 0;
        setFormError('End date cannot precede the selected start date.');
      }
    } else {
      updated.daysCount = 0;
    }
    setFormData(updated);
  };

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

  const handleClearFile = () => {
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

    if (!formData.startDate) {
      setFormError('Please select a leave start date.');
      return;
    }

    if (!formData.endDate) {
      setFormError('Please select a leave end date.');
      return;
    }

    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      setFormError('End date cannot precede the selected start date.');
      return;
    }

    if (!formData.reason.trim()) {
      setFormError('Please detail the reason for your time-off request.');
      return;
    }

    if (onSubmit) {
      onSubmit({
        leaveType: formData.leaveType,
        startDate: formData.startDate,
        endDate: formData.endDate,
        daysCount: formData.daysCount || 1,
        reason: formData.reason.trim(),
        attachmentName: formData.attachmentName,
        attachmentSize: formData.attachmentSize,
      });
    }
  };

  const getBalanceForType = (type) => {
    switch (type) {
      case 'Casual':
        return leaveBalances.casual ?? 5;
      case 'Sick':
        return leaveBalances.sick ?? 8;
      case 'Earned':
        return leaveBalances.earned ?? leaveBalances.annual ?? 14;
      case 'Unpaid':
        return 'No Limit';
      default:
        return 0;
    }
  };

  const currentAvailableBalance = getBalanceForType(formData.leaveType);
  const exceedsBalance =
    typeof currentAvailableBalance === 'number' && formData.daysCount > currentAvailableBalance;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
      {formError && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
          <span>{formError}</span>
        </div>
      )}

      {/* Leave Type Selection */}
      <div>
        <label className="block font-semibold text-slate-700 mb-1">
          Leave Classification <span className="text-violet-600">*</span>
        </label>
        <select
          value={formData.leaveType}
          onChange={(e) => setFormData({ ...formData, leaveType: e.target.value })}
          className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 bg-white"
        >
          <option value="Casual">Casual Leave ({leaveBalances.casual ?? 5} Days Available)</option>
          <option value="Sick">Sick Leave ({leaveBalances.sick ?? 8} Days Available)</option>
          <option value="Earned">Earned Leave ({leaveBalances.earned ?? leaveBalances.annual ?? 14} Days Available)</option>
          <option value="Unpaid">Unpaid Leave (Loss of Pay)</option>
        </select>
      </div>

      {/* Start Date & End Date Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block font-semibold text-slate-700 mb-1">
            Start Date <span className="text-violet-600">*</span>
          </label>
          <input
            type="date"
            required
            value={formData.startDate}
            onChange={(e) => handleDateChange('startDate', e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">
            End Date <span className="text-violet-600">*</span>
          </label>
          <input
            type="date"
            required
            value={formData.endDate}
            onChange={(e) => handleDateChange('endDate', e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
          />
        </div>
      </div>

      {/* Automatically Calculated Duration */}
      <div className="p-3 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-violet-900">
          <CalendarDays className="h-4 w-4 text-violet-600" />
          <span className="font-semibold">Calculated Leave Duration:</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-bold text-sm text-violet-900">
            {formData.daysCount > 0
              ? `${formData.daysCount} Day${formData.daysCount === 1 ? '' : 's'}`
              : '0 Days (Select start & end date)'}
          </span>
          <span className="text-[11px] text-violet-700">
            (Balance: {currentAvailableBalance} {typeof currentAvailableBalance === 'number' ? 'Days' : ''})
          </span>
        </div>
      </div>

      {exceedsBalance && (
        <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center gap-2">
          <Info className="h-4 w-4 shrink-0 text-amber-600" />
          <span>
            Note: Requested duration ({formData.daysCount} days) exceeds available balance ({currentAvailableBalance} days). Excess days may be converted to Unpaid Leave.
          </span>
        </div>
      )}

      {/* Reason for Leave */}
      <div>
        <label className="block font-semibold text-slate-700 mb-1">
          Reason for Leave <span className="text-violet-600">*</span>
        </label>
        <textarea
          rows={3}
          required
          value={formData.reason}
          onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
          placeholder="State the objective, context, or circumstance for this time-off request..."
          className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
        />
      </div>

      {/* Optional Supporting Document */}
      <div>
        <label className="block font-semibold text-slate-700 mb-1 flex items-center justify-between">
          <span>Optional Supporting Document</span>
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
              onClick={handleClearFile}
              className="text-xs text-rose-600 hover:text-rose-700 font-medium cursor-pointer"
            >
              Remove
            </button>
          </div>
        ) : (
          <div className="p-4 border-2 border-dashed border-slate-200 rounded-xl text-center bg-slate-50/50">
            <UploadCloud className="h-6 w-6 text-violet-600 mx-auto mb-1" />
            <p className="font-semibold text-slate-700 text-xs">
              Upload medical certificate, travel itinerary, or justification
            </p>
            <label className="mt-2 inline-block px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 text-xs font-semibold cursor-pointer hover:bg-slate-50 shadow-2xs">
              <span>Choose Document</span>
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

      {/* Action Buttons */}
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
          Submit Leave Request
        </button>
      </div>
    </form>
  );
}
