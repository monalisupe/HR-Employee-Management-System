import React, { useState } from 'react';
import {
  LifeBuoy,
  Plus,
  Search,
  FileText,
  MessageSquare,
  Send,
  Paperclip,
  Clock,
  User,
  ShieldAlert,
  CheckCircle,
  AlertCircle,
  CornerDownRight,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import StatusBadge from '../../components/common/StatusBadge';
import SupportRequestForm from './components/SupportRequestForm';
import EmployeeEmptyState from './components/EmployeeEmptyState';

export default function HRSupport() {
  const {
    currentEmployee,
    supportRequests = [],
    submitSupportRequest,
    addSupportTicketMessage,
  } = useApp();

  const employee = currentEmployee;

  const [activeFilter, setActiveFilter] = useState('All'); // 'All' | 'Open' | 'In Progress' | 'Resolved'
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [replyAttachment, setReplyAttachment] = useState('');

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

  const selectedTicket = supportRequests.find((t) => t.id === selectedTicketId) || null;

  const openCount = myTickets.filter((t) => t.status === 'Open').length;
  const inProgressCount = myTickets.filter((t) => t.status === 'In Progress').length;
  const resolvedCount = myTickets.filter((t) => t.status === 'Resolved').length;

  const handleFormSubmit = (ticketData) => {
    submitSupportRequest(ticketData);
    setIsCreateModalOpen(false);
  };

  const handleSendReply = (e) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedTicket) return;

    addSupportTicketMessage(selectedTicket.id, replyText.trim(), replyAttachment);
    setReplyText('');
    setReplyAttachment('');
  };

  // Compile full discussion thread for selected ticket
  const getTicketMessages = (ticket) => {
    if (!ticket) return [];
    if (ticket.messages && ticket.messages.length > 0) {
      return ticket.messages;
    }
    // Fallback to legacy structure
    const fallbackMsgs = [
      {
        id: 'msg-init-' + ticket.id,
        sender: ticket.employeeName,
        senderRole: 'employee',
        text: ticket.description,
        timestamp: ticket.submissionDate,
        attachmentName: ticket.attachmentName || '',
      },
    ];
    if (ticket.responseNote) {
      fallbackMsgs.push({
        id: 'msg-hr-' + ticket.id,
        sender: 'Sarah Jenkins (Lead HR Administrator)',
        senderRole: 'hr',
        text: ticket.responseNote,
        timestamp: ticket.resolvedAt || 'Follow-up Note',
      });
    }
    return fallbackMsgs;
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
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-violet-100 text-violet-800 border border-violet-200">
              {myTickets.length} Total Tickets
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            Submit inquiries regarding salary, attendance, leaves, or equipment, and chat directly with HR officers.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
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
            placeholder="Search tickets by subject, category, ID..."
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
          onAction={() => setIsCreateModalOpen(true)}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900">
              Support Inquiries ({filteredTickets.length})
            </h3>
            <span className="text-xs text-slate-500">
              {openCount + inProgressCount} Pending Resolution • Click row to open chat thread
            </span>
          </div>

          {/* Desktop Table (>= md) */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50/80 text-xs uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3.5 font-semibold">Ticket ID</th>
                  <th className="px-5 py-3.5 font-semibold">Category</th>
                  <th className="px-5 py-3.5 font-semibold">Subject & Query</th>
                  <th className="px-5 py-3.5 font-semibold">Priority</th>
                  <th className="px-5 py-3.5 font-semibold">Submitted</th>
                  <th className="px-5 py-3.5 font-semibold">Status</th>
                  <th className="px-5 py-3.5 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                {filteredTickets.map((t) => (
                  <tr
                    key={t.id}
                    onClick={() => setSelectedTicketId(t.id)}
                    className="hover:bg-violet-50/40 transition-colors cursor-pointer group"
                  >
                    <td className="px-5 py-4 font-mono font-bold text-slate-900 text-xs whitespace-nowrap">
                      {t.ticketNumber}
                    </td>
                    <td className="px-5 py-4 text-xs whitespace-nowrap">
                      <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium">
                        {t.category}
                      </span>
                    </td>
                    <td className="px-5 py-4 max-w-xs">
                      <p className="font-bold text-slate-900 text-xs sm:text-sm group-hover:text-violet-700 transition-colors">
                        {t.subject}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
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
                    <td className="px-5 py-4 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTicketId(t.id);
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-violet-700 bg-violet-50 group-hover:bg-violet-100 rounded-lg transition-colors cursor-pointer"
                      >
                        <MessageSquare className="h-3.5 w-3.5" />
                        <span>Thread</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. Interactive Ticket Conversation Drawer / Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-2xl bg-white rounded-2xl border border-slate-200 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-start justify-between bg-slate-50/80">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-slate-200 text-slate-800">
                    {selectedTicket.ticketNumber}
                  </span>
                  <StatusBadge status={selectedTicket.status} size="sm" />
                  <StatusBadge status={selectedTicket.priority} size="sm" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-1.5">
                  {selectedTicket.subject}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Category: {selectedTicket.category} • Submitted on {selectedTicket.submissionDate}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTicketId(null)}
                className="h-8 w-8 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600 flex items-center justify-center text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Timeline Audit Event */}
            <div className="px-5 py-2.5 bg-violet-50/60 border-b border-violet-100 text-[11px] text-violet-800 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-violet-600" />
                <span>Assigned to: <strong>Sarah Jenkins (Lead HR Administrator)</strong></span>
              </span>
              <span className="text-slate-400">Response SLA: &lt; 24h</span>
            </div>

            {/* Conversation Messages Thread */}
            <div className="p-5 flex-1 overflow-y-auto space-y-4 bg-slate-50/50">
              {getTicketMessages(selectedTicket).map((msg, index) => {
                const isEmployee = msg.senderRole === 'employee';

                return (
                  <div
                    key={msg.id || index}
                    className={`flex items-start gap-2.5 ${isEmployee ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    {/* Author Avatar Pill */}
                    <div
                      className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 shadow-xs ${
                        isEmployee
                          ? 'bg-violet-700 text-white'
                          : 'bg-indigo-600 text-white'
                      }`}
                    >
                      {isEmployee ? 'ME' : 'HR'}
                    </div>

                    <div className={`flex flex-col max-w-lg ${isEmployee ? 'items-end' : 'items-start'}`}>
                      <div className="flex items-center gap-1.5 mb-1 text-[11px] text-slate-400">
                        <span className="font-semibold text-slate-700">{msg.sender}</span>
                        <span>•</span>
                        <span>{msg.timestamp}</span>
                      </div>

                      <div
                        className={`p-4 rounded-2xl text-xs leading-relaxed shadow-xs ${
                          isEmployee
                            ? 'bg-gradient-to-tr from-violet-600 to-purple-600 text-white rounded-tr-xs'
                            : 'bg-white border border-slate-200/90 text-slate-800 rounded-tl-xs'
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{msg.text}</p>
                        {msg.attachmentName && (
                          <div
                            className={`mt-2.5 p-2 rounded-xl text-[11px] flex items-center gap-2 ${
                              isEmployee
                                ? 'bg-white/20 text-white backdrop-blur-xs'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            <FileText className="h-3.5 w-3.5" />
                            <span className="font-medium">Attached: {msg.attachmentName}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Reply Input Box */}
            <form onSubmit={handleSendReply} className="p-4 border-t border-slate-100 bg-white space-y-3">
              <div>
                <textarea
                  rows={2}
                  required
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your response to HR or provide clarification..."
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <label className="text-slate-500 hover:text-violet-700 text-xs flex items-center gap-1 cursor-pointer">
                    <Paperclip className="h-3.5 w-3.5" />
                    <span>{replyAttachment ? replyAttachment : 'Attach file'}</span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) setReplyAttachment(f.name);
                      }}
                    />
                  </label>
                  {replyAttachment && (
                    <button
                      type="button"
                      onClick={() => setReplyAttachment('')}
                      className="text-[10px] text-rose-500 hover:underline"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Send Reply</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Support Request Modal */}
      {isCreateModalOpen && (
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
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            <SupportRequestForm
              onSubmit={handleFormSubmit}
              onCancel={() => setIsCreateModalOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
