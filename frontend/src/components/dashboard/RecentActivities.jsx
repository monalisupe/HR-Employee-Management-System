import React from 'react';
import {
  Clock,
  Briefcase,
  Users,
  Calendar,
  CheckCircle,
  XCircle,
  FileText,
  UserCheck,
  AlertCircle,
  Award,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function RecentActivities() {
  const { activities } = useApp();

  const getIcon = (iconName) => {
    switch (iconName) {
      case 'Briefcase':
        return <Briefcase className="h-4 w-4 text-indigo-600" />;
      case 'Users':
        return <Users className="h-4 w-4 text-blue-600" />;
      case 'Calendar':
        return <Calendar className="h-4 w-4 text-purple-600" />;
      case 'CheckCircle':
        return <CheckCircle className="h-4 w-4 text-emerald-600" />;
      case 'XCircle':
        return <XCircle className="h-4 w-4 text-rose-600" />;
      case 'UserCheck':
        return <UserCheck className="h-4 w-4 text-emerald-600" />;
      case 'AlertCircle':
        return <AlertCircle className="h-4 w-4 text-amber-600" />;
      case 'Award':
        return <Award className="h-4 w-4 text-violet-600" />;
      default:
        return <FileText className="h-4 w-4 text-violet-600" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">Recent HR Activities</h3>
          <p className="text-xs text-slate-500">Live timeline of recruitment and HR events</p>
        </div>
        <div className="p-2 rounded-xl bg-violet-50 text-violet-600">
          <Clock className="h-4 w-4" />
        </div>
      </div>

      {activities.length === 0 ? (
        <div className="py-8 text-center text-xs text-slate-400">
          <Clock className="h-8 w-8 mx-auto text-slate-300 mb-2" />
          <p className="font-semibold text-slate-600">No activity recorded yet</p>
          <p className="mt-1 text-slate-400 max-w-xs mx-auto">
            Actions like posting jobs, scheduling interviews, and reviewing leave requests will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3.5 max-h-[360px] overflow-y-auto pr-1">
          {activities.map((act) => (
            <div key={act.id} className="flex items-start gap-3 group">
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 shrink-0 mt-0.5 group-hover:bg-violet-50 group-hover:border-violet-100 transition-colors">
                {getIcon(act.icon)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-800">{act.user}</p>
                <p className="text-xs text-slate-600 leading-snug break-words">{act.action}</p>
                <span className="text-[10px] text-slate-400 mt-0.5 block">{act.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

