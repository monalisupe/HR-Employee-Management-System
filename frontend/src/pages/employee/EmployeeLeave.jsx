import React, { useState } from 'react';
import {
  CalendarDays,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import StatusBadge from '../../components/common/StatusBadge';
import EmptyState from '../../components/common/EmptyState';

export default function EmployeeLeave() {
  const {
    currentEmployee,
    leaveRequests,
    submitLeaveRequest,
    createQuickDemoEmployee,
    switchRole,
  } = useApp();

  const employee = currentEmployee;

  // Filter requests for active employee
  const myLeaves = employee
    ? leaveRequests.filter((l) => l.employeeId === employee.id)
    : [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    leaveType: 'Annual Leave',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    daysCount: 3,
    reason: '',
  });

  const [formError, setFormError] = useState('');

  // Auto calculate days when dates change
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
        setFormError('End date cannot be prior to start date.');
      }
    }
    setFormData(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      setFormError('End date cannot be before start date.');
      return;
    }
    if (!formData.reason.trim()) {
      setFormError('Please provide a reason for the leave request.');
      return;
    }

    submitLeaveRequest({
      leaveType: formData.leaveType,
      startDate: formData.startDate,
      endDate: formData.endDate,
      daysCount: formData.daysCount,
      reason: formData.reason,
    });

    setIsModalOpen(false);
    setFormData({
      leaveType: 'Annual Leave',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      daysCount: 3,
      reason: '',
    });
  };

  if (!employee) {
    return (
      <EmptyState
        icon={CalendarDays}
        title="No Active Employee Record"
        description="There is currently no active employee logged into this session."
        actionLabel="Create Demo Employee"
        onAction={createQuickDemoEmployee}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Leave & Time-Off Management
            </h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              {employee.annualLeaveBalance || 15} Days Remaining
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            Submit leave requests, track approvals, and view your remaining balance.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Request Leave</span>
        </button>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
          <span className="text-xs font-semibold uppercase text-slate-400">Annual / Paid Leave</span>
          <p className="text-3xl font-bold text-emerald-700 mt-2">
            {employee.annualLeaveBalance !== undefined ? employee.annualLeaveBalance : 15}
            <span className="text-sm text-slate-400 font-normal ml-1">Days</span>
          </p>
          <span className="text-[11px] text-slate-500 mt-1 block">Accrued paid time off</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
          <span className="text-xs font-semibold uppercase text-slate-400">Sick & Medical Leave</span>
          <p className="text-3xl font-bold text-blue-700 mt-2">
            {employee.sickLeaveBalance !== undefined ? employee.sickLeaveBalance : 10}
            <span className="text-sm text-slate-400 font-normal ml-1">Days</span>
          </p>
          <span className="text-[11px] text-slate-500 mt-1 block">Medical and doctor visits</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
          <span className="text-xs font-semibold uppercase text-slate-400">Casual Leave</span>
          <p className="text-3xl font-bold text-violet-700 mt-2">
            {employee.casualLeaveBalance !== undefined ? employee.casualLeaveBalance : 7}
            <span className="text-sm text-slate-400 font-normal ml-1">Days</span>
          </p>
          <span className="text-[11px] text-slate-500 mt-1 block">Short personal days</span>
        </div>
      </div>

      {/* Leave Requests Table */}
      {myLeaves.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title="No Leave Requests Submitted"
          description="You currently have zero leave requests on record. Submit a request above to send it for HR approval."
          actionLabel="Submit First Leave Request"
          onAction={() => setIsModalOpen(true)}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900">My Leave Application History</h3>
            <span className="text-xs text-slate-500">{myLeaves.length} Total Submissions</span>
          </div>

          {/* Mobile Card Deck (< md) */}
          <div className="block md:hidden divide-y divide-slate-100 p-4 space-y-3">
            {myLeaves.map((req) => (
              <div key={req.id} className="pt-3 first:pt-0 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">{req.leaveType}</span>
                  <StatusBadge status={req.status} size="sm" />
                </div>
                <div className="text-xs text-slate-600 flex items-center justify-between">
                  <span>{req.startDate} to {req.endDate}</span>
                  <span className="font-semibold text-slate-900">{req.daysCount} Day{req.daysCount === 1 ? '' : 's'}</span>
                </div>
                {req.reason && (
                  <p className="text-xs text-slate-500 bg-slate-50 p-2 rounded-lg italic">
                    "{req.reason}"
                  </p>
                )}
                {req.hrComment && (
                  <p className="text-[11px] text-violet-700 font-medium">
                    HR Comment: {req.hrComment}
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
                  <th className="px-5 py-3.5 font-semibold">Leave Type</th>
                  <th className="px-5 py-3.5 font-semibold">Start Date</th>
                  <th className="px-5 py-3.5 font-semibold">End Date</th>
                  <th className="px-5 py-3.5 font-semibold">Duration</th>
                  <th className="px-5 py-3.5 font-semibold">Reason</th>
                  <th className="px-5 py-3.5 font-semibold">HR Status</th>
                  <th className="px-5 py-3.5 font-semibold">HR Review Feedback</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {myLeaves.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-4 font-bold text-slate-900 text-xs sm:text-sm">
                      {req.leaveType}
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-600 whitespace-nowrap">
                      {req.startDate}
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-600 whitespace-nowrap">
                      {req.endDate}
                    </td>
                    <td className="px-5 py-4 text-xs font-semibold text-slate-800 whitespace-nowrap">
                      {req.daysCount} day{req.daysCount === 1 ? '' : 's'}
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-600 max-w-xs truncate" title={req.reason}>
                      {req.reason}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <StatusBadge status={req.status} />
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-500 italic">
                      {req.hrComment || (req.status === 'Pending' ? 'Awaiting HR decision' : 'No remarks')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Submit Leave Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Submit Time-Off Request</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">✕</button>
            </div>

            {formError && (
              <div className="mt-3 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Leave Classification *</label>
                <select
                  value={formData.leaveType}
                  onChange={(e) => setFormData({ ...formData, leaveType: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                >
                  <option value="Annual Leave">Annual Leave (Vacation)</option>
                  <option value="Sick Leave">Sick / Medical Leave</option>
                  <option value="Casual Leave">Casual Leave</option>
                  <option value="Maternity / Paternity">Maternity / Paternity Leave</option>
                  <option value="Unpaid Leave">Unpaid Leave</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Start Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => handleDateChange('startDate', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">End Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.endDate}
                    onChange={(e) => handleDateChange('endDate', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-xs text-emerald-900 flex items-center justify-between">
                <span>Calculated Duration:</span>
                <span className="font-bold text-sm">{formData.daysCount} Day{formData.daysCount === 1 ? '' : 's'}</span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Reason for Leave *</label>
                <textarea
                  rows={3}
                  required
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  placeholder="Detail the purpose of your time-off request..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-2 text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl font-bold shadow-xs cursor-pointer"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
