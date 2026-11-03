import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  UserCheck,
  CalendarDays,
  Calendar,
  FileCheck,
  Award,
  Clock,
  BarChart3,
  Bell,
  Settings,
  User,
  FileText,
  ChevronLeft,
  ChevronRight,
  Shield,
  Sparkles,
  LogOut,
  LifeBuoy,
  CalendarPlus,
  UploadCloud,
  DollarSign,
  CreditCard,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import HireFlowLogo from '../common/HireFlowLogo';

export default function Sidebar({
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen,
}) {
  const navigate = useNavigate();
  const {
    activeRole,
    applicants,
    openPositions,
    leaveRequests,
    currentCandidate,
    currentEmployee,
    preloadDemoData,
    resetToZeroData,
    logout,
  } = useApp();

  const handleLogout = () => {
    setIsMobileOpen(false);
    logout();
    navigate('/', { replace: true });
  };

  // Role navigation definitions
  const getNavItems = () => {
    if (activeRole === 'candidate') {
      const candidateApps = applicants.filter(
        (a) => a.candidateId === currentCandidate?.id
      );
      const publishedCount = openPositions.filter((p) => p.status === 'Published').length;

      return [
        { label: 'Overview', path: '/candidate/dashboard', icon: LayoutDashboard },
        { label: 'Browse Jobs', path: '/candidate/jobs', icon: Briefcase, badge: publishedCount },
        { label: 'My Applications', path: '/candidate/applications', icon: FileText, badge: candidateApps.length },
        { label: 'Interviews', path: '/candidate/interviews', icon: Clock },
        { label: 'Candidate Profile', path: '/candidate/profile', icon: User },
        { label: 'Notifications', path: '/candidate/notifications', icon: Bell },
      ];
    }

    if (activeRole === 'employee') {
      return [
        { label: 'Overview', path: '/employee/dashboard', icon: LayoutDashboard },
        { label: 'My Profile', path: '/employee/profile', icon: User },
        { label: 'Attendance & Time', path: '/employee/attendance', icon: Clock },
        { label: 'Payslips & Tax', path: '/employee/payslips', icon: DollarSign },
        { label: 'Leave Management', path: '/employee/leaves', icon: CalendarDays },
        { label: 'Apply Leave', path: '/employee/apply-leave', icon: CalendarPlus },
        { label: 'Company Holidays', path: '/employee/holidays', icon: Calendar },
        { label: 'Colleague Directory', path: '/employee/directory', icon: Users },
        { label: 'Digital ID & Assets', path: '/employee/id-card', icon: CreditCard },
        { label: 'Onboarding & Docs', path: '/employee/onboarding', icon: FileCheck },
        { label: 'Upload Document', path: '/employee/upload-document', icon: UploadCloud },
        { label: 'Performance', path: '/employee/performance', icon: Award },
        { label: 'HR Support', path: '/employee/support', icon: LifeBuoy },
        { label: 'Notifications', path: '/employee/notifications', icon: Bell },
      ];
    }

    // Default: HR Admin
    const pendingLeaves = leaveRequests.filter((l) => l.status === 'Pending').length;
    const publishedJobs = openPositions.filter((p) => p.status === 'Published').length;

    return [
      { label: 'Dashboard', path: '/hr/dashboard', icon: LayoutDashboard },
      { label: 'Applicants', path: '/hr/applicants', icon: Users, badge: applicants.length },
      { label: 'Open Positions', path: '/hr/positions', icon: Briefcase, badge: publishedJobs },
      { label: 'Employees', path: '/hr/employees', icon: UserCheck },
      { label: 'Leave Requests', path: '/hr/leaves', icon: CalendarDays, badge: pendingLeaves, badgeColor: 'bg-amber-100 text-amber-800' },
      { label: 'Holiday Management', path: '/hr/holidays', icon: Calendar },
      { label: 'Onboarding & Docs', path: '/hr/onboarding', icon: FileCheck },
      { label: 'Performance', path: '/hr/performance', icon: Award },
      { label: 'Interviews', path: '/hr/interviews', icon: Clock },
      { label: 'Reports & Analytics', path: '/hr/reports', icon: BarChart3 },
      { label: 'Notifications', path: '/hr/notifications', icon: Bell },
      { label: 'Settings & Org', path: '/hr/settings', icon: Settings },
    ];
  };

  const navItems = getNavItems();

  const getRoleHeader = () => {
    switch (activeRole) {
      case 'candidate':
        return {
          title: 'Candidate Portal',
          sub: currentCandidate ? currentCandidate.name : 'Job Applicant',
          badge: 'Candidate',
          badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        };
      case 'employee':
        return {
          title: 'Employee Portal',
          sub: currentEmployee ? currentEmployee.name : 'Staff Member',
          badge: 'Employee',
          badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        };
      default:
        return {
          title: 'HR Workspace',
          sub: 'Enterprise Talent Ops',
          badge: 'HR Admin',
          badgeColor: 'bg-violet-50 text-violet-700 border-violet-200',
        };
    }
  };

  const roleMeta = getRoleHeader();

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 flex flex-col bg-white border-r border-slate-200/90 transition-all duration-200 ease-in-out md:translate-x-0 ${
          isMobileOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0'
        } ${isCollapsed ? 'md:w-20' : 'md:w-64'}`}
      >
        {/* Brand & Workspace Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2.5 overflow-hidden">
            {!isCollapsed ? (
              <div className="flex flex-col">
                <HireFlowLogo size="default" />
                <span className="text-[10px] font-semibold uppercase tracking-wider text-purple-600 mt-0.5">
                  {roleMeta.title}
                </span>
              </div>
            ) : (
              <div className="mx-auto">
                <HireFlowLogo size="sm" className="[&>span]:hidden" />
              </div>
            )}
          </div>

          {/* Collapse button on Desktop */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* Role Pill Indicator in Sidebar */}
        {!isCollapsed && (
          <div className="px-4 py-3 border-b border-slate-100/70 bg-slate-50/50">
            <div className="flex items-center justify-between">
              <div className="truncate">
                <p className="text-xs font-semibold text-slate-800 truncate">{roleMeta.sub}</p>
                <p className="text-[10px] text-slate-500">Connected Workspace</p>
              </div>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${roleMeta.badgeColor}`}>
                {roleMeta.badge}
              </span>
            </div>
          </div>
        )}

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                    isActive
                      ? 'bg-violet-50 text-violet-700 font-semibold shadow-2xs border-r-2 border-violet-600'
                      : 'text-slate-600 hover:text-violet-700 hover:bg-slate-50'
                  } ${isCollapsed ? 'justify-center px-2' : ''}`
                }
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className="h-5 w-5 shrink-0 transition-colors group-hover:text-violet-600" />
                {!isCollapsed && (
                  <span className="flex-1 truncate">{item.label}</span>
                )}
                {!isCollapsed && typeof item.badge === 'number' && item.badge > 0 && (
                  <span
                    className={`ml-auto px-2 py-0.5 text-[11px] font-bold rounded-full ${
                      item.badgeColor || 'bg-violet-100 text-violet-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Clean Sidebar Footer with Sign Out */}
        {!isCollapsed ? (
          <div className="p-3 mx-3 mb-3 border-t border-slate-100">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full py-2.5 px-3 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-2 border border-slate-200/80 cursor-pointer shadow-2xs"
            >
              <LogOut className="h-4 w-4 text-slate-500" />
              <span>Sign Out of Portal</span>
            </button>
          </div>
        ) : (
          <div className="p-2 border-t border-slate-100 flex flex-col items-center gap-2">
            <button
              type="button"
              onClick={handleLogout}
              title="Sign Out"
              className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
