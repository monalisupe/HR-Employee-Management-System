import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Building2,
  Users,
  Briefcase,
  CheckCircle,
  Plus,
  Trash2,
  Edit2,
  Shield,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function Settings() {
  const {
    organization,
    setOrganization,
    departments,
    addDepartment,
    deleteDepartment,
    designations,
    addDesignation,
    deleteDesignation,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState('organization'); // 'organization' | 'departments' | 'roles' | 'stages'

  // Editable Organization State
  const [orgForm, setOrgForm] = useState(organization);

  // New Department Form
  const [newDeptName, setNewDeptName] = useState('');
  const [newDeptCode, setNewDeptCode] = useState('');
  const [newDeptHead, setNewDeptHead] = useState('');

  // New Designation Form
  const [newRoleTitle, setNewRoleTitle] = useState('');
  const [newRoleDept, setNewRoleDept] = useState('IT');

  const handleSaveOrg = (e) => {
    e.preventDefault();
    setOrganization(orgForm);
    showToast('Organization Settings Saved', 'Company details updated in shared local state.');
  };

  const handleAddDept = (e) => {
    e.preventDefault();
    if (!newDeptName) return;
    addDepartment({
      name: newDeptName,
      code: newDeptCode || newDeptName.toUpperCase().substring(0, 4),
      head: newDeptHead || 'Pending Assignment',
      description: 'Department operations unit.',
    });
    setNewDeptName('');
    setNewDeptCode('');
    setNewDeptHead('');
  };

  const handleAddRole = (e) => {
    e.preventDefault();
    if (!newRoleTitle) return;
    addDesignation({
      title: newRoleTitle,
      department: newRoleDept,
      level: 'Mid',
    });
    setNewRoleTitle('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Settings & Organization Architecture
            </h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-violet-100 text-violet-800">
              Tenant Control
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            Configure multi-tenant organization metadata, departments, designations, and recruitment parameters.
          </p>
        </div>
      </div>

      {/* Responsive Horizontal Tabs */}
      <div className="flex border-b border-slate-200 gap-4 sm:gap-6 text-sm font-semibold text-slate-500 overflow-x-auto whitespace-nowrap pb-px">
        <button
          type="button"
          onClick={() => setActiveTab('organization')}
          className={`pb-3 transition-colors cursor-pointer flex items-center gap-2 shrink-0 ${
            activeTab === 'organization' ? 'border-b-2 border-violet-600 text-violet-700' : 'hover:text-slate-800'
          }`}
        >
          <Building2 className="h-4 w-4" />
          <span>Organization Details</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('departments')}
          className={`pb-3 transition-colors cursor-pointer flex items-center gap-2 shrink-0 ${
            activeTab === 'departments' ? 'border-b-2 border-violet-600 text-violet-700' : 'hover:text-slate-800'
          }`}
        >
          <Users className="h-4 w-4" />
          <span>Departments ({departments.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('roles')}
          className={`pb-3 transition-colors cursor-pointer flex items-center gap-2 shrink-0 ${
            activeTab === 'roles' ? 'border-b-2 border-violet-600 text-violet-700' : 'hover:text-slate-800'
          }`}
        >
          <Briefcase className="h-4 w-4" />
          <span>Job Roles ({designations.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('stages')}
          className={`pb-3 transition-colors cursor-pointer flex items-center gap-2 shrink-0 ${
            activeTab === 'stages' ? 'border-b-2 border-violet-600 text-violet-700' : 'hover:text-slate-800'
          }`}
        >
          <Layers className="h-4 w-4" />
          <span>Recruitment Stages</span>
        </button>
      </div>

      {/* TAB 1: Organization Details */}
      {activeTab === 'organization' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs max-w-3xl">
          <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100 mb-4">
            Tenant Profile & Enterprise Attributes
          </h3>

          <form onSubmit={handleSaveOrg} className="space-y-4 text-xs sm:text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Company / Organization Name</label>
                <input
                  type="text"
                  value={orgForm.name}
                  onChange={(e) => setOrgForm({ ...orgForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tenant ID Code</label>
                <input
                  type="text"
                  disabled
                  value={orgForm.tenantId}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 text-slate-500 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Industry</label>
                <input
                  type="text"
                  value={orgForm.industry}
                  onChange={(e) => setOrgForm({ ...orgForm, industry: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Domain</label>
                <input
                  type="text"
                  value={orgForm.domain}
                  onChange={(e) => setOrgForm({ ...orgForm, domain: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Headquarters</label>
                <input
                  type="text"
                  value={orgForm.headquarters}
                  onChange={(e) => setOrgForm({ ...orgForm, headquarters: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Timezone</label>
                <input
                  type="text"
                  value={orgForm.timezone}
                  onChange={(e) => setOrgForm({ ...orgForm, timezone: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Primary Currency</label>
                <input
                  type="text"
                  value={orgForm.currency}
                  onChange={(e) => setOrgForm({ ...orgForm, currency: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold text-white bg-violet-600 hover:bg-violet-700 rounded-xl shadow-xs cursor-pointer"
              >
                Save Organization Profile
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 2: Departments Management */}
      {activeTab === 'departments' && (
        <div className="space-y-6">
          {/* Add Department Form */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
            <h3 className="text-sm font-bold text-slate-900 mb-3">Add New Department</h3>
            <form onSubmit={handleAddDept} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <input
                type="text"
                required
                placeholder="Department Name (e.g. Operations)"
                value={newDeptName}
                onChange={(e) => setNewDeptName(e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
              />
              <input
                type="text"
                placeholder="Code (e.g. OPS)"
                value={newDeptCode}
                onChange={(e) => setNewDeptCode(e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
              />
              <input
                type="text"
                placeholder="Department Lead (e.g. John Doe)"
                value={newDeptHead}
                onChange={(e) => setNewDeptHead(e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
              />
              <button
                type="submit"
                className="px-4 py-2 text-white bg-violet-600 hover:bg-violet-700 rounded-xl font-bold shadow-2xs cursor-pointer"
              >
                Add Department
              </button>
            </form>
          </div>

          {/* Departments List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {departments.map((dept) => (
              <div
                key={dept.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-violet-50 text-violet-700">
                      {dept.code}
                    </span>
                    <button
                      type="button"
                      onClick={() => deleteDepartment(dept.id)}
                      className="p-1 text-slate-300 hover:text-rose-600 rounded transition-colors cursor-pointer"
                      title="Delete Department"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <h4 className="text-base font-bold text-slate-900">{dept.name}</h4>
                  <p className="text-xs text-slate-500 mt-1">Head: {dept.head || 'Not assigned'}</p>
                  <p className="text-xs text-slate-600 mt-2">{dept.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Job Roles & Designations */}
      {activeTab === 'roles' && (
        <div className="space-y-6">
          {/* Add Designation Form */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
            <h3 className="text-sm font-bold text-slate-900 mb-3">Add Designation / Job Role</h3>
            <form onSubmit={handleAddRole} className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <input
                type="text"
                required
                placeholder="Role Title (e.g. Python Developer)"
                value={newRoleTitle}
                onChange={(e) => setNewRoleTitle(e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
              />
              <select
                value={newRoleDept}
                onChange={(e) => setNewRoleDept(e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
              >
                {departments.map((d) => (
                  <option key={d.id} value={d.name}>{d.name}</option>
                ))}
              </select>
              <button
                type="submit"
                className="px-4 py-2 text-white bg-violet-600 hover:bg-violet-700 rounded-xl font-bold shadow-2xs cursor-pointer"
              >
                Add Role
              </button>
            </form>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm text-slate-600">
                <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-3.5 font-semibold">Job Designation</th>
                    <th className="px-5 py-3.5 font-semibold">Department</th>
                    <th className="px-5 py-3.5 font-semibold">Level</th>
                    <th className="px-5 py-3.5 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {designations.map((desig) => (
                    <tr key={desig.id} className="hover:bg-slate-50/70">
                      <td className="px-5 py-3.5 font-bold text-slate-900">{desig.title}</td>
                      <td className="px-5 py-3.5 font-medium text-slate-600">{desig.department}</td>
                      <td className="px-5 py-3.5 text-xs text-slate-500">{desig.level || 'Mid'}</td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          type="button"
                          onClick={() => deleteDesignation(desig.id)}
                          className="text-slate-400 hover:text-rose-600 p-1 rounded cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Recruitment Stages */}
      {activeTab === 'stages' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs max-w-3xl space-y-4">
          <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100">
            Recruitment Funnel Pipeline Stages
          </h3>
          <p className="text-xs text-slate-500">
            These stages are actively utilized in applicant tracking, status badge updates, and interview transitions.
          </p>

          <div className="space-y-2.5 pt-2">
            {[
              { name: '1. Applied', desc: 'Initial submission from Candidate Portal. Unscreened profile.' },
              { name: '2. Under Review', desc: 'Candidate resume and qualifications currently being evaluated by recruiter.' },
              { name: '3. Shortlisted', desc: 'Applicant satisfies qualifications and is approved for interview scheduling.' },
              { name: '4. Interview Scheduled', desc: 'Screening or technical interview room, date, and interviewer assigned.' },
              { name: '5. Selected', desc: 'Candidate passed all interview rounds and is eligible for employee onboarding.' },
              { name: '6. Rejected', desc: 'Application archived without deleting candidate account or other submissions.' },
            ].map((stage, idx) => (
              <div key={idx} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <div>
                  <p className="font-bold text-xs sm:text-sm text-slate-900">{stage.name}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{stage.desc}</p>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700">
                  Active
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
