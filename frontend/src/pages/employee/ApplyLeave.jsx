import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Info } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import LeaveRequestForm from './components/LeaveRequestForm';
import EmployeeEmptyState from './components/EmployeeEmptyState';

export default function ApplyLeave() {
  const navigate = useNavigate();
  const { currentEmployee, submitLeaveRequest } = useApp();

  const employee = currentEmployee;

  if (!employee) {
    return (
      <div className="space-y-6">
        <div className="pb-2 border-b border-slate-200/80">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Apply for Leave
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Submit a formal time-off request for HR approval.
          </p>
        </div>

        <EmployeeEmptyState
          heading="No Employee Record Found"
          description="Please contact your HR administrator."
        />
      </div>
    );
  }

  const handleFormSubmit = (leaveData) => {
    submitLeaveRequest(leaveData);
    navigate('/employee/leaves');
  };

  const balances = {
    casual: employee.casualLeaveBalance ?? 5,
    sick: employee.sickLeaveBalance ?? 8,
    earned: employee.earnedLeaveBalance ?? employee.annualLeaveBalance ?? 14,
    unpaid: 0,
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link
          to="/employee/leaves"
          className="hover:text-violet-700 flex items-center gap-1 font-medium transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Leave Management</span>
        </Link>
        <span>/</span>
        <span className="font-semibold text-slate-800">Apply for Leave</span>
      </div>

      {/* Header */}
      <div className="pb-2 border-b border-slate-200/80">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Submit Leave Request
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Choose your leave classification, specify dates, and detail reason for HR and manager approval.
        </p>
      </div>

      {/* Main Grid: Form + Policies Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leave Request Form (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs">
          <h3 className="text-base font-bold text-slate-900 mb-4 pb-3 border-b border-slate-100">
            Time-Off Application Form
          </h3>

          <LeaveRequestForm
            onSubmit={handleFormSubmit}
            onCancel={() => navigate('/employee/leaves')}
            leaveBalances={balances}
          />
        </div>

        {/* Guidelines & Balances Card (1 col) */}
        <div className="space-y-4">
          {/* Remaining Balance Summary */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-3">
            <h4 className="font-bold text-sm text-slate-900">Your Leave Quotas</h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-violet-50/70 border border-violet-100">
                <span className="font-semibold text-violet-900">Casual Leave</span>
                <span className="font-bold text-violet-700">{balances.casual} Days</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-indigo-50/70 border border-indigo-100">
                <span className="font-semibold text-indigo-900">Sick / Medical Leave</span>
                <span className="font-bold text-indigo-700">{balances.sick} Days</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-purple-50/70 border border-purple-100">
                <span className="font-semibold text-purple-900">Earned / Annual Leave</span>
                <span className="font-bold text-purple-700">{balances.earned} Days</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="font-semibold text-slate-700">Unpaid Leave</span>
                <span className="font-bold text-slate-600">Available (Loss of Pay)</span>
              </div>
            </div>
          </div>

          {/* Policy Guidelines */}
          <div className="bg-slate-50/80 rounded-2xl border border-slate-200/80 p-5 text-xs text-slate-600 space-y-3">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <Info className="h-4 w-4 text-violet-600" />
              <span>Leave Guidelines & Policy</span>
            </div>
            <ul className="space-y-2 text-[11px] leading-relaxed list-disc list-inside text-slate-500">
              <li>
                <strong>Casual Leave:</strong> Apply at least 24 hours in advance for planned personal absences.
              </li>
              <li>
                <strong>Earned Leave:</strong> Requires 7 days advance notice for team coverage planning.
              </li>
              <li>
                <strong>Sick Leave:</strong> Attach a medical practitioner certificate if consecutive leave exceeds 2 working days.
              </li>
              <li>
                <strong>Approval SLA:</strong> HR and department leads typically process requests within 24 to 48 business hours.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
