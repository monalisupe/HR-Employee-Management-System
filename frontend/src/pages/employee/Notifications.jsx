import React, { useState } from 'react';
import {
  Bell,
  Trash2,
  CheckCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import EmployeeEmptyState from './components/EmployeeEmptyState';

export default function Notifications() {
  const { notifications, markNotificationRead, clearNotifications } = useApp();

  const [activeCategory, setActiveCategory] = useState('All');

  // Filter notifications for active employee or all
  const employeeNotifications = notifications.filter(
    (n) => n.recipientRole === 'employee' || n.recipientRole === 'all'
  );

  const filteredNotifications = employeeNotifications.filter((n) => {
    if (activeCategory === 'All') return true;
    return (n.category || 'General').toLowerCase() === activeCategory.toLowerCase();
  });

  const unreadCount = employeeNotifications.filter((n) => !n.read).length;

  const handleMarkAllRead = () => {
    employeeNotifications.forEach((n) => {
      if (!n.read) markNotificationRead(n.id);
    });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Notifications & Workplace Alerts
            </h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-violet-100 text-violet-800">
              {unreadCount} Unread
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            Real-time updates regarding leave approvals, document verification, and announcements.
          </p>
        </div>

        {employeeNotifications.length > 0 && (
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="px-3 py-1.5 text-xs font-semibold text-violet-700 bg-violet-50 hover:bg-violet-100 border border-violet-200 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                <span>Mark All Read</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => clearNotifications('employee')}
              className="px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Clear Feed</span>
            </button>
          </div>
        )}
      </div>

      {/* 2. Category Filters */}
      {employeeNotifications.length > 0 && (
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl w-fit overflow-x-auto text-xs">
          {['All', 'Leave', 'Onboarding', 'Profile', 'Support', 'Company'].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer whitespace-nowrap ${
                activeCategory === cat
                  ? 'bg-white text-violet-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* 3. Notifications List */}
      {filteredNotifications.length === 0 ? (
        <EmployeeEmptyState
          icon={Bell}
          heading={employeeNotifications.length === 0 ? 'No Employee Notifications' : 'No Matching Notifications'}
          description={
            employeeNotifications.length === 0
              ? 'You have zero active workplace alerts. When HR reviews your leaves or verifies your documents, updates will appear here.'
              : 'No alerts found in the selected category.'
          }
        />
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((n) => (
            <div
              key={n.id}
              onClick={() => markNotificationRead(n.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                n.read
                  ? 'bg-white border-slate-200/80 text-slate-600'
                  : 'bg-violet-50/50 border-violet-200 text-slate-900 shadow-2xs'
              }`}
            >
              <div
                className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                  n.read ? 'bg-slate-100 text-slate-500' : 'bg-violet-100 text-violet-700'
                }`}
              >
                <Bell className="h-5 w-5" />
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">{n.title}</h3>
                    {!n.read && <span className="h-2 w-2 rounded-full bg-violet-600" />}
                  </div>
                  {n.category && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                      {n.category}
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{n.message}</p>
                <span className="text-[11px] text-slate-400 mt-2 block">{n.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
