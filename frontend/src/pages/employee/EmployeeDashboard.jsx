import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  CalendarDays,
  Calendar,
  FileCheck,
  Bell,
  ArrowRight,
  LifeBuoy,
  UploadCloud,
  FileText,
  Lock,
  Phone,
  HeartHandshake,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import StatusBadge from '../../components/common/StatusBadge';
import EmployeeEmptyState from './components/EmployeeEmptyState';

export default function EmployeeDashboard() {
  const navigate = useNavigate();
  const {
    currentEmployee,
    leaveRequests,
    holidays,
    onboardingDocuments,
    notifications,
    supportRequests = [],
  } = useApp();

  const employee = currentEmployee;

  // Filter records specifically for active employee
  const myLeaves = employee
    ? leaveRequests.filter((l) => l.employeeId === employee.id)
    : [];

  const myDocs = employee
    ? onboardingDocuments.filter((d) => d.employeeId === employee.id)
    : [];

  const mySupportTickets = employee
    ? supportRequests.filter((s) => s.employeeId === employee.id)
    : [];

  const employeeNotifications = notifications.filter(
    (n) => n.recipientRole === 'employee' || n.recipientRole === 'all'
  );

  const upcomingHolidays = holidays.slice(0, 3);
  const pendingLeavesCount = myLeaves.filter((l) => l.status === 'Pending').length;
  const activeSupportCount = mySupportTickets.filter(
    (s) => s.status === 'Open' || s.status === 'In Progress'
  ).length;

  // If no employee record exists, render strictly compliant Empty State
  if (!employee) {
    return (
      <div className="space-y-6">
        <div className="pb-2 border-b border-slate-200/80">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Employee Workplace Portal
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Personal employment profile, leave management, compliance documents, and HR support.
          </p>
        </div>

        <EmployeeEmptyState
          heading="No Employee Record Found"
          description="Please contact your HR administrator."
        />
      </div>
    );
  }

  const leaveBalance =
    employee.earnedLeaveBalance ?? employee.annualLeaveBalance ?? 14;

  return (
    <div className="space-y-6">
      {/* 1. Welcome Banner */}
      <div className="bg-gradient-to-r from-violet-700 via-purple-700 to-indigo-800 rounded-2xl p-6 text-white shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white text-xl font-bold border border-white/30 shrink-0 shadow-xs overflow-hidden">
              {employee.photoUrl ? (
                <img
                  src={employee.photoUrl}
                  alt={employee.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                employee.name.substring(0, 2).toUpperCase()
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-violet-200">
                  {employee.department} Department
                </span>
                <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-white/20 text-white border border-white/20">
                  {employee.employeeCode}
                </span>
              </div>
              <h1 className="text-2xl font-bold mt-1 tracking-tight">
                Welcome back, {employee.name}!
              </h1>
              <p className="text-xs sm:text-sm text-violet-100 mt-0.5">
                {employee.designation} • Joined {employee.joiningDate}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
            <button
              type="button"
              onClick={() => navigate('/employee/apply-leave')}
              className="px-4 py-2 bg-white text-violet-900 hover:bg-violet-50 text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-2"
            >
              <CalendarDays className="h-4 w-4 text-violet-700" />
              <span>Apply Leave</span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/employee/upload-document')}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs sm:text-sm font-semibold rounded-xl transition-colors cursor-pointer flex items-center gap-2"
            >
              <UploadCloud className="h-4 w-4" />
              <span>Upload Doc</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Leave Balance */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-500">Earned Leave</span>
            <div className="p-2 rounded-xl bg-violet-50 border border-violet-100 text-violet-600">
              <CalendarDays className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">
            {leaveBalance} Days
          </p>
          <span className="text-[11px] text-slate-500 mt-1 block">
            {pendingLeavesCount} request{pendingLeavesCount === 1 ? '' : 's'} pending HR review
          </span>
        </div>

        {/* Onboarding & Document Verification */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-500">Document Verification</span>
            <div className="p-2 rounded-xl bg-purple-50 border border-purple-100 text-purple-600">
              <FileCheck className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">
            {employee.onboardingProgress || 0}%
          </p>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
            <div
              className="bg-violet-600 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${employee.onboardingProgress || 0}%` }}
            />
          </div>
        </div>

        {/* HR Support Tickets */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-500">HR Support</span>
            <div className="p-2 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600">
              <LifeBuoy className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">
            {activeSupportCount} Active
          </p>
          <span className="text-[11px] text-slate-500 mt-1 block">
            {mySupportTickets.length} total ticket{mySupportTickets.length === 1 ? '' : 's'} submitted
          </span>
        </div>

        {/* Upcoming Holidays */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-500">Upcoming Holidays</span>
            <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600">
              <Calendar className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">
            {holidays.length} Days
          </p>
          <span className="text-[11px] text-slate-500 mt-1 block truncate">
            {upcomingHolidays[0] ? `Next: ${upcomingHolidays[0].name}` : 'No upcoming holidays'}
          </span>
        </div>
      </div>

      {/* 3. Quick Action Shortcuts */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          type="button"
          onClick={() => navigate('/employee/apply-leave')}
          className="p-4 bg-white hover:bg-violet-50/50 rounded-2xl border border-slate-200/80 hover:border-violet-200 transition-all text-left shadow-2xs cursor-pointer group"
        >
          <div className="p-2 rounded-xl bg-violet-50 text-violet-700 w-fit mb-2 group-hover:scale-105 transition-transform">
            <CalendarDays className="h-5 w-5" />
          </div>
          <p className="font-bold text-slate-900 text-xs sm:text-sm">Apply for Leave</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Casual, sick & earned time-off</p>
        </button>

        <button
          type="button"
          onClick={() => navigate('/employee/upload-document')}
          className="p-4 bg-white hover:bg-violet-50/50 rounded-2xl border border-slate-200/80 hover:border-violet-200 transition-all text-left shadow-2xs cursor-pointer group"
        >
          <div className="p-2 rounded-xl bg-purple-50 text-purple-700 w-fit mb-2 group-hover:scale-105 transition-transform">
            <UploadCloud className="h-5 w-5" />
          </div>
          <p className="font-bold text-slate-900 text-xs sm:text-sm">Upload Document</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Aadhaar, PAN, degree & letters</p>
        </button>

        <button
          type="button"
          onClick={() => navigate('/employee/support')}
          className="p-4 bg-white hover:bg-violet-50/50 rounded-2xl border border-slate-200/80 hover:border-violet-200 transition-all text-left shadow-2xs cursor-pointer group"
        >
          <div className="p-2 rounded-xl bg-indigo-50 text-indigo-700 w-fit mb-2 group-hover:scale-105 transition-transform">
            <LifeBuoy className="h-5 w-5" />
          </div>
          <p className="font-bold text-slate-900 text-xs sm:text-sm">HR Support Ticket</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Salary, leave & technical query</p>
        </button>

        <button
          type="button"
          onClick={() => navigate('/employee/profile')}
          className="p-4 bg-white hover:bg-violet-50/50 rounded-2xl border border-slate-200/80 hover:border-violet-200 transition-all text-left shadow-2xs cursor-pointer group"
        >
          <div className="p-2 rounded-xl bg-slate-100 text-slate-700 w-fit mb-2 group-hover:scale-105 transition-transform">
            <User className="h-5 w-5" />
          </div>
          <p className="font-bold text-slate-900 text-xs sm:text-sm">My Profile</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Personal details & name request</p>
        </button>
      </div>

      {/* 4. Employee Personal & Official Profile Dossier */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-violet-50 text-violet-700">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Employee Profile Details
              </h3>
              <p className="text-xs text-slate-500">
                Official employee identification, contact information, and emergency contacts
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate('/employee/profile')}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-violet-700 bg-violet-50 hover:bg-violet-100 border border-violet-200 rounded-xl transition-colors cursor-pointer self-start sm:self-auto"
          >
            <span>Edit Profile in Full Form</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Profile Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Card A: Official Identification (Read-Only) */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <Lock className="h-3.5 w-3.5 text-slate-500" />
              <span>Official Identifiers (Read-Only)</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Full Name</span>
              <span className="font-semibold text-slate-800 text-sm">{employee.name}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Employee Code</span>
              <span className="font-mono font-semibold text-slate-700">{employee.employeeCode}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Work Email</span>
              <span className="font-semibold text-slate-700">{employee.email}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Department & Designation</span>
              <span className="font-semibold text-slate-800">{employee.designation} • {employee.department}</span>
            </div>
          </div>

          {/* Card B: Contact & Personal Details */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <Phone className="h-3.5 w-3.5 text-violet-600" />
              <span>Personal & Contact Info</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Phone Number</span>
              <span className="font-semibold text-slate-800">{employee.phone || 'Not provided'}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Date of Birth & Gender</span>
              <span className="font-semibold text-slate-800">
                {employee.dateOfBirth || 'Not provided'} • {employee.gender || 'Not specified'}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Residential Address</span>
              <span className="font-semibold text-slate-800 leading-snug block">
                {employee.address ? `${employee.address}, ${employee.city || ''} ${employee.state || ''} ${employee.pinCode || ''}` : 'Not provided'}
              </span>
            </div>
          </div>

          {/* Card C: Emergency Contact & HR Governance */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <HeartHandshake className="h-3.5 w-3.5 text-rose-500" />
              <span>Emergency Contact</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Contact Name</span>
              <span className="font-semibold text-slate-800">{employee.emergencyContactName || 'Not provided'}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Relationship & Phone</span>
              <span className="font-semibold text-slate-800">
                {employee.emergencyContactRelationship || employee.emergencyContactRelation || 'Not specified'} • {employee.emergencyContactPhone || employee.emergencyContact || 'Not provided'}
              </span>
            </div>
            <div className="pt-2 border-t border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Compensation / Band</span>
              <span className="font-semibold text-slate-800">{employee.salary || 'HR Band A ($115,000 / yr)'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Grid: Recent Leave Requests & Company Holidays */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Leave Requests */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Recent Leave Requests</h3>
              <p className="text-xs text-slate-500">Status of submitted time-off requests</p>
            </div>
            <button
              onClick={() => navigate('/employee/leaves')}
              className="text-xs font-semibold text-violet-700 hover:text-violet-800 flex items-center gap-1 cursor-pointer"
            >
              <span>View All ({myLeaves.length})</span>
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
                onClick={() => navigate('/employee/apply-leave')}
                className="mt-3 px-3.5 py-1.5 text-xs font-semibold text-white bg-violet-600 hover:bg-violet-700 rounded-xl cursor-pointer"
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
                      <p className="text-[11px] text-violet-700 italic mt-1">
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
              className="text-xs font-semibold text-violet-700 hover:text-violet-800 flex items-center gap-1 cursor-pointer"
            >
              <span>Full Calendar</span>
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
                    <div className="p-2.5 rounded-xl bg-violet-50 text-violet-700 font-bold text-center min-w-[50px]">
                      <span className="block text-[10px] uppercase text-violet-600">
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

      {/* 5. Grid: Compliance Documents & Recent Support Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Onboarding Documents */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Onboarding Documents</h3>
              <p className="text-xs text-slate-500">Compliance & verification status</p>
            </div>
            <button
              onClick={() => navigate('/employee/onboarding')}
              className="text-xs font-semibold text-violet-700 hover:text-violet-800 flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {myDocs.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              <FileCheck className="h-8 w-8 mx-auto text-slate-300 mb-2" />
              <p className="font-semibold text-slate-600">No documents submitted</p>
              <p className="mt-1 text-slate-400">
                Upload your Aadhaar, PAN, and education certificates to complete compliance.
              </p>
              <button
                type="button"
                onClick={() => navigate('/employee/upload-document')}
                className="mt-3 px-3.5 py-1.5 text-xs font-semibold text-white bg-violet-600 hover:bg-violet-700 rounded-xl cursor-pointer"
              >
                Upload Document Now
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {myDocs.slice(0, 3).map((doc) => (
                <div
                  key={doc.id}
                  className="p-3 rounded-xl border border-slate-100 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <FileText className="h-4 w-4 text-violet-600 shrink-0" />
                    <div className="truncate">
                      <p className="font-semibold text-slate-800 truncate">{doc.documentName}</p>
                      <p className="text-[11px] text-slate-400">{doc.documentType} • Submitted {doc.submissionDate}</p>
                    </div>
                  </div>
                  <StatusBadge status={doc.verificationStatus} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* HR Support Tickets */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Recent HR Support Tickets</h3>
              <p className="text-xs text-slate-500">Track inquiries, payroll & attendance issues</p>
            </div>
            <button
              onClick={() => navigate('/employee/support')}
              className="text-xs font-semibold text-violet-700 hover:text-violet-800 flex items-center gap-1 cursor-pointer"
            >
              <span>View All ({mySupportTickets.length})</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {mySupportTickets.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              <LifeBuoy className="h-8 w-8 mx-auto text-slate-300 mb-2" />
              <p className="font-semibold text-slate-600">No support tickets submitted</p>
              <p className="mt-1 text-slate-400">
                Have questions regarding salary, leaves, or equipment? Submit a ticket to HR.
              </p>
              <button
                type="button"
                onClick={() => navigate('/employee/support')}
                className="mt-3 px-3.5 py-1.5 text-xs font-semibold text-white bg-violet-600 hover:bg-violet-700 rounded-xl cursor-pointer"
              >
                Submit New Ticket
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {mySupportTickets.slice(0, 3).map((ticket) => (
                <div
                  key={ticket.id}
                  className="p-3 rounded-xl border border-slate-100 flex items-center justify-between text-xs"
                >
                  <div className="truncate mr-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-bold">
                        {ticket.ticketNumber}
                      </span>
                      <p className="font-semibold text-slate-800 truncate">{ticket.subject}</p>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {ticket.category} • Priority: {ticket.priority}
                    </p>
                  </div>
                  <StatusBadge status={ticket.status} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 6. Workplace Announcements & Notifications Preview */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Workplace Announcements</h3>
            <p className="text-xs text-slate-500">Alerts, leave decisions & reminders</p>
          </div>
          <button
            onClick={() => navigate('/employee/notifications')}
            className="text-xs font-semibold text-violet-700 hover:text-violet-800 flex items-center gap-1 cursor-pointer"
          >
            <span>View All ({employeeNotifications.length})</span>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {employeeNotifications.slice(0, 3).map((notif) => (
              <div
                key={notif.id}
                className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 text-xs flex flex-col justify-between"
              >
                <div>
                  <p className="font-bold text-slate-900">{notif.title}</p>
                  <p className="text-slate-600 mt-1 line-clamp-2 leading-relaxed">{notif.message}</p>
                </div>
                <span className="text-[10px] text-slate-400 mt-2 block">{notif.timestamp}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
