import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  CalendarDays,
  Calendar,
  FileCheck,
  Award,
  Bell,
  ArrowRight,
  CheckCircle,
  Briefcase,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import StatusBadge from '../../components/common/StatusBadge';
import EmptyState from '../../components/common/EmptyState';

export default function EmployeeDashboard() {
  const navigate = useNavigate();
  const {
    currentEmployee,
    leaveRequests,
    holidays,
    onboardingDocuments,
    performanceReviews,
    notifications,
  } = useApp();

  const employee = currentEmployee;

  // Filter records for this employee
  const myLeaves = employee
    ? leaveRequests.filter((l) => l.employeeId === employee.id)
    : [];

  const myDocs = employee
    ? onboardingDocuments.filter((d) => d.employeeId === employee.id)
    : [];

  const myReviews = employee
    ? performanceReviews.filter((r) => r.employeeId === employee.id)
    : [];

  const employeeNotifications = notifications.filter(
    (n) => n.recipientRole === 'employee' || n.recipientRole === 'all'
  );

  const upcomingHolidays = holidays.slice(0, 3);
  const pendingLeavesCount = myLeaves.filter((l) => l.status === 'Pending').length;

  if (!employee) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Employee Workplace Portal
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Personal employment profile, leave requests, and document services.
            </p>
          </div>
        </div>

        <EmptyState
          icon={User}
          title="No Employee Record Found"
          description="Please contact your HR administrator."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl p-6 text-white shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white text-xl font-bold border border-white/30 shrink-0">
              {employee.name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-100">
                  {employee.department} Department
                </span>
                <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-white/20 text-white border border-white/20">
                  {employee.employeeCode}
                </span>
              </div>
              <h1 className="text-2xl font-bold mt-1 tracking-tight">
                Welcome back, {employee.name}!
              </h1>
              <p className="text-xs sm:text-sm text-emerald-100 mt-0.5">
                {employee.designation} • Joined {employee.joiningDate}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => navigate('/employee/leaves')}
              className="px-4 py-2 bg-white text-emerald-800 hover:bg-emerald-50 text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-2"
            >
              <CalendarDays className="h-4 w-4" />
              <span>Request Leave</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Annual Leave Balance */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-500">Leave Balance</span>
            <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600">
              <CalendarDays className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">
            {employee.annualLeaveBalance !== undefined ? `${employee.annualLeaveBalance} Days` : '15 Days'}
          </p>
          <span className="text-[11px] text-slate-500 mt-1 block">
            {pendingLeavesCount} request{pendingLeavesCount === 1 ? '' : 's'} pending HR review
          </span>
        </div>

        {/* Onboarding Progress */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-500">Onboarding</span>
            <div className="p-2 rounded-xl bg-violet-50 border border-violet-100 text-violet-600">
              <FileCheck className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">
            {employee.onboardingProgress || 0}%
          </p>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
            <div
              className="bg-violet-600 h-1.5 rounded-full"
              style={{ width: `${employee.onboardingProgress || 0}%` }}
            />
          </div>
        </div>

        {/* Status */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-500">Employment Status</span>
            <div className="p-2 rounded-xl bg-blue-50 border border-blue-100 text-blue-600">
              <Briefcase className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2">
            <StatusBadge status={employee.employmentStatus} size="md" />
          </div>
          <span className="text-[11px] text-slate-500 mt-2 block">
            Manager: {employee.reportingManager || 'Sarah Jenkins'}
          </span>
        </div>

        {/* Company Holidays Scheduled */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-500">Upcoming Holidays</span>
            <div className="p-2 rounded-xl bg-purple-50 border border-purple-100 text-purple-600">
              <Calendar className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">
            {holidays.length}
          </p>
          <span className="text-[11px] text-slate-500 mt-1 block">
            {upcomingHolidays[0] ? `Next: ${upcomingHolidays[0].name}` : 'No upcoming holidays'}
          </span>
        </div>
      </div>

      {/* Grid: My Leaves & Upcoming Holidays */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Leave Requests */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">My Leave Requests</h3>
              <p className="text-xs text-slate-500">Status of submitted time-off requests</p>
            </div>
            <button
              onClick={() => navigate('/employee/leaves')}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              View All ({myLeaves.length})
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {myLeaves.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              <CalendarDays className="h-8 w-8 mx-auto text-slate-300 mb-2" />
              <p className="font-semibold text-slate-600">No leave requests submitted</p>
              <p className="mt-1 text-slate-400">
                You can submit vacation, medical, or casual leave requests anytime.
              </p>
              <button
                type="button"
                onClick={() => navigate('/employee/leaves')}
                className="mt-3 px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl"
              >
                Apply for Leave
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {myLeaves.slice(0, 3).map((leave) => (
                <div
                  key={leave.id}
                  className="p-3.5 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors flex items-center justify-between"
                >
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{leave.leaveType}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {leave.startDate} to {leave.endDate} ({leave.daysCount} days)
                    </p>
                    {leave.hrComment && (
                      <p className="text-[11px] text-slate-600 italic mt-1">
                        HR Note: "{leave.hrComment}"
                      </p>
                    )}
                  </div>
                  <StatusBadge status={leave.status} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Company Holidays */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Company Holiday Calendar</h3>
              <p className="text-xs text-slate-500">Official observances and paid holidays</p>
            </div>
            <button
              onClick={() => navigate('/employee/holidays')}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              Full Calendar
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {holidays.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              <Calendar className="h-8 w-8 mx-auto text-slate-300 mb-2" />
              <p className="font-semibold text-slate-600">No holidays scheduled</p>
              <p className="mt-1 text-slate-400">
                Official company holidays added by HR will appear on this schedule.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingHolidays.map((hol) => (
                <div
                  key={hol.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 font-bold text-center min-w-[50px]">
                      <span className="block text-[10px] uppercase text-emerald-600">
                        {new Date(hol.date).toLocaleString('default', { month: 'short' })}
                      </span>
                      <span className="block text-sm">
                        {new Date(hol.date).getDate()}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">{hol.name}</p>
                      <p className="text-[11px] text-slate-500">{hol.type}</p>
                    </div>
                  </div>
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    {hol.department || 'All Departments'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Grid: Onboarding Checklist & Recent Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Onboarding Checklist Status */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Onboarding Documents</h3>
              <p className="text-xs text-slate-500">Compliance & verification status</p>
            </div>
            <button
              onClick={() => navigate('/employee/onboarding')}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              Upload / View
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {myDocs.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              <FileCheck className="h-8 w-8 mx-auto text-slate-300 mb-2" />
              <p className="font-semibold text-slate-600">No documents submitted</p>
              <p className="mt-1 text-slate-400">
                Upload your identity and joining documents to complete onboarding.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {myDocs.map((doc) => (
                <div
                  key={doc.id}
                  className="p-3 rounded-xl border border-slate-100 flex items-center justify-between text-xs"
                >
                  <div>
                    <p className="font-semibold text-slate-800">{doc.documentName}</p>
                    <p className="text-[11px] text-slate-400">{doc.documentType} • Submitted {doc.submissionDate}</p>
                  </div>
                  <StatusBadge status={doc.verificationStatus} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Notifications & Announcements */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Workplace Announcements</h3>
              <p className="text-xs text-slate-500">Alerts, leave decisions & reminders</p>
            </div>
            <button
              onClick={() => navigate('/employee/notifications')}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              View All ({employeeNotifications.length})
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {employeeNotifications.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              <Bell className="h-8 w-8 mx-auto text-slate-300 mb-2" />
              <p className="font-semibold text-slate-600">No new announcements</p>
              <p className="mt-1 text-slate-400">
                You are all caught up on staff updates.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {employeeNotifications.slice(0, 3).map((notif) => (
                <div
                  key={notif.id}
                  className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 text-xs"
                >
                  <p className="font-semibold text-slate-900">{notif.title}</p>
                  <p className="text-slate-600 mt-0.5">{notif.message}</p>
                  <span className="text-[10px] text-slate-400 mt-1 block">{notif.timestamp}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

