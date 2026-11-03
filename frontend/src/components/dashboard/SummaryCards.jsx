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

export default function SummaryCards() {
  const navigate = useNavigate();
  const { employees, openPositions, applicants, leaveRequests, onboardingDocuments } = useApp();

  const totalEmployees = employees.length;
  const publishedPositions = openPositions.filter((p) => p.status === 'Published').length;
  const totalApplications = applicants.length;
  const pendingApprovals =
    leaveRequests.filter((l) => l.status === 'Pending').length +
    onboardingDocuments.filter((d) => d.verificationStatus === 'Pending').length;

  const stats = [
    {
      title: 'Total Employees',
      value: totalEmployees,
      badge: 'Active Staff',
      subtext: totalEmployees === 0 ? 'No employees onboarded' : `${totalEmployees} active personnel`,
      icon: Users,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-50/80',
      path: '/hr/employees',
    },
    {
      title: 'Open Positions',
      value: publishedPositions,
      badge: 'Hiring Requisitions',
      subtext: publishedPositions === 0 ? 'No active job postings' : `${publishedPositions} published positions`,
      icon: Briefcase,
      iconColor: 'text-purple-600',
      iconBg: 'bg-purple-50/80',
      path: '/hr/positions',
    },
    {
      title: 'Applications',
      value: totalApplications,
      badge: 'Candidate Pipeline',
      subtext: totalApplications === 0 ? 'Zero candidates applied' : `${totalApplications} total applicants`,
      icon: FileText,
      iconColor: 'text-indigo-600',
      iconBg: 'bg-indigo-50/80',
      path: '/hr/applicants',
    },
    {
      title: 'Pending Approvals',
      value: pendingApprovals,
      badge: 'Action Items',
      subtext: pendingApprovals === 0 ? 'All reviews up to date' : `${pendingApprovals} requests awaiting`,
      icon: CalendarDays,
      iconColor: 'text-amber-600',
      iconBg: 'bg-amber-50/80',
      path: '/hr/leaves',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div
            key={idx}
            onClick={() => navigate(stat.path)}
            className="group bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200 cursor-pointer flex flex-col justify-between"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                  {stat.title}
                </span>
                <div className="mt-2.5 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                    {stat.value}
                  </span>
                </div>
              </div>

              <div
                className={`p-2.5 rounded-xl ${stat.iconBg} ${stat.iconColor} group-hover:scale-105 transition-transform duration-200`}
              >
                <Icon className="h-5 w-5" />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <span className="truncate max-w-[150px]">{stat.subtext}</span>
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
