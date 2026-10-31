import React, { useState } from 'react';
import {
  LifeBuoy,
  Plus,
  Search,
  FileText,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import StatusBadge from '../../components/common/StatusBadge';
import SupportRequestForm from './components/SupportRequestForm';
import EmployeeEmptyState from './components/EmployeeEmptyState';

export default function HRSupport() {
  const { currentEmployee, supportRequests = [], submitSupportRequest } = useApp();

  const employee = currentEmployee;

  const [activeFilter, setActiveFilter] = useState('All'); // 'All' | 'Open' | 'In Progress' | 'Resolved'
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!employee) {
    return (
      <div className="space-y-6">
        <div className="pb-2 border-b border-slate-200/80">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            HR Support & Helpdesk
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Submit and track HR support tickets, inquiries, and grievances.
          </p>
        </div>

        <EmployeeEmptyState
          heading="No Employee Record Found"
          description="Please contact your HR administrator."
        />
      </div>
    );
  }

  // Filter requests for this employee
  const myTickets = supportRequests.filter((s) => s.employeeId === employee.id);

  const filteredTickets = myTickets.filter((t) => {
    const matchesFilter =
      activeFilter === 'All' ||
      t.status.toLowerCase() === activeFilter.toLowerCase();
    const matchesSearch =
      t.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.ticketNumber && t.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const openCount = myTickets.filter((t) => t.status === 'Open').length;
  const inProgressCount = myTickets.filter((t) => t.status === 'In Progress').length;
  const resolvedCount = myTickets.filter((t) => t.status === 'Resolved').length;

  const handleFormSubmit = (ticketData) => {
    submitSupportRequest(ticketData);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              HR Support & Helpdesk
            </h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-violet-100 text-violet-800">
              {myTickets.length} Total Tickets
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            Submit inquiries regarding salary, attendance, leaves, or technical systems and track resolution.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-violet-600 hover:bg-violet-700 rounded-xl shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>New Support Ticket</span>
        </button>
      </div>

      {/* 2. Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
          <span className="text-xs font-semibold uppercase text-slate-400">Total Tickets</span>
          <p className="text-2xl font-bold text-slate-900 mt-2">{myTickets.length}</p>
          <span className="text-[11px] text-slate-500 mt-1 block">All submitted inquiries</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
          <span className="text-xs font-semibold uppercase text-amber-600">Open Tickets</span>
          <p className="text-2xl font-bold text-amber-700 mt-2">{openCount}</p>
          <span className="text-[11px] text-slate-500 mt-1 block">Awaiting initial HR triage</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
          <span className="text-xs font-semibold uppercase text-blue-600">In Progress</span>
          <p className="text-2xl font-bold text-blue-700 mt-2">{inProgressCount}</p>
          <span className="text-[11px] text-slate-500 mt-1 block">Active investigation</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
          <span className="text-xs font-semibold uppercase text-emerald-600">Resolved</span>
          <p className="text-2xl font-bold text-emerald-700 mt-2">{resolvedCount}</p>
          <span className="text-[11px] text-slate-500 mt-1 block">Successfully closed</span>
        </div>
      </div>

      {/* 3. Filter & Search Controls */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl w-full sm:w-auto overflow-x-auto">
          {['All', 'Open', 'In Progress', 'Resolved'].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setActiveFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                activeFilter === status
                  ? 'bg-white text-violet-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by ticket #, subject..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
          />
        </div>
      </div>

      {/* 4. Support Tickets Table / Deck */}
      {filteredTickets.length === 0 ? (
        <EmployeeEmptyState
          icon={LifeBuoy}
          heading={myTickets.length === 0 ? 'No HR Support Tickets' : 'No Matching Tickets'}
          description={
            myTickets.length === 0
              ? 'You have zero support requests. If you have an inquiry regarding payroll, leave balances, or equipment, create a ticket.'
              : 'No support tickets match the selected filter.'
          }
          actionLabel="Create Support Ticket"
          onAction={() => setIsModalOpen(true)}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900">
              Support Inquiries ({filteredTickets.length})
            </h3>
            <span className="text-xs text-slate-500">
              {openCount + inProgressCount} Pending Resolution
            </span>
          </div>

          {/* Mobile Card Deck (< md) */}
          <div className="block md:hidden divide-y divide-slate-100 p-4 space-y-3">
            {filteredTickets.map((t) => (
              <div key={t.id} className="pt-3 first:pt-0 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                      {t.ticketNumber}
                    </span>
                    <span className="font-bold text-slate-900 text-sm truncate max-w-[160px]">
                      {t.subject}
                    </span>
                  </div>
                  <StatusBadge status={t.status} size="sm" />
                </div>
                <div className="text-xs text-slate-500 flex items-center justify-between">
                  <span>{t.category}</span>
                  <StatusBadge status={t.priority} size="sm" />
                </div>
                <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg leading-relaxed">
                  {t.description}
                </p>
                {t.responseNote && (
                  <p className="text-[11px] text-violet-700 font-medium bg-violet-50/50 p-2 rounded-lg">
                    HR Response: {t.responseNote}
                  </p>
                )}
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Submitted: {t.submissionDate}</span>
                  {t.attachmentName && (
                    <span className="text-violet-700 truncate max-w-[120px]">
                      📎 {t.attachmentName}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table (>= md) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50/80 text-xs uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3.5 font-semibold">Ticket ID</th>
                  <th className="px-5 py-3.5 font-semibold">Category</th>
                  <th className="px-5 py-3.5 font-semibold">Subject & Context</th>
                  <th className="px-5 py-3.5 font-semibold">Priority</th>
                  <th className="px-5 py-3.5 font-semibold">Submitted</th>
                  <th className="px-5 py-3.5 font-semibold">Status</th>
                  <th className="px-5 py-3.5 font-semibold">HR Response Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTickets.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-4 font-mono font-bold text-slate-900 text-xs whitespace-nowrap">
                      {t.ticketNumber}
                    </td>
                    <td className="px-5 py-4 text-xs">
                      <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium">
                        {t.category}
                      </span>
                    </td>
                    <td className="px-5 py-4 max-w-xs">
                      <p className="font-bold text-slate-900 text-xs sm:text-sm">{t.subject}</p>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5" title={t.description}>
                        {t.description}
                      </p>
                      {t.attachmentName && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-violet-700 mt-1">
                          <FileText className="h-3 w-3" />
                          <span>{t.attachmentName}</span>
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <StatusBadge status={t.priority} />
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-600 whitespace-nowrap">
                      {t.submissionDate}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <StatusBadge status={t.status} />
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-500 italic max-w-xs truncate">
                      {t.responseNote ||
                        (t.status === 'Open'
                          ? 'Assigned to HR triage'
                          : t.status === 'In Progress'
                          ? 'Under HR investigation'
                          : 'Resolved')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. Support Request Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Create HR Support Request</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Direct inquiry to talent operations, payroll, or technical support.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            <SupportRequestForm
              onSubmit={handleFormSubmit}
              onCancel={() => setIsModalOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
