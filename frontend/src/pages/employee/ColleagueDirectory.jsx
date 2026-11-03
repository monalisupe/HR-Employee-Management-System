import React, { useState } from 'react';
import {
  Users,
  Search,
  Mail,
  MapPin,
  Calendar,
  Building,
  UserCheck,
  Palmtree,
  ArrowRight,
  Shield,
  Briefcase,
  GitFork,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import StatusBadge from '../../components/common/StatusBadge';
import EmployeeEmptyState from './components/EmployeeEmptyState';

export default function ColleagueDirectory() {
  const { currentEmployee, colleagues = [], leaveRequests = [] } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');

  const employee = currentEmployee;

  if (!employee) {
    return (
      <div className="space-y-6">
        <div className="pb-2 border-b border-slate-200/80">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Colleague Directory & Teams
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Discover team members, reporting hierarchy, and view who is out of office.
          </p>
        </div>
        <EmployeeEmptyState
          heading="No Employee Record Found"
          description="Please contact your HR administrator."
        />
      </div>
    );
  }

  // Filter colleagues
  const filteredColleagues = colleagues.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDept === 'All' || c.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  // Calculate colleagues on leave today
  const onLeaveColleagues = colleagues.filter((c) => c.status === 'On Leave');

  // Hierarchy
  const manager = colleagues.find((c) => c.name === employee.reportingManager) || colleagues[0];
  const peers = colleagues.filter((c) => c.department === employee.department && c.id !== manager?.id);

  const departmentsList = ['All', 'IT', 'BPO', 'HR', 'Finance', 'Sales'];

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Colleague Directory & Org Team
            </h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-violet-100 text-violet-800 border border-violet-200">
              {colleagues.length} Active Staff
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            Connect with colleagues across branches, view reporting lines, and check team availability.
          </p>
        </div>
      </div>

      {/* 2. Spotlight: "Who's Out of Office Today" Alert Banner */}
      <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-5 shadow-2xs">
        <div className="flex items-start sm:items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-100 text-amber-700 shrink-0">
            <Palmtree className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-slate-900">
                Team Out-of-Office Availability
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200/70 text-amber-900">
                {onLeaveColleagues.length} on leave today
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              Plan meetings and cross-team dependencies considering currently scheduled time-offs:
            </p>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              {onLeaveColleagues.length > 0 ? (
                onLeaveColleagues.map((col) => (
                  <span
                    key={col.id}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-amber-200 text-xs font-semibold text-slate-800 shadow-2xs"
                  >
                    <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                    <span>{col.name} ({col.role})</span>
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-500 italic">
                  All team members in your department are currently available.
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Reporting Hierarchy Widget */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-violet-50 text-violet-700">
              <GitFork className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Reporting Line & Team Structure</h3>
              <p className="text-xs text-slate-500">Your managerial alignment within {employee.department}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4 py-2">
          {/* Manager Card */}
          <div className="p-4 rounded-xl border border-violet-200 bg-violet-50/50 w-full sm:w-72 text-center shadow-2xs">
            <span className="text-[10px] uppercase font-bold tracking-wider text-violet-700 px-2 py-0.5 rounded-full bg-violet-100 mb-2 inline-block">
              Direct Reporting Manager
            </span>
            <div className="h-14 w-14 rounded-full bg-gradient-to-tr from-violet-600 to-purple-600 text-white font-bold text-lg flex items-center justify-center mx-auto mb-2 shadow-xs">
              {manager ? manager.avatar : 'MV'}
            </div>
            <h4 className="font-bold text-sm text-slate-900">{manager ? manager.name : employee.reportingManager}</h4>
            <p className="text-xs text-slate-500">{manager ? manager.role : 'Engineering Manager'}</p>
            <p className="text-[11px] text-violet-700 font-mono mt-1">{manager ? manager.email : 'manager@securetenant.com'}</p>
          </div>

          <ArrowRight className="h-5 w-5 text-slate-400 rotate-90 md:rotate-0 shrink-0" />

          {/* Current Employee (You) */}
          <div className="p-4 rounded-xl border-2 border-violet-600 bg-white w-full sm:w-72 text-center shadow-md">
            <span className="text-[10px] uppercase font-bold tracking-wider text-white px-2 py-0.5 rounded-full bg-violet-600 mb-2 inline-block">
              You (Active Session)
            </span>
            <div className="h-14 w-14 rounded-full bg-slate-900 text-white font-bold text-lg flex items-center justify-center mx-auto mb-2 shadow-xs">
              {employee.name.substring(0, 2).toUpperCase()}
            </div>
            <h4 className="font-bold text-sm text-slate-900">{employee.name}</h4>
            <p className="text-xs text-slate-500">{employee.designation}</p>
            <p className="text-[11px] text-slate-400 font-mono mt-1">{employee.email}</p>
          </div>
        </div>
      </div>

      {/* 4. Colleague Search & Filter Controls */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search colleagues by name, role or email..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
          />
        </div>

        {/* Department Filters */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl w-full sm:w-auto overflow-x-auto text-xs">
          {departmentsList.map((dept) => (
            <button
              key={dept}
              type="button"
              onClick={() => setSelectedDept(dept)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer whitespace-nowrap ${
                selectedDept === dept
                  ? 'bg-white text-violet-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      {/* 5. Colleagues Card Grid */}
      {filteredColleagues.length === 0 ? (
        <EmployeeEmptyState
          icon={Users}
          heading="No Colleagues Found"
          description="No team members match your active search and department filter criteria."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredColleagues.map((col) => (
            <div
              key={col.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs hover:shadow-xs hover:border-violet-200 transition-all space-y-4 group"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white font-bold text-base flex items-center justify-center shrink-0 shadow-2xs">
                    {col.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 group-hover:text-violet-700 transition-colors">
                      {col.name}
                    </h4>
                    <p className="text-xs text-slate-500 leading-tight mt-0.5">{col.role}</p>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mt-1">
                      {col.department} Department
                    </span>
                  </div>
                </div>
                <StatusBadge status={col.status === 'On Leave' ? 'On Leave' : 'Active'} size="sm" />
              </div>

              <div className="space-y-1.5 text-xs text-slate-500 pt-3 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <a
                    href={`mailto:${col.email}`}
                    className="truncate hover:text-violet-700 transition-colors font-mono text-[11px]"
                  >
                    {col.email}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <span>{col.location}</span>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href={`mailto:${col.email}`}
                  className="w-full py-2 bg-slate-50 hover:bg-violet-50 text-slate-700 hover:text-violet-700 text-xs font-semibold rounded-xl border border-slate-200 hover:border-violet-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Mail className="h-3.5 w-3.5" />
                  <span>Direct Message / Email</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

