import React, { useState } from 'react';
import {
  Calendar,
  Plus,
  Trash2,
  Edit2,
  CalendarDays,
  Sparkles,
  Building,
  List,
  Grid,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import EmptyState from '../../components/common/EmptyState';

export default function HolidayManagement() {
  const {
    holidays,
    departments,
    addHoliday,
    updateHoliday,
    deleteHoliday,
  } = useApp();

  const [viewMode, setViewMode] = useState('list'); // 'list' | 'calendar'
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingHoliday, setEditingHoliday] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, holiday: null });

  const initialForm = {
    name: '',
    date: new Date().toISOString().split('T')[0],
    type: 'National Holiday',
    department: 'All Departments',
    description: '',
  };

  const [formData, setFormData] = useState(initialForm);

  const handleOpenAdd = () => {
    setEditingHoliday(null);
    setFormData(initialForm);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (h) => {
    setEditingHoliday(h);
    setFormData({
      name: h.name,
      date: h.date,
      type: h.type,
      department: h.department || 'All Departments',
      description: h.description || '',
    });
    setIsFormOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (editingHoliday) {
      updateHoliday(editingHoliday.id, formData);
    } else {
      addHoliday(formData);
    }
    setIsFormOpen(false);
  };

  const handleConfirmDelete = () => {
    if (!deleteDialog.holiday) return;
    deleteHoliday(deleteDialog.holiday.id);
    setDeleteDialog({ isOpen: false, holiday: null });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Company Holiday Management
            </h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-violet-100 text-violet-800">
              {holidays.length} Scheduled
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            Configure enterprise and departmental holidays visible across employee schedules.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="bg-slate-100 p-1 rounded-xl flex items-center">
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${viewMode === 'list' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
                }`}
            >
              <List className="h-4 w-4" />
              <span className="hidden sm:inline">List View</span>
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${viewMode === 'calendar' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
                }`}
            >
              <Grid className="h-4 w-4" />
              <span className="hidden sm:inline">Monthly Cards</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-violet-600 hover:bg-violet-700 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Add Holiday</span>
          </button>
        </div>
      </div>

      {/* Content View */}
      {holidays.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No Company Holidays Configured"
          description="There are currently zero holidays in the organization calendar. Add federal observances or company-wide days off to populate the employee calendar."
          actionLabel="Add Company Holiday"
          onAction={handleOpenAdd}
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
                  <th className="px-5 py-3.5 font-semibold">Applicable Scope</th>
                  <th className="px-5 py-3.5 font-semibold">Description</th>
                  <th className="px-5 py-3.5 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {holidays.map((h) => (
                  <tr key={h.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-violet-50 text-violet-700 font-bold text-center min-w-[50px]">
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
                    <td className="px-5 py-4 text-xs font-semibold text-violet-700">
                      {h.department || 'All Departments'}
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-500 max-w-sm">
                      {h.description || 'Company paid observance.'}
                    </td>
                    <td className="px-5 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(h)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteDialog({ isOpen: true, holiday: h })}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
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
                  <div className="p-2.5 rounded-xl bg-violet-50 text-violet-700 font-bold text-center">
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
                <p className="text-xs text-violet-700 font-semibold mt-1">
                  Scope: {h.department || 'All Departments'}
                </p>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  {h.description || 'Full day observance for all eligible staff.'}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end gap-1">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(h)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteDialog({ isOpen: true, holiday: h })}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {editingHoliday ? 'Edit Company Holiday' : 'Add Company Holiday'}
              </h3>
              <button onClick={() => setIsFormOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleSave} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Holiday Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Memorial Day"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Holiday Type *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-violet-500"
                  >
                    <option value="National Holiday">National Holiday</option>
                    <option value="Regional Holiday">Regional Holiday</option>
                    <option value="Company Observance">Company Observance</option>
                    <option value="Floating Holiday">Floating Holiday</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Applicable Scope *</label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-violet-500"
                >
                  <option value="All Departments">All Departments (Company-wide)</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.name}>{d.name} Department Only</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Notes, payroll remarks, or observance guidelines..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-3.5 py-2 text-slate-700 bg-white border border-slate-200 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-violet-600 rounded-xl font-semibold shadow-xs"
                >
                  Save Holiday
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        variant="danger"
        title="Remove Holiday"
        message={`Are you sure you want to delete ${deleteDialog.holiday?.name} (${deleteDialog.holiday?.date}) from the company calendar?`}
        confirmText="Remove"
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteDialog({ isOpen: false, holiday: null })}
      />
    </div>
  );
}

