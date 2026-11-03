import React, { useState } from 'react';
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
  ChevronDown,
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
    notifications,
    currentCandidate,
    currentEmployee,
    logout,
  } = useApp();

  // Collapsible navigation groups state
  const [collapsedGroups, setCollapsedGroups] = useState({
    WORKSPACE: false,
    RECRUITMENT: false,
    WORKFORCE: false,
    ADMINISTRATION: false,
  });

  const toggleGroup = (groupTitle) => {
    setCollapsedGroups((prev) => ({
      ...prev,
      [groupTitle]: !prev[groupTitle],
    }));
  };

  const handleLogout = () => {
    setIsMobileOpen(false);
    logout();
    navigate('/', { replace: true });
  };

  // Grouped Navigation definition for HR Admin
  const getHrGroups = () => {
    const pendingLeaves = leaveRequests.filter((l) => l.status === 'Pending').length;
    const publishedJobs = openPositions.filter((p) => p.status === 'Published').length;
    const unreadNotifs = notifications.filter((n) => !n.read && (n.recipientRole === 'hr' || n.recipientRole === 'all')).length;

    return [
      {
        title: 'WORKSPACE',
        items: [
          { label: 'Dashboard', path: '/hr/dashboard', icon: LayoutDashboard },
        ],
      },
      {
        title: 'RECRUITMENT',
        items: [
          { label: 'Applicants', path: '/hr/applicants', icon: Users, badge: applicants.length },
          { label: 'Open Positions', path: '/hr/positions', icon: Briefcase, badge: publishedJobs },
          { label: 'Interviews', path: '/hr/interviews', icon: Clock },
          { label: 'Performance', path: '/hr/performance', icon: Award },
        ],
      },
      {
        title: 'WORKFORCE',
        items: [
          { label: 'Employees', path: '/hr/employees', icon: UserCheck },
          { label: 'Leave Requests', path: '/hr/leaves', icon: CalendarDays, badge: pendingLeaves, badgeColor: 'bg-amber-100 text-amber-800' },
          { label: 'Holiday Management', path: '/hr/holidays', icon: Calendar },
          { label: 'Onboarding & Documents', path: '/hr/onboarding', icon: FileCheck },
        ],
      },
      {
        title: 'ADMINISTRATION',
        items: [
          { label: 'Reports & Analytics', path: '/hr/reports', icon: BarChart3 },
          { label: 'Notifications', path: '/hr/notifications', icon: Bell, badge: unreadNotifs },
          { label: 'Settings & Organization', path: '/hr/settings', icon: Settings },
        ],
      },
    ];
  };

  // Candidate Navigation definition
  const getCandidateGroups = () => {
    const candidateApps = applicants.filter((a) => a.candidateId === currentCandidate?.id);
    const publishedCount = openPositions.filter((p) => p.status === 'Published').length;
    return [
      {
        title: 'CANDIDATE PORTAL',
        items: [
          { label: 'Overview', path: '/candidate/dashboard', icon: LayoutDashboard },
          { label: 'Browse Jobs', path: '/candidate/jobs', icon: Briefcase, badge: publishedCount },
          { label: 'My Applications', path: '/candidate/applications', icon: FileText, badge: candidateApps.length },
          { label: 'Interviews', path: '/candidate/interviews', icon: Clock },
          { label: 'Candidate Profile', path: '/candidate/profile', icon: User },
          { label: 'Notifications', path: '/candidate/notifications', icon: Bell },
        ],
      },
    ];
  };

  // Employee Navigation definition
  const getEmployeeGroups = () => {
    return [
      {
        title: 'WORKPLACE',
        items: [
          { label: 'Overview', path: '/employee/dashboard', icon: LayoutDashboard },
          { label: 'My Profile', path: '/employee/profile', icon: User },
          { label: 'Attendance & Time', path: '/employee/attendance', icon: Clock },
          { label: 'Payslips & Tax', path: '/employee/payslips', icon: DollarSign },
        ],
      },
      {
        title: 'LEAVES & HOLIDAYS',
        items: [
          { label: 'Leave Management', path: '/employee/leaves', icon: CalendarDays },
          { label: 'Apply Leave', path: '/employee/apply-leave', icon: CalendarPlus },
          { label: 'Company Holidays', path: '/employee/holidays', icon: Calendar },
        ],
      },
      {
        title: 'DIRECTORY & ASSETS',
        items: [
          { label: 'Colleague Directory', path: '/employee/directory', icon: Users },
          { label: 'Digital ID & Assets', path: '/employee/id-card', icon: CreditCard },
          { label: 'Onboarding & Docs', path: '/employee/onboarding', icon: FileCheck },
          { label: 'Performance', path: '/employee/performance', icon: Award },
          { label: 'HR Support', path: '/employee/support', icon: LifeBuoy },
        ],
      },
    ];
  };

  const navGroups =
    activeRole === 'candidate'
      ? getCandidateGroups()
      : activeRole === 'employee'
      ? getEmployeeGroups()
      : getHrGroups();

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
              <div className="mx-auto" title="HireFlow HR">
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
          <div className="px-4 py-2.5 border-b border-slate-100/70 bg-slate-50/40">
            <div className="flex items-center justify-between">
              <div className="truncate">
                <p className="text-xs font-semibold text-slate-800 truncate">{roleMeta.sub}</p>
                <p className="text-[10px] text-slate-400">Connected Organization</p>
              </div>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${roleMeta.badgeColor}`}>
                {roleMeta.badge}
              </span>
            </div>
          </div>
        )}

        {/* Grouped Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
          {navGroups.map((group) => {
            const isGroupCollapsed = collapsedGroups[group.title];

            return (
              <div key={group.title} className="space-y-1">
                {/* Group Title Header (with collapsible toggle on expanded mode) */}
                {!isCollapsed ? (
                  <button
                    type="button"
                    onClick={() => toggleGroup(group.title)}
                    className="w-full flex items-center justify-between px-3 py-1 text-[11px] font-bold tracking-wider text-slate-400 uppercase hover:text-slate-700 transition-colors cursor-pointer select-none"
                  >
                    <span>{group.title}</span>
                    <ChevronDown
                      className={`h-3 w-3 transition-transform duration-200 ${
                        isGroupCollapsed ? '-rotate-90 text-slate-400' : 'text-slate-400'
                      }`}
                    />
                  </button>
                ) : (
                  <div className="h-px bg-slate-100 my-2" />
                )}

                {/* Items List */}
                {(!isGroupCollapsed || isCollapsed) && (
                  <div className="space-y-0.5">
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      return (
                        <NavLink
                          key={item.path}
                          to={item.path}
                          onClick={() => setIsMobileOpen(false)}
                          className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all group ${
                              isActive
                                ? 'bg-purple-50/80 text-purple-900 font-bold border-l-3 border-purple-600 shadow-2xs'
                                : 'text-slate-600 hover:text-purple-700 hover:bg-slate-50/80'
                            } ${isCollapsed ? 'justify-center px-2 py-2.5' : ''}`
                          }
                          title={isCollapsed ? item.label : undefined}
                        >
                          <Icon className="h-4.5 w-4.5 shrink-0 transition-colors group-hover:text-purple-600" />
                          {!isCollapsed && (
                            <span className="flex-1 truncate">{item.label}</span>
                          )}
                          {!isCollapsed && typeof item.badge === 'number' && item.badge > 0 && (
                            <span
                              className={`ml-auto px-1.5 py-0.2 text-[10px] font-bold rounded-full ${
                                item.badgeColor || 'bg-purple-100 text-purple-700'
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </NavLink>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Clean Sidebar Footer with Logout */}
        <div className="p-3 border-t border-slate-100 shrink-0">
          {!isCollapsed ? (
            <button
              type="button"
              onClick={handleLogout}
              className="w-full py-2 px-3 text-slate-600 hover:text-rose-600 hover:bg-rose-50/70 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-2 border border-slate-200/80 cursor-pointer shadow-2xs"
            >
              <LogOut className="h-3.5 w-3.5 text-slate-500 group-hover:text-rose-600" />
              <span>Sign Out of Portal</span>
            </button>
          ) : (
            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleLogout}
                title="Sign Out"
                className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer transition-colors"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
