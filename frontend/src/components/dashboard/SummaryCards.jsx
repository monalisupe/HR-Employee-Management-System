import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Briefcase,
  FileText,
  CalendarDays,
  ArrowUpRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function SummaryCards({ customStats, isLoading, dateFilter }) {
  const navigate = useNavigate();
  const { employees, openPositions, applicants, leaveRequests, onboardingDocuments } = useApp();

  // If custom filtered stats are provided from Dashboard, use them; otherwise calculate from AppContext
  const totalEmployees = customStats ? customStats.totalEmployees : employees.length;
  const publishedPositions = customStats ? customStats.openPositions : openPositions.filter((p) => p.status === 'Published').length;
  const totalApplications = customStats ? customStats.totalApplications : applicants.length;
  const pendingApprovals = customStats
    ? customStats.pendingApprovals
    : leaveRequests.filter((l) => l.status === 'Pending').length +
      onboardingDocuments.filter((d) => d.verificationStatus === 'Pending').length;

  const cards = [
    {
      title: 'Total Employees',
      value: totalEmployees,
      subtext: totalEmployees === 0 ? 'No active personnel' : `${totalEmployees} active personnel`,
      icon: Users,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-50/80 border-blue-100/60',
      path: '/hr/employees',
    },
    {
      title: 'Open Positions',
      value: publishedPositions,
      subtext: publishedPositions === 0 ? 'No active postings' : `${publishedPositions} published positions`,
      icon: Briefcase,
      iconColor: 'text-purple-600',
      iconBg: 'bg-purple-50/80 border-purple-100/60',
      path: '/hr/positions',
    },
    {
      title: 'Total Applications',
      value: totalApplications,
      subtext: totalApplications === 0 ? 'Zero candidates in pool' : `${totalApplications} total applicants`,
      icon: FileText,
      iconColor: 'text-indigo-600',
      iconBg: 'bg-indigo-50/80 border-indigo-100/60',
      path: '/hr/applicants',
    },
    {
      title: 'Pending Approvals',
      value: pendingApprovals,
      subtext: pendingApprovals === 0 ? 'All reviews up to date' : `${pendingApprovals} requests awaiting`,
      icon: CalendarDays,
      iconColor: 'text-amber-600',
      iconBg: 'bg-amber-50/80 border-amber-100/60',
      path: '/hr/leaves',
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-2xs animate-pulse"
          >
            <div className="flex items-center justify-between">
              <div className="h-3 w-24 bg-slate-200 rounded" />
              <div className="h-9 w-9 bg-slate-200 rounded-xl" />
            </div>
            <div className="h-8 w-16 bg-slate-200 rounded mt-3" />
            <div className="h-2.5 w-32 bg-slate-200 rounded mt-3 pt-2" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            onClick={() => navigate(card.path)}
            className="group bg-white rounded-xl border border-slate-200/80 hover:border-slate-300 p-4 sm:p-5 shadow-2xs hover:shadow-xs hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex flex-col justify-between"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                  {card.title}
                </span>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    {card.value}
                  </span>
                </div>
              </div>

              <div
                className={`p-2.5 rounded-xl border ${card.iconBg} ${card.iconColor} group-hover:scale-105 transition-transform duration-200`}
              >
                <Icon className="h-4.5 w-4.5" />
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <span className="truncate max-w-[170px] text-[11px] text-slate-500 font-medium">
                {card.subtext}
              </span>
              <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-slate-400 group-hover:text-purple-600 transition-colors">
                <span>View</span>
                <ArrowUpRight className="h-3 w-3" />
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
