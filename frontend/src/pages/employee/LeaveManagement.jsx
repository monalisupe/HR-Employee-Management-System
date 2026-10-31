import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CalendarDays,
  Plus,
  FileText,
  Search,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import StatusBadge from '../../components/common/StatusBadge';
import EmployeeEmptyState from './components/EmployeeEmptyState';

export default function LeaveManagement() {
  const navigate = useNavigate();
  const { currentEmployee, leaveRequests } = useApp();

  const employee = currentEmployee;

  const [activeFilter, setActiveFilter] = useState('All'); // 'All' | 'Pending' | 'Approved' | 'Rejected'
  const [searchTerm, setSearchTerm] = useState('');

  if (!employee) {
    return (
      <div className="space-y-6">
        <div className="pb-2 border-b border-slate-200/80">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Leave & Time-Off Management
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Submit leave requests, track approvals, and view your remaining balance.
          </p>
        </div>

        <EmployeeEmptyState
          heading="No Employee Record Found"
          description="Please contact your HR administrator."
        />
      </div>
    );
  }

  // Filter requests specifically for active employee
  const myLeaves = leaveRequests.filter((l) => l.employeeId === employee.id);

  const filteredLeaves = myLeaves.filter((l) => {
    const matchesFilter =
      activeFilter === 'All' ||
      l.status.toLowerCase() === activeFilter.toLowerCase();
    const matchesSearch =
      l.leaveType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (l.reason && l.reason.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const earnedBalance =
    employee.earnedLeaveBalance ?? employee.annualLeaveBalance ?? 14;
  const sickBalance = employee.sickLeaveBalance ?? 8;
  const casualBalance = employee.casualLeaveBalance ?? 5;
  const unpaidCount = myLeaves
    .filter((l) => l.leaveType === 'Unpaid' && l.status === 'Approved')
    .reduce((acc, curr) => acc + (parseInt(curr.daysCount) || 0), 0);

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Leave & Time-Off Management
            </h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-violet-100 text-violet-800">
              {earnedBalance} Days Earned Remaining
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            View leave balances, track approval status, and submit time-off requests.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/employee/apply-leave')}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-violet-600 hover:bg-violet-700 rounded-xl shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Apply for Leave</span>
        </button>
      </div>

      {/* 2. Balance KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Casual Leave */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
          <span className="text-xs font-semibold uppercase text-slate-400">Casual Leave</span>
          <p className="text-3xl font-bold text-violet-700 mt-2">
            {casualBalance}
            <span className="text-sm text-slate-400 font-normal ml-1">Days</span>
          </p>
          <span className="text-[11px] text-slate-500 mt-1 block">Short personal & incidental days</span>
        </div>

        {/* Sick Leave */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
          <span className="text-xs font-semibold uppercase text-slate-400">Sick / Medical Leave</span>
          <p className="text-3xl font-bold text-indigo-700 mt-2">
            {sickBalance}
            <span className="text-sm text-slate-400 font-normal ml-1">Days</span>
          </p>
          <span className="text-[11px] text-slate-500 mt-1 block">Health, medical & doctor care</span>
        </div>

        {/* Earned Leave */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
          <span className="text-xs font-semibold uppercase text-slate-400">Earned / Annual Leave</span>
          <p className="text-3xl font-bold text-purple-700 mt-2">
            {earnedBalance}
            <span className="text-sm text-slate-400 font-normal ml-1">Days</span>
          </p>
          <span className="text-[11px] text-slate-500 mt-1 block">Accrued paid vacation time-off</span>
        </div>

        {/* Unpaid Leave */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
          <span className="text-xs font-semibold uppercase text-slate-400">Unpaid Leave (LOP)</span>
          <p className="text-3xl font-bold text-slate-700 mt-2">
            {unpaidCount}
            <span className="text-sm text-slate-400 font-normal ml-1">Days Used</span>
          </p>
          <span className="text-[11px] text-slate-500 mt-1 block">Loss of pay leave days</span>
        </div>
      </div>

      {/* 3. Leave Requests Filter & Search */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl w-full sm:w-auto overflow-x-auto">
          {['All', 'Pending', 'Approved', 'Rejected'].map((status) => (
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

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by leave type or reason..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
          />
        </div>
      </div>

      {/* 4. Requests List / Table */}
      {filteredLeaves.length === 0 ? (
        <EmployeeEmptyState
          icon={CalendarDays}
          heading={myLeaves.length === 0 ? 'No Leave Requests Submitted' : 'No Matching Leave Requests'}
          description={
            myLeaves.length === 0
              ? 'You have zero leave requests on record. Submit a request to send it for HR approval.'
              : 'No leave applications match the selected filter criteria.'
          }
          actionLabel="Apply for Leave"
          onAction={() => navigate('/employee/apply-leave')}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900">
              Leave Application Records ({filteredLeaves.length})
            </h3>
            <span className="text-xs text-slate-500">
              {myLeaves.filter((l) => l.status === 'Pending').length} Pending Review
            </span>
          </div>

          {/* Mobile Card Deck (< md) */}
          <div className="block md:hidden divide-y divide-slate-100 p-4 space-y-3">
            {filteredLeaves.map((req) => (
              <div key={req.id} className="pt-3 first:pt-0 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">{req.leaveType}</span>
                  <StatusBadge status={req.status} size="sm" />
                </div>
                <div className="text-xs text-slate-600 flex items-center justify-between">
                  <span>
                    {req.startDate} to {req.endDate}
                  </span>
                  <span className="font-semibold text-slate-900">
                    {req.daysCount} Day{req.daysCount === 1 ? '' : 's'}
                  </span>
                </div>
                {req.reason && (
                  <p className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-lg italic">
                    "{req.reason}"
                  </p>
                )}
                {req.attachmentName && (
                  <div className="flex items-center gap-1.5 text-xs text-violet-700">
                    <FileText className="h-3.5 w-3.5" />
                    <span>Attached: {req.attachmentName}</span>
                  </div>
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
                  <th className="px-5 py-3.5 font-semibold">Supporting Doc</th>
                  <th className="px-5 py-3.5 font-semibold">Review Status</th>
                  <th className="px-5 py-3.5 font-semibold">HR Feedback</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLeaves.map((req) => (
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
                    <td
                      className="px-5 py-4 text-xs text-slate-600 max-w-xs truncate"
                      title={req.reason}
                    >
                      {req.reason}
                    </td>
                    <td className="px-5 py-4 text-xs whitespace-nowrap">
                      {req.attachmentName ? (
                        <span className="flex items-center gap-1 text-violet-700 font-medium">
                          <FileText className="h-3.5 w-3.5" />
                          <span className="truncate max-w-[120px]">{req.attachmentName}</span>
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">None</span>
                      )}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <StatusBadge status={req.status} />
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-500 italic max-w-xs truncate">
                      {req.hrComment ||
                        (req.status === 'Pending' ? 'Awaiting HR review' : 'No remarks')}
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
