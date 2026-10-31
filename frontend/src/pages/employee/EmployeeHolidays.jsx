import React, { useState } from 'react';
import {
  Calendar,
  List,
  Grid,
  CalendarDays,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import EmptyState from '../../components/common/EmptyState';

export default function EmployeeHolidays() {
  const { holidays, switchRole } = useApp();
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'cards'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Company Holidays & Observances
            </h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              {holidays.length} Days Scheduled
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            Official company holiday schedule managed centrally by HR Operations.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="bg-slate-100 p-1 rounded-xl flex items-center">
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                viewMode === 'list' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <List className="h-4 w-4" />
              <span>List View</span>
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                viewMode === 'cards' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Grid className="h-4 w-4" />
              <span>Card Grid</span>
            </button>
          </div>
        </div>
      </div>

      {/* Holidays List / Cards */}
      {holidays.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No Company Holidays Configured"
          description="HR has not yet added any organization holidays to the calendar. When holidays are configured in HR Holiday Management, they will immediately appear here."
          actionLabel="Switch to HR to Add Holidays"
          onAction={() => switchRole('hr')}
        />
      ) : viewMode === 'list' ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50/80 text-xs uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3.5 font-semibold">Date</th>
                  <th className="px-5 py-3.5 font-semibold">Holiday Name</th>
                  <th className="px-5 py-3.5 font-semibold">Classification</th>
                  <th className="px-5 py-3.5 font-semibold">Department Scope</th>
                  <th className="px-5 py-3.5 font-semibold">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {holidays.map((h) => (
                  <tr key={h.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 font-bold text-center min-w-[50px]">
                          <span className="block text-[10px] uppercase">
                            {new Date(h.date).toLocaleString('default', { month: 'short' })}
                          </span>
                          <span className="block text-sm">
                            {new Date(h.date).getDate()}
                          </span>
                        </div>
                        <span className="text-xs text-slate-500 font-medium">{h.date}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 font-bold text-slate-900 text-sm">
                      {h.name}
                    </td>
                    <td className="px-5 py-4 text-xs">
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium">
                        {h.type}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs font-semibold text-emerald-700">
                      {h.department || 'All Departments'}
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-500 max-w-sm">
                      {h.description || 'Company paid observance.'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {holidays.map((h) => (
            <div
              key={h.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 font-bold text-center">
                    <span className="block text-[10px] uppercase">
                      {new Date(h.date).toLocaleString('default', { month: 'short' })}
                    </span>
                    <span className="block text-base leading-none">
                      {new Date(h.date).getDate()}
                    </span>
                  </div>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium">
                    {h.type}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-base">{h.name}</h3>
                <p className="text-xs text-emerald-700 font-semibold mt-1">
                  Scope: {h.department || 'All Departments'}
                </p>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  {h.description || 'Full day observance for all eligible staff.'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

