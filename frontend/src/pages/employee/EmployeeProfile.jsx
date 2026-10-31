import React from 'react';
import { useApp } from '../../context/AppContext';
import EmployeeProfileForm from './components/EmployeeProfileForm';
import EmployeeEmptyState from './components/EmployeeEmptyState';

export default function EmployeeProfile() {
  const {
    currentEmployee,
    updateEmployeeProfile,
    nameChangeRequests,
    submitNameChangeRequest,
    profileAuditHistory,
  } = useApp();

  const employee = currentEmployee;

  if (!employee) {
    return (
      <div className="space-y-6">
        <div className="pb-2 border-b border-slate-200/80">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            My Employee Profile
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Personal employment dossier, contact details, and formal name change workflow.
          </p>
        </div>

        <EmployeeEmptyState
          heading="No Employee Record Found"
          description="Please contact your HR administrator."
        />
      </div>
    );
  }

  const handleSaveProfile = (updatedData) => {
    updateEmployeeProfile(employee.id, updatedData);
  };

  const handleNameChange = (requestData) => {
    submitNameChangeRequest(requestData);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              My Employee Profile
            </h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-violet-100 text-violet-800 border border-violet-200">
              Tenant Verified
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            Manage your personal contact details. Department, designation, salary and official legal name are HR-controlled.
          </p>
        </div>
      </div>

      {/* Main Profile Form & Workflows */}
      <EmployeeProfileForm
        employee={employee}
        onSave={handleSaveProfile}
        nameChangeRequests={nameChangeRequests}
        onSubmitNameChange={handleNameChange}
        auditHistory={profileAuditHistory}
      />
    </div>
  );
}
