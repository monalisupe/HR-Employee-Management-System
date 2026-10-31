import React from 'react';
import {
  Users,
  Briefcase,
  FileText,
  UserCheck,
  UserX,
  CalendarDays,
  TrendingUp,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function SummaryCards() {
  const { employees, openPositions, applicants, leaveRequests } = useApp();

  // Dynamic calculations from shared state
  const totalEmployees = employees.length;
  const publishedPositions = openPositions.filter((p) => p.status === 'Published').length;
  const totalApplications = applicants.length;
  const selectedCandidates = applicants.filter((a) => a.status === 'Selected').length;
  const rejectedCandidates = applicants.filter((a) => a.status === 'Rejected').length;
  const pendingLeaves = leaveRequests.filter((l) => l.status === 'Pending').length;

  const cards = [
    {
      title: 'Total Employees',
      count: totalEmployees,
      subtext: totalEmployees === 0 ? 'No employees onboarded' : `${totalEmployees} active personnel`,
      icon: Users,
      iconColor: 'text-violet-600',
      iconBg: 'bg-violet-50 border-violet-100',
      gradient: 'from-violet-500/10 to-transparent',
    },
    {
      title: 'Open Positions',
      count: publishedPositions,
      subtext: publishedPositions === 0 ? 'No active job postings' : `${publishedPositions} published positions`,
      icon: Briefcase,
      iconColor: 'text-indigo-600',
      iconBg: 'bg-indigo-50 border-indigo-100',
      gradient: 'from-indigo-500/10 to-transparent',
    },
    {
      title: 'Job Applications',
      count: totalApplications,
      subtext: totalApplications === 0 ? 'Zero candidates applied' : `${totalApplications} total applicants`,
      icon: FileText,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-50 border-blue-100',
      gradient: 'from-blue-500/10 to-transparent',
    },
    {
      title: 'Selected Candidates',
      count: selectedCandidates,
      subtext: selectedCandidates === 0 ? 'Awaiting final selections' : 'Ready for onboarding',
      icon: UserCheck,
      iconColor: 'text-emerald-600',
      iconBg: 'bg-emerald-50 border-emerald-100',
      gradient: 'from-emerald-500/10 to-transparent',
    },
    {
      title: 'Rejected Candidates',
      count: rejectedCandidates,
      subtext: rejectedCandidates === 0 ? 'No rejections recorded' : 'Archived applications',
      icon: UserX,
      iconColor: 'text-rose-600',
      iconBg: 'bg-rose-50 border-rose-100',
      gradient: 'from-rose-500/10 to-transparent',
    },
    {
      title: 'Pending Leave Requests',
      count: pendingLeaves,
      subtext: pendingLeaves === 0 ? 'All leave reviews up-to-date' : 'Requires HR approval',
      icon: CalendarDays,
      iconColor: 'text-amber-600',
      iconBg: 'bg-amber-50 border-amber-100',
      gradient: 'from-amber-500/10 to-transparent',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="relative overflow-hidden bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs hover:shadow-xs transition-all duration-200 group"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {card.title}
                </p>
                <h3 className="mt-2 text-3xl font-bold text-slate-900 tracking-tight">
                  {card.count}
                </h3>
              </div>
              <div className={`p-3 rounded-2xl border ${card.iconBg} ${card.iconColor} shadow-2xs`}>
                <Icon className="h-6 w-6" />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="truncate">{card.subtext}</span>
              {card.count > 0 && (
                <span className="flex items-center gap-1 font-semibold text-violet-600">
                  <TrendingUp className="h-3 w-3" />
                  Live
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

