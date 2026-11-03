import React, { useState } from 'react';
import {
  Clock,
  Play,
  Square,
  Calendar,
  AlertCircle,
  CheckCircle,
  Building,
  Home,
  Coffee,
  Plus,
  History,
  Timer,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import StatusBadge from '../../components/common/StatusBadge';
import EmployeeEmptyState from './components/EmployeeEmptyState';

export default function Attendance() {
  const {
    currentEmployee,
    attendanceLogs = [],
    clockInState,
    clockIn,
    clockOut,
    setWorkStatus,
    requestAttendanceRegularization,
  } = useApp();

  const [isRegularizeModalOpen, setIsRegularizeModalOpen] = useState(false);
  const [regForm, setRegForm] = useState({
    date: new Date().toISOString().split('T')[0],
    clockIn: '09:00 AM',
    clockOut: '06:00 PM',
    location: 'In Office',
    reason: '',
  });
  const [regError, setRegError] = useState('');

  const employee = currentEmployee;

  if (!employee) {
    return (
      <div className="space-y-6">
        <div className="pb-2 border-b border-slate-200/80">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Attendance & Work Hours
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Daily web clock-in, timesheet history, and attendance regularization.
          </p>
        </div>
        <EmployeeEmptyState
          heading="No Employee Record Found"
          description="Please contact your HR administrator."
        />
      </div>
    );
  }

  // Format running seconds into HH:MM:SS
  const formatTimer = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const handleRegularizeSubmit = (e) => {
    e.preventDefault();
    setRegError('');

    if (!regForm.date) {
      setRegError('Please choose a date to regularize.');
      return;
    }
    if (!regForm.reason.trim()) {
      setRegError('Please explain the reason for the missing or corrected punch.');
      return;
    }

    requestAttendanceRegularization({
      date: regForm.date,
      clockIn: regForm.clockIn,
      clockOut: regForm.clockOut,
      location: regForm.location,
      reason: regForm.reason.trim(),
    });

    setIsRegularizeModalOpen(false);
    setRegForm({
      date: new Date().toISOString().split('T')[0],
      clockIn: '09:00 AM',
      clockOut: '06:00 PM',
      location: 'In Office',
      reason: '',
    });
  };

  const workStatusOptions = ['In Office', 'Remote / WFH', 'On Break'];

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Attendance & Time Tracking
            </h1>
            <span
              className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                clockInState.isClockedIn
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-slate-100 text-slate-600 border-slate-200'
              }`}
            >
              {clockInState.isClockedIn ? '● Actively Working' : '○ Not Clocked In'}
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            Record working hours with the one-click web punch clock, view timesheets, and resolve punch variances.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsRegularizeModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-violet-700 bg-violet-50 hover:bg-violet-100 border border-violet-200 rounded-xl transition-colors cursor-pointer self-start sm:self-auto"
        >
          <History className="h-4 w-4" />
          <span>Regularize Attendance</span>
        </button>
      </div>

      {/* 2. Web Punch Clock & Shift Spotlight Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          {/* Punch Clock Widget */}
          <div className="lg:col-span-2 flex flex-col sm:flex-row items-center gap-6 pb-6 lg:pb-0 lg:border-r border-slate-100 pr-0 lg:pr-6">
            <div className="relative flex items-center justify-center">
              <div
                className={`h-40 w-40 rounded-full flex flex-col items-center justify-center border-4 transition-all duration-300 ${
                  clockInState.isClockedIn
                    ? 'border-emerald-500 bg-emerald-50/70 shadow-[0_0_25px_rgba(16,185,129,0.25)] ring-4 ring-emerald-100'
                    : 'border-slate-200 bg-slate-50'
                }`}
              >
                <Clock
                  className={`h-8 w-8 mb-1 transition-transform duration-300 ${
                    clockInState.isClockedIn ? 'text-emerald-600 scale-110' : 'text-slate-400'
                  }`}
                />
                <span className="font-mono text-2xl font-bold text-slate-900 tracking-tight tabular-nums">
                  {formatTimer(clockInState.elapsedSeconds)}
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mt-0.5 flex items-center gap-1">
                  {clockInState.isClockedIn && <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />}
                  <span>{clockInState.isClockedIn ? 'Session Active' : 'Shift Idle'}</span>
                </span>
              </div>
            </div>

            <div className="space-y-3 text-center sm:text-left flex-1">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {clockInState.isClockedIn
                    ? `Clocked In since ${clockInState.clockInTime}`
                    : 'Ready to begin your work day?'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Standard Shift: 09:00 AM – 06:00 PM (1h paid lunch allowance)
                </p>
              </div>

              {/* Status Selector */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                {workStatusOptions.map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setWorkStatus(st)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
                      clockInState.workStatus === st
                        ? 'bg-violet-600 text-white border-violet-600 shadow-2xs'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {st === 'In Office' ? (
                      <Building className="h-3.5 w-3.5" />
                    ) : st === 'Remote / WFH' ? (
                      <Home className="h-3.5 w-3.5" />
                    ) : (
                      <Coffee className="h-3.5 w-3.5" />
                    )}
                    <span>{st}</span>
                  </button>
                ))}
              </div>

              {/* Action Button */}
              <div className="pt-1">
                {clockInState.isClockedIn ? (
                  <button
                    type="button"
                    onClick={clockOut}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    <Square className="h-4 w-4 fill-white" />
                    <span>Clock Out & End Session</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => clockIn(clockInState.workStatus)}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    <Play className="h-4 w-4 fill-white" />
                    <span>Clock In for Today</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Quick Stats Panel */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
              This Month Summary
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">On-Time Arrival</span>
                <span className="text-base font-bold text-emerald-600 mt-0.5 block">98.2%</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Avg Daily Hours</span>
                <span className="text-base font-bold text-slate-800 mt-0.5 block">8h 48m</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">WFH / Remote Days</span>
                <span className="text-base font-bold text-violet-700 mt-0.5 block">6 Days</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Overtime Logged</span>
                <span className="text-base font-bold text-indigo-700 mt-0.5 block">4h 15m</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Weekly Attendance Log Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">Attendance & Timesheet History</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Daily punch logs, logged hours, work locations, and manager notes.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
            {attendanceLogs.length} Work Sessions Recorded
          </span>
        </div>

        {attendanceLogs.length === 0 ? (
          <EmployeeEmptyState
            icon={Clock}
            heading="No Timesheet Logs Found"
            description="Punch in using the web clock above to start recording your daily hours."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50/80 text-xs uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3.5 font-semibold">Date & Day</th>
                  <th className="px-5 py-3.5 font-semibold">Clock In</th>
                  <th className="px-5 py-3.5 font-semibold">Clock Out</th>
                  <th className="px-5 py-3.5 font-semibold">Logged Duration</th>
                  <th className="px-5 py-3.5 font-semibold">Work Location</th>
                  <th className="px-5 py-3.5 font-semibold">Status</th>
                  <th className="px-5 py-3.5 font-semibold">Notes / Shift Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                {attendanceLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-4 font-bold text-slate-900">
                      <div>{log.date}</div>
                      <span className="text-[11px] text-slate-400 font-normal">{log.day}</span>
                    </td>
                    <td className="px-5 py-4 font-mono text-xs font-semibold text-slate-800">
                      {log.clockIn}
                    </td>
                    <td className="px-5 py-4 font-mono text-xs font-semibold text-slate-800">
                      {log.clockOut}
                    </td>
                    <td className="px-5 py-4 font-bold text-violet-700">
                      {log.workHours}
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium text-xs">
                        {log.location === 'In Office' ? (
                          <Building className="h-3 w-3 text-slate-500" />
                        ) : (
                          <Home className="h-3 w-3 text-violet-600" />
                        )}
                        <span>{log.location}</span>
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={log.status} size="sm" />
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-500 italic">
                      {log.notes || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 4. Attendance Regularization Modal */}
      {isRegularizeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Request Attendance Regularization
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Submit a missing or corrected punch request for HR and manager approval.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsRegularizeModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            {regError && (
              <div className="mt-3 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                <span>{regError}</span>
              </div>
            )}

            <form onSubmit={handleRegularizeSubmit} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Date of Missed Punch <span className="text-violet-600">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={regForm.date}
                  onChange={(e) => setRegForm({ ...regForm, date: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Clock In Time <span className="text-violet-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={regForm.clockIn}
                    onChange={(e) => setRegForm({ ...regForm, clockIn: e.target.value })}
                    placeholder="09:00 AM"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Clock Out Time <span className="text-violet-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={regForm.clockOut}
                    onChange={(e) => setRegForm({ ...regForm, clockOut: e.target.value })}
                    placeholder="06:00 PM"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Work Location</label>
                <select
                  value={regForm.location}
                  onChange={(e) => setRegForm({ ...regForm, location: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 bg-white"
                >
                  <option value="In Office">In Office (Austin HQ)</option>
                  <option value="Remote / WFH">Remote / WFH</option>
                  <option value="Client On-Site">Client On-Site Visit</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Reason for Adjustment <span className="text-violet-600">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={regForm.reason}
                  onChange={(e) => setRegForm({ ...regForm, reason: e.target.value })}
                  placeholder="e.g. Forgot to clock in upon morning arrival / VPN connection glitch..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsRegularizeModalOpen(false)}
                  className="px-4 py-2 text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Submit Regularization
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

