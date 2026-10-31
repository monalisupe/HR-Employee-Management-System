import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  CheckCircle,
  FileCheck,
  Award,
  Edit2,
  Clock,
  Shield,
  Building,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import StatusBadge from '../../components/common/StatusBadge';

export default function EmployeeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    employees,
    leaveRequests,
    onboardingDocuments,
    performanceReviews,
    updateEmployee,
  } = useApp();

  const employee = employees.find((e) => e.id === id);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(null);

  if (!employee) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
        <h2 className="text-lg font-bold text-slate-800">Employee Not Found</h2>
        <p className="text-xs text-slate-500 mt-1">
          The requested employee record does not exist or has been removed.
        </p>
        <button
          onClick={() => navigate('/hr/employees')}
          className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-violet-600 rounded-xl"
        >
          Back to Directory
        </button>
      </div>
    );
  }

  // Related employee records
  const empLeaves = leaveRequests.filter((l) => l.employeeId === employee.id);
  const empDocs = onboardingDocuments.filter((d) => d.employeeId === employee.id);
  const empReviews = performanceReviews.filter((r) => r.employeeId === employee.id);

  const handleStartEdit = () => {
    setFormData({
      phone: employee.phone || '',
      emergencyContact: employee.emergencyContact || '',
      address: employee.address || '',
      annualLeaveBalance: employee.annualLeaveBalance || 15,
      employmentStatus: employee.employmentStatus,
      onboardingProgress: employee.onboardingProgress || 100,
    });
    setIsEditing(true);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    updateEmployee(employee.id, formData);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Back button & Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/hr/employees')}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                {employee.name}
              </h1>
              <span className="font-mono text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                {employee.employeeCode}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              {employee.designation} • {employee.department} • Joined {employee.joiningDate}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleStartEdit}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl shadow-2xs transition-colors cursor-pointer"
        >
          <Edit2 className="h-3.5 w-3.5" />
          <span>Edit Profile</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Profile Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3.5">
                <div className="h-14 w-14 rounded-2xl bg-violet-100 text-violet-700 font-bold flex items-center justify-center text-xl">
                  {employee.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{employee.name}</h3>
                  <p className="text-xs text-slate-500">{employee.email}</p>
                </div>
              </div>
              <StatusBadge status={employee.employmentStatus} size="md" />
            </div>

            {/* Profile Grid */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] font-semibold text-slate-400 uppercase block">Department</span>
                <span className="font-semibold text-slate-800 text-sm mt-0.5 block">{employee.department}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] font-semibold text-slate-400 uppercase block">Designation / Role</span>
                <span className="font-semibold text-slate-800 text-sm mt-0.5 block">{employee.designation}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] font-semibold text-slate-400 uppercase block">Contact Phone</span>
                <span className="font-semibold text-slate-800 text-sm mt-0.5 block">{employee.phone || 'None'}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] font-semibold text-slate-400 uppercase block">Reporting Manager</span>
                <span className="font-semibold text-slate-800 text-sm mt-0.5 block">{employee.reportingManager || 'Sarah Jenkins'}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] font-semibold text-slate-400 uppercase block">Office / Location</span>
                <span className="font-semibold text-slate-800 text-sm mt-0.5 block">{employee.location || 'Austin HQ'}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] font-semibold text-slate-400 uppercase block">Emergency Contact</span>
                <span className="font-semibold text-slate-800 text-sm mt-0.5 block">{employee.emergencyContact || 'Pending'}</span>
              </div>
            </div>

            {/* Onboarding progress & Leave summary */}
            <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-xs font-bold text-slate-700 block mb-1">
                  Onboarding Completion ({employee.onboardingProgress || 0}%)
                </span>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className="bg-violet-600 h-2 rounded-full"
                    style={{ width: `${employee.onboardingProgress || 0}%` }}
                  />
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-slate-700 block mb-1">
                  Available Annual Leave Balance
                </span>
                <p className="text-lg font-bold text-violet-700">
                  {employee.annualLeaveBalance || 0} Days
                </p>
              </div>
            </div>
          </div>

          {/* Submitted Documents Section */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
            <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 mb-3">
              Employee Onboarding Documents ({empDocs.length})
            </h3>
            {empDocs.length === 0 ? (
              <p className="text-xs text-slate-400 py-3 text-center">No documents submitted yet.</p>
            ) : (
              <div className="space-y-2">
                {empDocs.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 text-xs">
                    <div className="flex items-center gap-2.5">
                      <FileCheck className="h-4 w-4 text-violet-600" />
                      <div>
                        <p className="font-semibold text-slate-800">{doc.documentName}</p>
                        <p className="text-[11px] text-slate-400">{doc.documentType} • Submitted {doc.submissionDate}</p>
                      </div>
                    </div>
                    <StatusBadge status={doc.verificationStatus} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar: Performance & Leave Requests */}
        <div className="space-y-6">
          {/* Recent Leave Requests */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
            <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 mb-3">
              Leave History ({empLeaves.length})
            </h3>
            {empLeaves.length === 0 ? (
              <p className="text-xs text-slate-400 py-3 text-center">No leave requests recorded.</p>
            ) : (
              <div className="space-y-2">
                {empLeaves.map((leave) => (
                  <div key={leave.id} className="p-2.5 rounded-xl border border-slate-100 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-slate-800">{leave.leaveType}</span>
                      <StatusBadge status={leave.status} />
                    </div>
                    <p className="text-[11px] text-slate-500">{leave.startDate} to {leave.endDate} ({leave.daysCount} days)</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Performance Reviews */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
            <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 mb-3">
              Appraisals & Reviews ({empReviews.length})
            </h3>
            {empReviews.length === 0 ? (
              <p className="text-xs text-slate-400 py-3 text-center">No performance reviews recorded.</p>
            ) : (
              <div className="space-y-3">
                {empReviews.map((rev) => (
                  <div key={rev.id} className="p-3 rounded-xl border border-slate-100 text-xs">
                    <div className="flex items-center justify-between font-bold text-slate-800 mb-1">
                      <span>{rev.reviewPeriod}</span>
                      <span className="text-amber-500">★ {rev.rating}</span>
                    </div>
                    <p className="text-slate-600 text-[11px] mt-1">{rev.managerFeedback}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Edit Employee Details</h3>
              <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <form onSubmit={handleSaveEdit} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Phone</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Emergency Contact</label>
                <input
                  type="text"
                  value={formData.emergencyContact}
                  onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Annual Leave Days</label>
                <input
                  type="number"
                  value={formData.annualLeaveBalance}
                  onChange={(e) => setFormData({ ...formData, annualLeaveBalance: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Employment Status</label>
                <select
                  value={formData.employmentStatus}
                  onChange={(e) => setFormData({ ...formData, employmentStatus: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                >
                  <option value="Active">Active</option>
                  <option value="Onboarding">Onboarding</option>
                  <option value="On Leave">On Leave</option>
                  <option value="Terminated">Terminated</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1.5 text-slate-700 bg-white border border-slate-200 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 text-white bg-violet-600 rounded-lg font-semibold"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

