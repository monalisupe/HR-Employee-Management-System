import React from 'react';
import {
  Bell,
  CheckCircle,
  Briefcase,
  Calendar,
  Clock,
  Trash2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import EmptyState from '../../components/common/EmptyState';

export default function CandidateNotifications() {
  const { notifications, markNotificationRead, clearNotifications } = useApp();

  const candidateNotifications = notifications.filter(
    (n) => n.recipientRole === 'candidate' || n.recipientRole === 'all'
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Candidate Notifications
            </h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
              {candidateNotifications.filter((n) => !n.read).length} Unread
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            Recruitment updates, scheduled interviews, and status alerts.
          </p>
        </div>

        {candidateNotifications.length > 0 && (
          <button
            type="button"
            onClick={() => clearNotifications('candidate')}
            className="px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors cursor-pointer self-start sm:self-auto"
          >
            Clear Notifications
          </button>
        )}
      </div>

      {candidateNotifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No Notifications"
          description="You have zero active candidate notifications. As your application progresses or when interviews are booked, alerts will appear here."
        />
      ) : (
        <div className="space-y-3">
          {candidateNotifications.map((n) => (
            <div
              key={n.id}
              onClick={() => markNotificationRead(n.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                n.read
                  ? 'bg-white border-slate-200/80 text-slate-600'
                  : 'bg-indigo-50/50 border-indigo-200 text-slate-900 shadow-2xs'
              }`}
            >
              <div
                className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                  n.read ? 'bg-slate-100 text-slate-500' : 'bg-indigo-100 text-indigo-700'
                }`}
              >
                <Bell className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900">{n.title}</h3>
                  {!n.read && <span className="h-2 w-2 rounded-full bg-indigo-600" />}
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

