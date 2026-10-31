import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  Bell,
  Users,
  Briefcase,
  User,
  ChevronDown,
  LogOut,
  Shield,
  CheckCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function Topbar({ setIsMobileOpen }) {
  const navigate = useNavigate();
  const {
    activeRole,
    switchRole,
    currentUser,
    logout,
    organization,
    notifications,
    markNotificationRead,
    clearNotifications,
    currentCandidate,
    currentEmployee,
    preloadDemoData,
    resetToZeroData,
  } = useApp();

  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);

  const roleMenuRef = useRef(null);
  const notifMenuRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (roleMenuRef.current && !roleMenuRef.current.contains(e.target)) {
        setShowRoleMenu(false);
      }
      if (notifMenuRef.current && !notifMenuRef.current.contains(e.target)) {
        setShowNotifMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRoleSelect = (newRole) => {
    switchRole(newRole);
    setShowRoleMenu(false);
    if (newRole === 'candidate') {
      navigate('/candidate/dashboard');
    } else if (newRole === 'employee') {
      navigate('/employee/dashboard');
    } else {
      navigate('/hr/dashboard');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  // Filter notifications relevant to current role
  const roleNotifications = notifications.filter(
    (n) => n.recipientRole === activeRole || n.recipientRole === 'all'
  );
  const unreadCount = roleNotifications.filter((n) => !n.read).length;

  const getRoleDisplayName = () => {
    switch (activeRole) {
      case 'candidate':
        return {
          title: 'Candidate Portal',
          user: currentUser?.name || currentCandidate?.name || 'Alex Rivera',
          badge: 'Candidate',
          color: 'bg-indigo-50 border-indigo-200 text-indigo-700',
        };
      case 'employee':
        return {
          title: 'Employee Portal',
          user: currentUser?.name || currentEmployee?.name || 'Jordan Hayes',
          badge: 'Employee',
          color: 'bg-emerald-50 border-emerald-200 text-emerald-700',
        };
      default:
        return {
          title: 'HR Administrator',
          user: currentUser?.name || 'Sarah Jenkins (Lead HR)',
          badge: 'HR Admin',
          color: 'bg-violet-50 border-violet-200 text-violet-700',
        };
    }
  };

  const roleDisplay = getRoleDisplayName();
  const userInitials = (roleDisplay.user || 'ST')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 flex items-center justify-between shadow-2xs">
      {/* Left: Mobile hamburger & Tenant status tag */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsMobileOpen(true)}
          className="md:hidden p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-violet-50 border border-violet-100/80 text-violet-700 text-xs font-semibold">
            <Shield className="h-3.5 w-3.5 text-violet-600" />
            <span>{organization?.tenantId || 'ST-TENANT-001'}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="hidden md:inline font-medium text-slate-600">{organization?.name || 'SecureTenant'}</span>
            <span className="hidden lg:inline text-slate-400">• Workspace Active</span>
          </div>
        </div>
      </div>

      {/* Right Controls: Role Selector Switcher, Notifications, User info, Sign out */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Role Preview Switcher Dropdown */}
        <div className="relative" ref={roleMenuRef}>
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-2xs ${roleDisplay.color} hover:brightness-95`}
          >
            <span className="hidden xs:inline">Role:</span>
            <span>{roleDisplay.badge}</span>
            <ChevronDown className="h-3.5 w-3.5 opacity-70" />
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl border border-slate-200 shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-2 border-b border-slate-100 mb-1">
                <p className="text-xs font-bold text-slate-900">Switch Active Role</p>
                <p className="text-[11px] text-slate-500">Multi-Role Simulation Portal</p>
              </div>

              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => handleRoleSelect('hr')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs sm:text-sm text-left transition-colors cursor-pointer ${
                    activeRole === 'hr' ? 'bg-violet-50 text-violet-800 font-bold' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="p-1.5 rounded-lg bg-violet-100 text-violet-700">
                    <Users className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-semibold leading-tight">HR Administrator</p>
                    <p className="text-[11px] text-slate-500">Post jobs, review applicants, staff</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleRoleSelect('candidate')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs sm:text-sm text-left transition-colors cursor-pointer ${
                    activeRole === 'candidate' ? 'bg-indigo-50 text-indigo-800 font-bold' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="p-1.5 rounded-lg bg-indigo-100 text-indigo-700">
                    <Briefcase className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-semibold leading-tight">Candidate Portal</p>
                    <p className="text-[11px] text-slate-500">Browse jobs, applications, status</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleRoleSelect('employee')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs sm:text-sm text-left transition-colors cursor-pointer ${
                    activeRole === 'employee' ? 'bg-emerald-50 text-emerald-800 font-bold' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700">
                    <User className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-semibold leading-tight">Employee Portal</p>
                    <p className="text-[11px] text-slate-500">Profile, leaves, documents</p>
                  </div>
                </button>
              </div>

              {activeRole === 'hr' && (
                <div className="mt-2 pt-2 border-t border-slate-100 px-2 flex justify-between items-center text-[11px] text-slate-600">
                  <button
                    onClick={preloadDemoData}
                    className="text-violet-600 hover:text-violet-800 font-medium cursor-pointer"
                  >
                    Load Demo Data
                  </button>
                  <button
                    onClick={resetToZeroData}
                    className="text-slate-500 hover:text-slate-700 cursor-pointer"
                  >
                    Reset Zero
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifMenuRef}>
          <button
            onClick={() => setShowNotifMenu(!showNotifMenu)}
            className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Notifications"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-violet-600 text-[10px] font-bold text-white shadow-xs">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifMenu && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl border border-slate-200 shadow-xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-slate-100">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Notifications</h4>
                  <p className="text-[11px] text-slate-500">
                    {unreadCount} unread for {roleDisplay.badge}
                  </p>
                </div>
                {roleNotifications.length > 0 && (
                  <button
                    onClick={() => clearNotifications(activeRole)}
                    className="text-xs text-violet-600 hover:text-violet-800 font-medium cursor-pointer"
                  >
                    Clear All
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto space-y-2">
                {roleNotifications.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-400">
                    <p className="font-medium text-slate-600">No notifications yet</p>
                    <p className="mt-0.5">Actions in other dashboards will appear here in real-time.</p>
                  </div>
                ) : (
                  roleNotifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationRead(n.id)}
                      className={`p-2.5 rounded-xl text-xs transition-colors cursor-pointer border ${
                        n.read
                          ? 'bg-white border-slate-100 text-slate-600'
                          : 'bg-violet-50/70 border-violet-100 text-slate-800 font-medium'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-semibold text-slate-900">{n.title}</span>
                        <span className="text-[10px] text-slate-400 shrink-0">{n.timestamp}</span>
                      </div>
                      <p className="mt-1 text-slate-600 leading-snug">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile User Badge & Sign Out Button */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-violet-600 to-purple-600 text-white font-bold flex items-center justify-center text-xs shadow-2xs">
              {userInitials}
            </div>
            <div className="text-left hidden md:block">
              <p className="text-xs font-bold text-slate-800 leading-tight truncate max-w-[130px]">
                {roleDisplay.user}
              </p>
              <p className="text-[10px] text-slate-500 font-medium">{roleDisplay.badge}</p>
            </div>
          </div>

          {/* Explicit Logout Button with Redirection */}
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer ml-1 text-xs font-medium border border-transparent hover:border-rose-200"
            title="Sign Out of SecureTenant"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden lg:inline">Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
}
