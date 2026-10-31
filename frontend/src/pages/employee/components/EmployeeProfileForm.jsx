import React, { useState } from 'react';
import {
  Lock,
  Shield,
  FileText,
  UploadCloud,
  CheckCircle,
  AlertCircle,
  Camera,
  HeartHandshake,
  History,
} from 'lucide-react';
import StatusBadge from '../../../components/common/StatusBadge';

export default function EmployeeProfileForm({
  employee,
  onSave,
  nameChangeRequests = [],
  onSubmitNameChange,
  auditHistory = [],
}) {
  // Form State initialized from employee prop
  const [formData, setFormData] = useState(() => ({
    phone: employee?.phone || '',
    dateOfBirth: employee?.dateOfBirth || '',
    gender: employee?.gender || '',
    address: employee?.address || '',
    city: employee?.city || '',
    state: employee?.state || '',
    pinCode: employee?.pinCode || '',
    photoUrl: employee?.photoUrl || '',
    emergencyContactName: employee?.emergencyContactName || '',
    emergencyContactPhone: employee?.emergencyContactPhone || '',
    emergencyContactRelationship:
      employee?.emergencyContactRelationship ||
      employee?.emergencyContactRelation ||
      '',
    bio: employee?.bio || '',
  }));

  // Re-sync state during render if employee id changes
  const [prevEmployeeId, setPrevEmployeeId] = useState(employee?.id);
  if (employee && employee.id !== prevEmployeeId) {
    setPrevEmployeeId(employee.id);
    setFormData({
      phone: employee.phone || '',
      dateOfBirth: employee.dateOfBirth || '',
      gender: employee.gender || '',
      address: employee.address || '',
      city: employee.city || '',
      state: employee.state || '',
      pinCode: employee.pinCode || '',
      photoUrl: employee.photoUrl || '',
      emergencyContactName: employee.emergencyContactName || '',
      emergencyContactPhone: employee.emergencyContactPhone || '',
      emergencyContactRelationship:
        employee.emergencyContactRelationship ||
        employee.emergencyContactRelation ||
        '',
      bio: employee.bio || '',
    });
  }

  const [saveSuccess, setSaveSuccess] = useState(false);
  const [formError, setFormError] = useState('');

  // Name Change Request Workflow State
  const [isNameChangeModalOpen, setIsNameChangeModalOpen] = useState(false);
  const [nameChangeForm, setNameChangeForm] = useState({
    requestedName: '',
    reason: 'Marriage',
    otherReasonText: '',
    documentName: '',
    documentSize: '',
  });
  const [nameChangeError, setNameChangeError] = useState('');
  const [nameChangeFileChosen, setNameChangeFileChosen] = useState(false);

  // Profile Photo Upload Simulation
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const fakeUrl = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, photoUrl: fakeUrl }));
    }
  };

  // Profile Save Handler
  const handleProfileSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    if (formData.phone && formData.phone.length < 8) {
      setFormError('Please enter a valid phone number (minimum 8 digits).');
      return;
    }

    if (onSave && employee) {
      onSave({
        ...formData,
        emergencyContact: `${formData.emergencyContactName || ''} (${formData.emergencyContactPhone || ''}) [${formData.emergencyContactRelationship || ''}]`.trim(),
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    }
  };

  // Name Change File Selection Handler
  const handleNameChangeFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setNameChangeForm((prev) => ({
        ...prev,
        documentName: file.name,
        documentSize: `${Math.round(file.size / 1024)} KB`,
      }));
      setNameChangeFileChosen(true);
      setNameChangeError('');
    }
  };

  // Name Change Submit Handler
  const handleNameChangeSubmit = (e) => {
    e.preventDefault();
    setNameChangeError('');

    if (!nameChangeForm.requestedName.trim()) {
      setNameChangeError('Please enter your requested legal full name.');
      return;
    }

    if (nameChangeForm.requestedName.trim().toLowerCase() === employee?.name.trim().toLowerCase()) {
      setNameChangeError('Requested name cannot be identical to your current official name.');
      return;
    }

    if (!nameChangeFileChosen && !nameChangeForm.documentName) {
      setNameChangeError('Please upload a supporting legal document (Gazette notification, marriage certificate, or passport).');
      return;
    }

    const effectiveReason =
      nameChangeForm.reason === 'Other' && nameChangeForm.otherReasonText.trim()
        ? `Other: ${nameChangeForm.otherReasonText.trim()}`
        : nameChangeForm.reason;

    if (onSubmitNameChange) {
      onSubmitNameChange({
        requestedName: nameChangeForm.requestedName.trim(),
        reason: effectiveReason,
        documentName: nameChangeForm.documentName || 'Name_Change_Affidavit.pdf',
        documentSize: nameChangeForm.documentSize || '1.1 MB',
      });
    }

    setIsNameChangeModalOpen(false);
    setNameChangeForm({
      requestedName: '',
      reason: 'Marriage',
      otherReasonText: '',
      documentName: '',
      documentSize: '',
    });
    setNameChangeFileChosen(false);
  };

  if (!employee) return null;

  const employeeNameChangeRequests = nameChangeRequests.filter(
    (req) => req.employeeId === employee.id
  );

  const employeeAuditLogs = auditHistory.filter(
    (log) => log.employeeId === employee.id
  );

  return (
    <div className="space-y-6">
      {/* 1. Header Profile Identity Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            {/* Avatar & Photo Upload */}
            <div className="relative group shrink-0">
              <div className="h-20 w-20 rounded-2xl bg-gradient-to-tr from-violet-600 to-purple-600 text-white font-bold flex items-center justify-center text-2xl shadow-sm overflow-hidden border-2 border-white">
                {formData.photoUrl ? (
                  <img
                    src={formData.photoUrl}
                    alt={employee.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  employee.name.substring(0, 2).toUpperCase()
                )}
              </div>
              <label
                title="Update profile photo"
                className="absolute -bottom-1.5 -right-1.5 p-1.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl shadow-xs cursor-pointer transition-colors"
              >
                <Camera className="h-3.5 w-3.5" />
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                  {employee.name}
                </h2>
                <StatusBadge status={employee.employmentStatus} />
              </div>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                {employee.designation} • {employee.department} Department
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
                  {employee.employeeCode}
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs text-slate-500">
                  Joined {employee.joiningDate}
                </span>
              </div>
            </div>
          </div>

          {/* Legal Name Change Trigger Button */}
          <button
            type="button"
            onClick={() => setIsNameChangeModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-violet-700 bg-violet-50 hover:bg-violet-100 border border-violet-200 rounded-xl transition-colors cursor-pointer self-start md:self-center"
          >
            <Shield className="h-3.5 w-3.5" />
            <span>Request Legal Name Change</span>
          </button>
        </div>
      </div>

      {/* 2. HR-Controlled Information Card (Strictly Read-Only) */}
      <div className="bg-slate-50/80 rounded-2xl border border-slate-200/90 p-5 text-xs text-slate-600">
        <div className="flex items-center gap-2 font-bold text-slate-800 mb-1">
          <Lock className="h-4 w-4 text-violet-600" />
          <span>HR-Governed Organizational Parameters (Strictly Read-Only)</span>
        </div>
        <p className="text-[11px] text-slate-500 leading-normal">
          For tenant security, payroll compliance, and multi-tenant audit integrity, department,
          designation, official employee code, compensation, and legal name cannot be directly
          modified by employees. Formal HR authorization is required.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 mt-3 border-t border-slate-200 text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
              Assigned Department
            </span>
            <span className="font-bold text-slate-800">{employee.department}</span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
              Official Designation
            </span>
            <span className="font-bold text-slate-800">{employee.designation}</span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
              Joining Date
            </span>
            <span className="font-bold text-slate-800">{employee.joiningDate}</span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
              Salary / Compensation Band
            </span>
            <span className="font-bold text-slate-800">
              {employee.salary || 'HR Confidential / Band A'}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Permitted Personal & Contact Information Form */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Permitted Personal Information
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Update your direct contact numbers, address, and emergency contact details.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            Self-Service Active
          </span>
        </div>

        {saveSuccess && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2.5">
            <CheckCircle className="h-4 w-4 shrink-0 text-emerald-600" />
            <span>Profile information successfully updated and audit entry recorded.</span>
          </div>
        )}

        {formError && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2.5">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleProfileSubmit} className="space-y-5 text-xs sm:text-sm">
          {/* Read-Only Account Core Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <span>Official Full Name</span>
                <Lock className="h-3 w-3 text-slate-400" />
              </label>
              <input
                type="text"
                readOnly
                value={employee.name}
                className="w-full px-3 py-2 bg-slate-50 text-slate-500 border border-slate-200 rounded-xl cursor-not-allowed font-medium"
                title="Legal name can only be amended via HR Name Change Request."
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <span>Employee ID</span>
                <Lock className="h-3 w-3 text-slate-400" />
              </label>
              <input
                type="text"
                readOnly
                value={employee.employeeCode}
                className="w-full px-3 py-2 bg-slate-50 text-slate-500 border border-slate-200 rounded-xl cursor-not-allowed font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <span>Official Work Email</span>
                <Lock className="h-3 w-3 text-slate-400" />
              </label>
              <input
                type="email"
                readOnly
                value={employee.email}
                className="w-full px-3 py-2 bg-slate-50 text-slate-500 border border-slate-200 rounded-xl cursor-not-allowed"
              />
            </div>
          </div>

          {/* Editable Personal Contact Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Phone Number <span className="text-violet-600">*</span>
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 (555) 000-0000"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Date of Birth
              </label>
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Gender Identity
              </label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 bg-white"
              >
                <option value="">Select Gender</option>
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Non-Binary">Non-Binary</option>
                <option value="Prefer not to say">Prefer not to say</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Address Information Section */}
          <div className="pt-3 border-t border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Residential Address Information
            </h4>
            <div className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="e.g. 410 Congress Ave, Suite 500"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Austin"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">State / Province</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    placeholder="Texas"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">PIN / Postal Code</label>
                  <input
                    type="text"
                    value={formData.pinCode}
                    onChange={(e) => setFormData({ ...formData, pinCode: e.target.value })}
                    placeholder="78701"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Emergency Contact Section */}
          <div className="pt-3 border-t border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
              <HeartHandshake className="h-4 w-4 text-violet-600" />
              <span>Emergency Contact Details</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Emergency Contact Name
                </label>
                <input
                  type="text"
                  value={formData.emergencyContactName}
                  onChange={(e) =>
                    setFormData({ ...formData, emergencyContactName: e.target.value })
                  }
                  placeholder="e.g. Morgan Hayes"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Emergency Contact Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.emergencyContactPhone}
                  onChange={(e) =>
                    setFormData({ ...formData, emergencyContactPhone: e.target.value })
                  }
                  placeholder="+1 (555) 098-1122"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Relationship
                </label>
                <select
                  value={formData.emergencyContactRelationship}
                  onChange={(e) =>
                    setFormData({ ...formData, emergencyContactRelationship: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 bg-white"
                >
                  <option value="">Select Relationship</option>
                  <option value="Spouse">Spouse</option>
                  <option value="Parent">Parent</option>
                  <option value="Sibling">Sibling</option>
                  <option value="Child">Child</option>
                  <option value="Friend">Friend</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Save Permitted Profile Changes
            </button>
          </div>
        </form>
      </div>

      {/* 4. Name Change Request History */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">
                Official Name Change Request History
              </h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 font-semibold">
                {employeeNameChangeRequests.length}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Review history and formal approval timestamps by HR compliance officers.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsNameChangeModalOpen(true)}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-violet-600 hover:bg-violet-700 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            New Request
          </button>
        </div>

        {employeeNameChangeRequests.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            <FileText className="h-8 w-8 mx-auto text-slate-300 mb-2" />
            <p className="font-semibold text-slate-600">No name change requests submitted</p>
            <p className="mt-1 text-slate-400">
              If your legal name has changed, submit a request with supporting legal documentation.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm text-slate-600">
              <thead className="bg-slate-50/80 text-xs uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3 font-semibold">Requested Legal Name</th>
                  <th className="px-5 py-3 font-semibold">Reason</th>
                  <th className="px-5 py-3 font-semibold">Submitted On</th>
                  <th className="px-5 py-3 font-semibold">Supporting Doc</th>
                  <th className="px-5 py-3 font-semibold">Review Status</th>
                  <th className="px-5 py-3 font-semibold">Reviewer & Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {employeeNameChangeRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-3.5 font-bold text-slate-900">
                      {req.requestedName}
                    </td>
                    <td className="px-5 py-3.5 text-xs">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium">
                        {req.reason}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-slate-600 whitespace-nowrap">
                      {req.submissionDate}
                    </td>
                    <td className="px-5 py-3.5 text-xs">
                      <span className="flex items-center gap-1 text-violet-700 font-medium truncate max-w-[150px]">
                        <FileText className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">{req.documentName}</span>
                      </span>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <StatusBadge status={req.status} />
                    </td>
                    <td className="px-5 py-3.5 text-xs text-slate-500">
                      {req.reviewedBy ? (
                        <div>
                          <p className="font-semibold text-slate-700">{req.reviewedBy}</p>
                          <p className="text-[10px] text-slate-400">
                            {req.reviewedAt} • {req.notes}
                          </p>
                        </div>
                      ) : (
                        <span className="italic text-slate-400">
                          {req.notes || 'Pending HR review'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 5. Audit History Trail (Section 8: Security & Access Control) */}
      {employeeAuditLogs.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-3">
          <div className="flex items-center gap-2">
            <History className="h-4 w-4 text-violet-600" />
            <h4 className="text-sm font-bold text-slate-900">
              Profile Change Audit Trail
            </h4>
          </div>
          <p className="text-xs text-slate-500">
            Secure tenant audit record for sensitive personal and profile amendments.
          </p>

          <div className="space-y-2 pt-1">
            {employeeAuditLogs.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2"
              >
                <div>
                  <span className="font-semibold text-slate-800">{log.action}</span>
                  <p className="text-slate-500 mt-0.5">{log.fieldsChanged}</p>
                </div>
                <div className="text-right text-[11px] text-slate-400 shrink-0">
                  <span>{log.timestamp}</span>
                  <span className="block text-violet-600 font-medium">{log.source}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. Name Change Request Modal */}
      {isNameChangeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Request Official Legal Name Change
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  HR review is required. Official records remain unchanged until approval.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsNameChangeModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            {nameChangeError && (
              <div className="mt-3 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                <span>{nameChangeError}</span>
              </div>
            )}

            <form onSubmit={handleNameChangeSubmit} className="mt-4 space-y-4 text-xs">
              {/* Current Official Name (read-only) */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                  <span>Current Official Name (Read-Only)</span>
                  <Lock className="h-3 w-3 text-slate-400" />
                </label>
                <input
                  type="text"
                  readOnly
                  value={employee.name}
                  className="w-full px-3 py-2 bg-slate-100 text-slate-500 border border-slate-200 rounded-xl cursor-not-allowed font-medium"
                />
              </div>

              {/* Requested New Name */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Requested New Legal Name <span className="text-violet-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={nameChangeForm.requestedName}
                  onChange={(e) =>
                    setNameChangeForm({ ...nameChangeForm, requestedName: e.target.value })
                  }
                  placeholder="e.g. Jordan Taylor Hayes"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 font-semibold"
                />
              </div>

              {/* Reason for Change */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Reason for Legal Name Change <span className="text-violet-600">*</span>
                </label>
                <select
                  value={nameChangeForm.reason}
                  onChange={(e) =>
                    setNameChangeForm({ ...nameChangeForm, reason: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 bg-white"
                >
                  <option value="Marriage">Marriage</option>
                  <option value="Legal Name Change">Legal Name Change</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {nameChangeForm.reason === 'Other' && (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Please Specify Reason <span className="text-violet-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={nameChangeForm.otherReasonText}
                    onChange={(e) =>
                      setNameChangeForm({
                        ...nameChangeForm,
                        otherReasonText: e.target.value,
                      })
                    }
                    placeholder="Provide details on the reason for change..."
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
                  />
                </div>
              )}

              {/* Supporting Document Upload */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Supporting Legal Document <span className="text-violet-600">*</span>
                </label>
                <div className="p-4 border-2 border-dashed border-slate-200 rounded-xl text-center bg-slate-50/50">
                  <UploadCloud className="h-6 w-6 text-violet-600 mx-auto mb-1.5" />
                  <p className="font-semibold text-slate-800 text-xs">
                    Upload official proof (Marriage cert, Gazette, Passport)
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Accepted: PDF, JPG, PNG (up to 10MB)
                  </p>
                  <label className="mt-2.5 inline-block px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 font-semibold cursor-pointer hover:bg-slate-50 shadow-2xs">
                    <span>Choose File</span>
                    <input
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={handleNameChangeFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
                {nameChangeFileChosen && (
                  <p className="text-xs text-emerald-600 font-medium mt-1.5 flex items-center gap-1.5">
                    <CheckCircle className="h-3.5 w-3.5" />
                    <span>Attached: {nameChangeForm.documentName} ({nameChangeForm.documentSize})</span>
                  </p>
                )}
              </div>

              <div className="p-3 bg-violet-50 border border-violet-100 rounded-xl text-[11px] text-violet-900 leading-relaxed">
                <strong>Policy Reminder:</strong> Existing official name remains active until HR legal auditors approve your submitted supporting documents.
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNameChangeModalOpen(false)}
                  className="px-3.5 py-2 text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-violet-600 hover:bg-violet-700 rounded-xl font-bold shadow-xs cursor-pointer"
                >
                  Submit Name Change Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
