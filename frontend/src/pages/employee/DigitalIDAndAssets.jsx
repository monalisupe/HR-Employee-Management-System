import React, { useState } from 'react';
import {
  CreditCard,
  Laptop,
  Download,
  Printer,
  QrCode,
  ShieldCheck,
  Building,
  AlertTriangle,
  RefreshCw,
  HardDrive,
  Monitor,
  Key,
  CheckCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import StatusBadge from '../../components/common/StatusBadge';
import EmployeeEmptyState from './components/EmployeeEmptyState';

export default function DigitalIDAndAssets() {
  const {
    currentEmployee,
    assets = [],
    requestAssetUpgrade,
    reportAssetIssue,
  } = useApp();

  const [activeTab, setActiveTab] = useState('card'); // 'card' | 'assets'
  const [selectedAssetForAction, setSelectedAssetForAction] = useState(null);
  const [actionType, setActionType] = useState('upgrade'); // 'upgrade' | 'issue'
  const [actionReason, setActionReason] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const employee = currentEmployee;

  if (!employee) {
    return (
      <div className="space-y-6">
        <div className="pb-2 border-b border-slate-200/80">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Digital ID & Company Assets
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            View employee badge pass, assigned hardware assets, and request IT replacements.
          </p>
        </div>
        <EmployeeEmptyState
          heading="No Employee Record Found"
          description="Please contact your HR administrator."
        />
      </div>
    );
  }

  const handlePrintBadge = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Badge_${employee.name.replace(/\s+/g, '_')}</title>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; background: #f8fafc; }
              .badge { width: 340px; height: 520px; border-radius: 20px; background: linear-gradient(135deg, #6d28d9, #4f46e5); color: white; padding: 24px; box-sizing: border-box; text-align: center; box-shadow: 0 10px 25px rgba(0,0,0,0.15); position: relative; }
              .chip { width: 44px; height: 32px; background: #fcd34d; border-radius: 6px; margin: 0 auto 16px auto; }
              .avatar { width: 110px; height: 110px; border-radius: 20px; background: white; color: #6d28d9; font-size: 38px; font-weight: bold; display: flex; align-items: center; justify-content: center; margin: 0 auto 14px auto; border: 4px solid white; }
              .name { font-size: 22px; font-weight: bold; margin-bottom: 4px; }
              .title { font-size: 13px; color: #e9d5ff; margin-bottom: 12px; }
              .code { font-family: monospace; font-size: 14px; background: rgba(255,255,255,0.2); padding: 4px 12px; border-radius: 8px; display: inline-block; font-weight: bold; }
              .meta { font-size: 11px; color: #ddd6fe; margin-top: 24px; border-top: 1px solid rgba(255,255,255,0.2); padding-top: 16px; }
            </style>
          </head>
          <body>
            <div class="badge">
              <div style="font-size: 12px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 16px;">SecureTenant Enterprise</div>
              <div class="chip"></div>
              <div class="avatar">${employee.name.substring(0, 2).toUpperCase()}</div>
              <div class="name">${employee.name}</div>
              <div class="title">${employee.designation} • ${employee.department}</div>
              <div class="code">${employee.employeeCode}</div>
              <div class="meta">
                Verified Cloud Pass • Joined ${employee.joiningDate}<br>
                Security Clearance Level 3
              </div>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => printWindow.print(), 500);
    }
  };

  const openActionModal = (asset, type) => {
    setSelectedAssetForAction(asset);
    setActionType(type);
    setActionReason('');
    setIsModalOpen(true);
  };

  const handleActionSubmit = (e) => {
    e.preventDefault();
    if (!actionReason.trim()) return;

    if (actionType === 'upgrade') {
      requestAssetUpgrade(selectedAssetForAction.id, actionReason.trim());
    } else {
      reportAssetIssue(selectedAssetForAction.id, actionReason.trim());
    }
    setIsModalOpen(false);
  };

  const getAssetIcon = (category) => {
    switch (category) {
      case 'Laptop':
        return <Laptop className="h-5 w-5 text-violet-600" />;
      case 'Display':
        return <Monitor className="h-5 w-5 text-indigo-600" />;
      default:
        return <Key className="h-5 w-5 text-amber-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Digital ID Card & Assets
            </h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-violet-100 text-violet-800 border border-violet-200">
              Clearance Level 3 Verified
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            Digital employee access badge, company-issued hardware inventory, and IT upgrade requests.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="bg-slate-100 p-1 rounded-xl flex items-center self-start sm:self-auto text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('card')}
            className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'card'
                ? 'bg-white text-violet-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CreditCard className="h-3.5 w-3.5" />
            <span>Digital ID Badge</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('assets')}
            className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'assets'
                ? 'bg-white text-violet-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Laptop className="h-3.5 w-3.5" />
            <span>Assigned Assets ({assets.length})</span>
          </button>
        </div>
      </div>

      {/* 2. TAB A: Digital ID Badge (Front & Back) */}
      {activeTab === 'card' && (
        <div className="space-y-6 max-w-4xl">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Virtual Employment Identity Badge</h3>
                <p className="text-xs text-slate-500">
                  Standard contactless building pass with embedded cryptographic NFC simulation and QR verification.
                </p>
              </div>
              <button
                type="button"
                onClick={handlePrintBadge}
                className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>Print / Export Badge Pass</span>
              </button>
            </div>

            {/* Badges Preview Deck */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 justify-items-center">
              {/* Card Front */}
              <div className="w-full max-w-[340px] h-[500px] rounded-3xl bg-gradient-to-br from-violet-700 via-purple-700 to-indigo-900 text-white p-6 shadow-xl flex flex-col justify-between border-2 border-white/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-12 -mt-12 w-40 h-40 bg-white/10 rounded-full blur-xl pointer-events-none" />

                {/* Top Badge Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-white/20 backdrop-blur-xs">
                      <ShieldCheck className="h-4 w-4 text-white" />
                    </div>
                    <span className="font-bold text-xs uppercase tracking-wider">
                      SecureTenant
                    </span>
                  </div>
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/20 text-white">
                    STAFF
                  </span>
                </div>

                {/* Chip & Photo */}
                <div className="text-center space-y-3">
                  {/* Smart Card Chip */}
                  <div className="h-8 w-11 rounded-md bg-gradient-to-tr from-amber-300 to-yellow-500 mx-auto border border-amber-600/40 shadow-xs flex items-center justify-center">
                    <div className="h-4 w-6 border-y border-amber-600/40" />
                  </div>

                  {/* Photo / Initials */}
                  <div className="h-24 w-24 rounded-2xl bg-white text-violet-800 font-bold text-3xl flex items-center justify-center mx-auto shadow-md border-4 border-white/40 overflow-hidden">
                    {employee.photoUrl ? (
                      <img
                        src={employee.photoUrl}
                        alt={employee.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      employee.name.substring(0, 2).toUpperCase()
                    )}
                  </div>

                  <div>
                    <h4 className="text-lg font-bold text-white tracking-tight">
                      {employee.name}
                    </h4>
                    <p className="text-xs text-violet-200 font-medium">
                      {employee.designation}
                    </p>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-violet-300 block mt-0.5">
                      {employee.department} Department
                    </span>
                  </div>
                </div>

                {/* Bottom ID Strip */}
                <div className="pt-3 border-t border-white/20 text-center space-y-1.5">
                  <span className="font-mono text-xs font-bold px-3 py-1 rounded-lg bg-white/15 tracking-wider inline-block">
                    {employee.employeeCode}
                  </span>
                  <p className="text-[10px] text-violet-200">
                    Joined: {employee.joiningDate} • Clearance: Level 3
                  </p>
                </div>
              </div>

              {/* Card Back */}
              <div className="w-full max-w-[340px] h-[500px] rounded-3xl bg-slate-900 text-white p-6 shadow-xl flex flex-col justify-between border-2 border-slate-700 relative">
                {/* Magnetic Stripe */}
                <div className="w-full h-10 bg-slate-800 -mx-6 mt-2 border-y border-slate-700" />

                {/* Terms & Emergency Contact */}
                <div className="space-y-3 text-[11px] text-slate-300 pt-2">
                  <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                      Emergency Contact Reference
                    </span>
                    <p className="font-semibold text-white">
                      {employee.emergencyContactName || 'Designated Contact'}
                    </p>
                    <p className="text-[11px] font-mono text-slate-300 mt-0.5">
                      {employee.emergencyContactPhone || employee.phone || '+1 (555) 019-2831'}
                    </p>
                  </div>

                  <p className="leading-relaxed text-[10px] text-slate-400">
                    Property of SecureTenant Systems Inc. If found, please return to: 410 Congress Ave, Suite 500, Austin, TX 78701.
                  </p>
                </div>

                {/* Barcode & QR Code Section */}
                <div className="pt-4 border-t border-slate-800 text-center space-y-2">
                  <div className="flex items-center justify-center gap-3">
                    <div className="p-2 bg-white rounded-xl">
                      <QrCode className="h-12 w-12 text-slate-900" />
                    </div>
                    <div className="text-left font-mono text-[10px] text-slate-400">
                      <div>AUTH-TOKEN</div>
                      <div className="text-white font-bold">ST-SEC-7701</div>
                      <div className="text-emerald-400">NFC ENCRYPTED</div>
                    </div>
                  </div>
                  <span className="font-mono text-[9px] text-slate-500 block">
                    ||||| ||||||| |||| |||||||| |||||| |||||
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. TAB B: Assigned Company Assets */}
      {activeTab === 'assets' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Assigned Hardware & Security Assets
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Official equipment issued under your corporate IT custody agreement.
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                {assets.length} Active Items
              </span>
            </div>

            <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
              {assets.map((asset) => (
                <div
                  key={asset.id}
                  className="p-5 rounded-2xl border border-slate-200/90 bg-white shadow-2xs space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-start justify-between">
                      <div className="p-2.5 rounded-xl bg-violet-50 text-violet-700">
                        {getAssetIcon(asset.category)}
                      </div>
                      <StatusBadge status={asset.status} size="sm" />
                    </div>

                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{asset.name}</h4>
                      <p className="font-mono text-xs text-slate-500 font-semibold mt-0.5">
                        Serial: {asset.serialNumber}
                      </p>
                    </div>

                    <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl leading-relaxed">
                      {asset.specs}
                    </p>

                    <div className="text-[11px] text-slate-400">
                      Assigned Date: <strong className="text-slate-600">{asset.assignedDate}</strong>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openActionModal(asset, 'upgrade')}
                      className="flex-1 py-1.5 px-2 bg-violet-50 hover:bg-violet-100 text-violet-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1"
                    >
                      <RefreshCw className="h-3 w-3" />
                      <span>Upgrade</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => openActionModal(asset, 'issue')}
                      className="flex-1 py-1.5 px-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1"
                    >
                      <AlertTriangle className="h-3 w-3" />
                      <span>Report Fault</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. Upgrade / Issue Request Modal */}
      {isModalOpen && selectedAssetForAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {actionType === 'upgrade' ? 'Request Equipment Upgrade' : 'Report Hardware Issue'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Target: {selectedAssetForAction.name} ({selectedAssetForAction.serialNumber})
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

            <form onSubmit={handleActionSubmit} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {actionType === 'upgrade'
                    ? 'Reason for Hardware Upgrade / Replacement'
                    : 'Issue Description & Defect Details'}{' '}
                  <span className="text-violet-600">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={actionReason}
                  onChange={(e) => setActionReason(e.target.value)}
                  placeholder={
                    actionType === 'upgrade'
                      ? 'e.g. Higher memory required for local Docker microservices simulation...'
                      : 'e.g. USB-C port intermittently disconnecting or screen flicker...'
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 font-bold text-white rounded-xl transition-colors cursor-pointer ${
                    actionType === 'upgrade'
                      ? 'bg-violet-600 hover:bg-violet-700'
                      : 'bg-rose-600 hover:bg-rose-700'
                  }`}
                >
                  {actionType === 'upgrade' ? 'Submit Upgrade Request' : 'Dispatch IT Ticket'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

