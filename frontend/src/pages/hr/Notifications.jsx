import React, { useState } from 'react';
import {
  Bell,
  CheckCircle2,
  Trash2,
  Clock,
  Filter,
  FileText,
  CalendarDays,
  UserCheck,
  Check,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import EmptyState from '../../components/common/EmptyState';

export default function Notifications() {
  const {
    notifications,
    markNotificationRead,
    clearNotifications,
    activeRole,
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState('All');

  const hrNotifications = notifications.filter(
    (n) => n.recipientRole === 'hr' || n.recipientRole === 'all'
  );

  const filteredNotifications = hrNotifications.filter((n) => {
    return selectedCategory === 'All' || n.category === selectedCategory;
  });

  const unreadCount = hrNotifications.filter((n) => !n.read).length;

  const categories = ['All', 'Recruitment', 'Leave', 'Onboarding', 'Jobs', 'Company'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              HR Notification Center
            </h1>
            {unreadCount > 0 && (
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-violet-600 text-white">
                {unreadCount} Unread
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            Audit alerts for candidate applications, time-off requests, and compliance verifications.
          </p>
        </div>

        {hrNotifications.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => hrNotifications.forEach((n) => markNotificationRead(n.id))}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
            >
              Mark All Read
            </button>
            <button
              type="button"
              onClick={() => clearNotifications('hr')}
              className="px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors cursor-pointer"
            >
              Clear Feed
            </button>
          </div>
        )}
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-colors cursor-pointer ${selectedCategory === cat
                ? 'bg-violet-600 text-white shadow-2xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title={hrNotifications.length === 0 ? 'Notification Feed Empty' : 'No matching notifications'}
          description={
            hrNotifications.length === 0
              ? 'There are currently zero notifications. As candidates apply or employees submit leave requests, real-time alerts will appear here.'
              : 'Try selecting another category.'
          }
        />
      ) : (
        <div className="space-y-2.5">
          {filteredNotifications.map((n) => (
            <div
              key={n.id}
              onClick={() => markNotificationRead(n.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${n.read
                  ? 'bg-white border-slate-200/80 text-slate-600'
                  : 'bg-violet-50/60 border-violet-200 text-slate-900 shadow-2xs'
                }`}
            >
              <div className="flex items-start gap-3.5">
                <div
                  className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${n.read ? 'bg-slate-100 text-slate-500' : 'bg-violet-100 text-violet-700'
                    }`}
                >
                  <Bell className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">{n.title}</h3>
                    {n.category && (
                      <span className="text-[10px] font-semibold px-2 py-0.2 rounded-md bg-slate-100 text-slate-600">
                        {n.category}
                      </span>
                    )}
                    {!n.read && (
                      <span className="h-2 w-2 rounded-full bg-violet-600" />
                    )}
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{n.message}</p>
                  <span className="text-[11px] text-slate-400 mt-2 block">{n.timestamp}</span>
                </div>
              </div>

              {!n.read && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    markNotificationRead(n.id);
                  }}
                  className="p-1.5 text-violet-600 hover:bg-violet-100 rounded-lg shrink-0"
                  title="Mark as read"
                >
                  <Check className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

