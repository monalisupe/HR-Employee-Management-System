import React, { useState } from 'react';
import {
  CalendarDays,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  Search,
  User,
  AlertCircle,
  Check,
  X,
  MessageSquare,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import SearchBar from '../../components/common/SearchBar';
import StatusBadge from '../../components/common/StatusBadge';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import EmptyState from '../../components/common/EmptyState';

export default function LeaveManagement() {
  const {
    leaveRequests,
    departments,
    updateLeaveStatus,
    switchRole,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Confirmation dialogs
  const [actionDialog, setActionDialog] = useState({
    isOpen: false,
    request: null,
    action: 'Approved', // 'Approved' | 'Rejected'
    comment: '',
  });

  const filteredLeaves = leaveRequests.filter((req) => {
    const matchesSearch =
      req.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.leaveType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (req.reason && req.reason.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesDept = selectedDept === 'All' || req.department === selectedDept;
    const matchesStatus = selectedStatus === 'All' || req.status === selectedStatus;

    return matchesSearch && matchesDept && matchesStatus;
  });

  const handleOpenAction = (request, action) => {
    setActionDialog({
      isOpen: true,
      request,
      action,
      comment: action === 'Approved' ? 'Approved by HR Operations.' : 'Request cannot be accommodated at this time.',
    });
  };

  const handleConfirmAction = () => {
    if (!actionDialog.request) return;
    updateLeaveStatus(actionDialog.request.id, actionDialog.action, actionDialog.comment);
    setActionDialog({ isOpen: false, request: null, action: 'Approved', comment: '' });
  };

  const pendingCount = leaveRequests.filter((r) => r.status === 'Pending').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Leave & Absence Management
            </h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-violet-100 text-violet-800">
              {pendingCount} Pending Review
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            Adjudicate employee time-off, sick days, and annual leave requests with instant quota sync.
          </p>
        </div>

        {leaveRequests.length === 0 && (
          <button
            type="button"
            onClick={() => switchRole('employee')}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-colors cursor-pointer self-start sm:self-auto"
          >
            <span>Switch to Employee to Request Leave</span>
          </button>
        )}
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search by employee name, leave type, or reason..."
            />
          </div>

          <div className="flex items-center gap-3">
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="px-3 py-2 text-xs font-medium bg-white border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
            >
              <option value="All">All Departments</option>
              {departments.map((d) => (
                <option key={d.id} value={d.name}>{d.name}</option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 text-xs font-medium bg-white border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending Review</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 pt-1 text-xs">
          <span className="font-semibold text-slate-700 mr-1">Status:</span>
          {['All', 'Pending', 'Approved', 'Rejected'].map((status) => {
            const count = status === 'All' ? leaveRequests.length : leaveRequests.filter((r) => r.status === status).length;
            const isSelected = selectedStatus === status;
            return (
              <button
                key={status}
                type="button"
                onClick={() => setSelectedStatus(status)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  isSelected ? 'bg-violet-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
                }`}
              >
                {status} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Leave Requests Table & Mobile Cards */}
      {filteredLeaves.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title={leaveRequests.length === 0 ? 'No Leave Requests' : 'No matching requests'}
          description={
            leaveRequests.length === 0
              ? 'There are currently zero leave requests in local state. Employees can submit leave requests from the Employee Portal.'
              : 'Try clearing your search query or filters.'
          }
          actionLabel={leaveRequests.length === 0 ? 'Simulate as Employee' : 'Clear Filters'}
          onAction={
            leaveRequests.length === 0
              ? () => switchRole('employee')
              : () => {
                  setSearchQuery('');
                  setSelectedDept('All');
                  setSelectedStatus('All');
                }
          }
        />
      ) : (
        <>
          {/* Mobile Card Deck (< md) */}
          <div className="block md:hidden space-y-3">
            {filteredLeaves.map((req) => (
              <div
                key={req.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-violet-100 text-violet-700 font-bold flex items-center justify-center text-sm shrink-0">
                      {req.employeeName.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 leading-tight">{req.employeeName}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">{req.department} • {req.designation || 'Staff'}</p>
                    </div>
                  </div>
                  <StatusBadge status={req.status} size="sm" />
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Leave Type</span>
                    <span className="font-semibold text-slate-800">{req.leaveType}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Duration</span>
                    <span className="font-semibold text-slate-800">{req.daysCount} Day{req.daysCount === 1 ? '' : 's'}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Period</span>
                    <span className="font-medium text-slate-600">{req.startDate} to {req.endDate}</span>
                  </div>
                </div>

                {req.reason && (
                  <p className="text-xs text-slate-600 bg-slate-50/60 p-2.5 rounded-xl border border-slate-100 italic">
                    "{req.reason}"
                  </p>
                )}

                {/* Actions */}
                {req.status === 'Pending' ? (
                  <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenAction(req, 'Approved')}
                      className="py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Check className="h-3.5 w-3.5" />
                      Approve
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenAction(req, 'Rejected')}
                      className="py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <X className="h-3.5 w-3.5" />
                      Reject
                    </button>
                  </div>
                ) : (
                  <div className="pt-2 border-t border-slate-100 text-right text-xs text-slate-500 italic">
                    Decision: {req.status}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Desktop Table (>= md) */}
          <div className="hidden md:block bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50/80 text-xs uppercase tracking-wider text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-3.5 font-semibold">Employee</th>
                    <th className="px-5 py-3.5 font-semibold">Department</th>
                    <th className="px-5 py-3.5 font-semibold">Leave Type</th>
                    <th className="px-5 py-3.5 font-semibold">Duration & Dates</th>
                    <th className="px-5 py-3.5 font-semibold">Remaining Balance</th>
                    <th className="px-5 py-3.5 font-semibold">Reason</th>
                    <th className="px-5 py-3.5 font-semibold">Status</th>
                    <th className="px-5 py-3.5 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredLeaves.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Employee */}
                      <td className="px-5 py-4 font-semibold text-slate-900">
                        <div className="flex items-center gap-2.5">
                          <div className="h-8 w-8 rounded-xl bg-violet-100 text-violet-700 font-bold flex items-center justify-center text-xs">
                            {req.employeeName.substring(0, 2).toUpperCase()}
                          </div>
                          <span>{req.employeeName}</span>
                        </div>
                      </td>

                      {/* Department */}
                      <td className="px-5 py-4 text-xs">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium">
                          {req.department}
                        </span>
                      </td>

                      {/* Leave Type */}
                      <td className="px-5 py-4 text-xs font-semibold text-slate-800">
                        {req.leaveType}
                      </td>

                      {/* Duration & Dates */}
                      <td className="px-5 py-4 text-xs whitespace-nowrap">
                        <p className="font-semibold text-slate-800">
                          {req.daysCount} day{req.daysCount === 1 ? '' : 's'}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {req.startDate} to {req.endDate}
                        </p>
                      </td>

                      {/* Remaining Balance */}
                      <td className="px-5 py-4 text-xs font-semibold text-violet-700">
                        {req.remainingBalance !== undefined ? `${req.remainingBalance} Days` : 'N/A'}
                      </td>

                      {/* Reason */}
                      <td className="px-5 py-4 text-xs text-slate-600 max-w-xs truncate" title={req.reason}>
                        {req.reason}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <StatusBadge status={req.status} />
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right whitespace-nowrap">
                        {req.status === 'Pending' ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleOpenAction(req, 'Approved')}
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-2xs transition-colors cursor-pointer"
                            >
                              <Check className="h-3.5 w-3.5" />
                              Approve
                            </button>
                            <button
                              type="button"
                              onClick={() => handleOpenAction(req, 'Rejected')}
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors cursor-pointer"
                            >
                              <X className="h-3.5 w-3.5" />
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">
                            Decision recorded
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Confirmation Dialog with HR comment */}
      {actionDialog.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                Confirm Leave {actionDialog.action}
              </h3>
              <button
                onClick={() => setActionDialog({ isOpen: false, request: null, action: 'Approved', comment: '' })}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <p className="text-slate-600">
                Are you sure you want to mark {actionDialog.request?.employeeName}'s {actionDialog.request?.leaveType} request ({actionDialog.request?.daysCount} days) as{' '}
                <span className={actionDialog.action === 'Approved' ? 'text-emerald-700 font-bold' : 'text-rose-700 font-bold'}>
                  {actionDialog.action}
                </span>?
              </p>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  HR Adjudication Feedback Note (Optional)
                </label>
                <textarea
                  rows={3}
                  value={actionDialog.comment}
                  onChange={(e) => setActionDialog({ ...actionDialog, comment: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 text-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActionDialog({ isOpen: false, request: null, action: 'Approved', comment: '' })}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmAction}
                  className={`px-4 py-2 text-xs font-bold text-white rounded-xl shadow-xs transition-colors cursor-pointer ${
                    actionDialog.action === 'Approved'
                      ? 'bg-emerald-600 hover:bg-emerald-700'
                      : 'bg-rose-600 hover:bg-rose-700'
                  }`}
                >
                  Confirm {actionDialog.action}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
