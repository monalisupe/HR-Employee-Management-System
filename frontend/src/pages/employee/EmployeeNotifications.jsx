import React from 'react';
import {
  Bell,
  CheckCircle,
  Clock,
  Calendar,
  FileText,
  Trash2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import EmptyState from '../../components/common/EmptyState';

export default function EmployeeNotifications() {
  const { notifications, markNotificationRead, clearNotifications } = useApp();

  const employeeNotifications = notifications.filter(
    (n) => n.recipientRole === 'employee' || n.recipientRole === 'all'
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Employee Notifications & Announcements
            </h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              {employeeNotifications.filter((n) => !n.read).length} Unread
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            Real-time updates regarding leave approvals, document verification, and company events.
          </p>
        </div>

        {employeeNotifications.length > 0 && (
          <button
            type="button"
            onClick={() => clearNotifications('employee')}
            className="px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors cursor-pointer self-start sm:self-auto"
          >
            Clear Notifications
          </button>
        )}
      </div>

      {employeeNotifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No Employee Notifications"
          description="You currently have zero active workplace notifications. When HR takes action on your leave requests or verifies your documents, alerts will appear here."
        />
      ) : (
        <div className="space-y-3">
          {employeeNotifications.map((n) => (
            <div
              key={n.id}
              onClick={() => markNotificationRead(n.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                n.read
                  ? 'bg-white border-slate-200/80 text-slate-600'
                  : 'bg-emerald-50/50 border-emerald-200 text-slate-900 shadow-2xs'
              }`}
            >
              <div
                className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                  n.read ? 'bg-slate-100 text-slate-500' : 'bg-emerald-100 text-emerald-700'
                }`}
              >
                <Bell className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900">{n.title}</h3>
                  {!n.read && <span className="h-2 w-2 rounded-full bg-emerald-600" />}
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

