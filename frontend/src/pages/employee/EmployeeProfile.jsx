import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  Lock,
  Briefcase,
  Shield,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import StatusBadge from '../../components/common/StatusBadge';
import EmptyState from '../../components/common/EmptyState';

export default function EmployeeProfile() {
  const { currentEmployee, updateEmployeeProfile } = useApp();

  const employee = currentEmployee;

  const [formData, setFormData] = useState({
    phone: employee?.phone || '',
    email: employee?.email || '',
    emergencyContact: employee?.emergencyContact || '',
    address: employee?.address || '',
    location: employee?.location || 'Austin HQ',
    bio: employee?.bio || 'Dedicated team member passionate about quality enterprise software.',
  });

  const handleSave = (e) => {
    e.preventDefault();
    if (!employee) return;
    updateEmployeeProfile(employee.id, formData);
  };

  if (!employee) {
    return (
      <EmptyState
        icon={User}
        title="No Employee Record Found"
        description="Please contact your HR administrator."
      />
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            My Employee Profile
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Manage your personal contact details. Enterprise organizational fields are HR-controlled.
          </p>
        </div>
      </div>

      {/* Main Dossier */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white font-bold flex items-center justify-center text-xl shadow-xs">
              {employee.name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900">{employee.name}</h2>
                <StatusBadge status={employee.employmentStatus} />
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {employee.designation} • {employee.department}
              </p>
              <span className="inline-block mt-1 font-mono text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                {employee.employeeCode}
              </span>
            </div>
          </div>
        </div>

        {/* HR Controlled Fields Banner */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
          <div className="flex items-center gap-2 font-bold text-slate-800 mb-1">
            <Lock className="h-4 w-4 text-slate-500" />
            <span>HR-Managed Parameters (Read Only)</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-normal">
            For security and auditing compliance, designations, employee codes, salary bands, and department assignments can only be amended by HR Administrators.
          </p>

          <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-200/80 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Department</span>
              <span className="font-semibold text-slate-800">{employee.department}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Designation</span>
              <span className="font-semibold text-slate-800">{employee.designation}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Joining Date</span>
              <span className="font-semibold text-slate-800">{employee.joiningDate}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Reporting Manager</span>
              <span className="font-semibold text-slate-800">{employee.reportingManager || 'Sarah Jenkins'}</span>
            </div>
          </div>
        </div>

        {/* Permitted Profile Edit Form */}
        <form onSubmit={handleSave} className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 pt-2 border-t border-slate-100">
            Personal & Contact Details (Editable)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Work Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 (555) 000-0000"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Office / Work Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Emergency Contact Information</label>
              <input
                type="text"
                value={formData.emergencyContact}
                onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                placeholder="e.g. Morgan Hayes (+1 555-098-1122)"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1">Home / Residential Address</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="e.g. 410 Congress Ave, Suite 500, Austin, TX"
              className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1">Personal Bio & Professional Notes</label>
            <textarea
              rows={3}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

