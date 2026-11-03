import React, { useState } from 'react';
import {
  FileText,
  Download,
  Eye,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  Calendar,
  Building2,
  Lock,
  CheckCircle2,
  Printer,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import StatusBadge from '../../components/common/StatusBadge';
import EmployeeEmptyState from './components/EmployeeEmptyState';

export default function Payslips() {
  const { currentEmployee, payslips = [] } = useApp();
  const [selectedSlip, setSelectedSlip] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const employee = currentEmployee;

  if (!employee) {
    return (
      <div className="space-y-6">
        <div className="pb-2 border-b border-slate-200/80">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Compensation & Payslips
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            View monthly salary statements, tax projections, and download pay stubs.
          </p>
        </div>
        <EmployeeEmptyState
          heading="No Employee Record Found"
          description="Please contact your HR administrator."
        />
      </div>
    );
  }

  const latestSlip = payslips[0];

  const handleDownloadPDF = (slip) => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      // Simulated browser print/download dialog
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Payslip_${slip.month.replace(/\s+/g, '_')}_${employee.name.replace(/\s+/g, '_')}</title>
              <style>
                body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; color: #1e293b; }
                .header { border-bottom: 2px solid #7c3aed; padding-bottom: 16px; margin-bottom: 24px; }
                .title { font-size: 24px; font-weight: bold; color: #6d28d9; }
                .subtitle { font-size: 14px; color: #64748b; margin-top: 4px; }
                .grid { display: flex; justify-content: space-between; margin-bottom: 24px; }
                .box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; width: 48%; }
                table { width: 100%; border-collapse: collapse; margin-top: 16px; }
                th, td { text-align: left; padding: 10px; border-bottom: 1px solid #e2e8f0; font-size: 13px; }
                th { background: #f1f5f9; color: #475569; }
                .total { font-weight: bold; font-size: 15px; color: #0f172a; }
                .net-pay { background: #faf5ff; border: 2px solid #c084fc; border-radius: 8px; padding: 16px; text-align: center; margin-top: 24px; font-size: 18px; font-weight: bold; color: #6b21a8; }
              </style>
            </head>
            <body>
              <div class="header">
                <div class="title">SecureTenant Enterprise</div>
                <div class="subtitle">Official Monthly Compensation Statement • ${slip.month}</div>
              </div>
              <div class="grid">
                <div class="box">
                  <strong>Employee Information</strong><br>
                  Name: ${employee.name}<br>
                  ID: ${employee.employeeCode}<br>
                  Designation: ${employee.designation}<br>
                  Department: ${employee.department}<br>
                </div>
                <div class="box">
                  <strong>Payment Reference</strong><br>
                  Pay Slip No: ${slip.slipNumber}<br>
                  Payment Date: ${slip.payDate}<br>
                  Bank: ${slip.bankName}<br>
                  Account: ${slip.accountMasked}<br>
                </div>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Earnings</th><th>Amount ($)</th>
                    <th>Deductions</th><th>Amount ($)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Basic Pay</td><td>$${slip.earnings.basic.toLocaleString()}</td>
                    <td>Provident Fund (401k)</td><td>$${slip.deductions.providentFund.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td>House Rent Allowance (HRA)</td><td>$${slip.earnings.hra.toLocaleString()}</td>
                    <td>Health Insurance</td><td>$${slip.deductions.healthInsurance.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td>Special Allowance</td><td>$${slip.earnings.specialAllowance.toLocaleString()}</td>
                    <td>Tax Deducted at Source (TDS)</td><td>$${slip.deductions.taxDeducted.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td>Performance Incentive</td><td>$${slip.earnings.performanceBonus.toLocaleString()}</td>
                    <td>Professional Tax</td><td>$${slip.deductions.professionalTax.toLocaleString()}</td>
                  </tr>
                  <tr class="total">
                    <td>Gross Earnings</td><td>$${slip.grossEarnings.toLocaleString()}</td>
                    <td>Total Deductions</td><td>$${slip.totalDeductions.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
              <div class="net-pay">
                NET PAYABLE: $${slip.netPay.toLocaleString()} (Paid via Direct Deposit)
              </div>
              <p style="font-size: 11px; color: #94a3b8; text-align: center; margin-top: 30px;">
                This is a computer-generated payroll advice document from SecureTenant multi-tenant cloud HR platform. No signature required.
              </p>
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => printWindow.print(), 500);
      }
    }, 400);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Compensation & Payslips
            </h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-violet-100 text-violet-800 border border-violet-200">
              Direct Deposit Active
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">
            Review monthly paychecks, tax withholdings, and download audit-certified salary stubs.
          </p>
        </div>

        {latestSlip && (
          <button
            type="button"
            onClick={() => handleDownloadPDF(latestSlip)}
            disabled={isDownloading}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-violet-600 hover:bg-violet-700 rounded-xl shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Download className="h-4 w-4" />
            <span>{isDownloading ? 'Generating PDF...' : 'Download Latest Pay Stub'}</span>
          </button>
        )}
      </div>

      {/* 2. KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400">Annual Base CTC</span>
            <div className="p-2 rounded-xl bg-violet-50 text-violet-600">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">
            {employee.salary || '$115,000 / yr'}
          </p>
          <span className="text-[11px] text-slate-500 mt-1 block">HR Band A • Semi-annual review</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400">Last Net Take-Home</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-emerald-600 mt-2">
            ${latestSlip ? latestSlip.netPay.toLocaleString() : '7,288'}
          </p>
          <span className="text-[11px] text-slate-500 mt-1 block">
            {latestSlip ? `Deposited on ${latestSlip.payDate}` : 'End of month cycle'}
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400">Tax Deducted (YTD)</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <ShieldCheck className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">$4,200</p>
          <span className="text-[11px] text-slate-500 mt-1 block">TDS & Federal withholdings</span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400">Next Pay Day</span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Calendar className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-indigo-700 mt-2">April 30, 2026</p>
          <span className="text-[11px] text-slate-500 mt-1 block">Scheduled automated payroll</span>
        </div>
      </div>

      {/* 3. Annual Tax Estimation & W-2 / Form 16 Projection Card */}
      <div className="bg-gradient-to-r from-violet-900 via-purple-900 to-indigo-950 rounded-2xl p-6 text-white shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-5 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/20 text-violet-200 border border-white/20">
                Tax Year 2026 Projection
              </span>
              <span className="text-xs text-emerald-300 font-semibold flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Withholding Compliant
              </span>
            </div>
            <h3 className="text-xl font-bold mt-1.5 tracking-tight">
              Annual Compensation & Withholding Estimate (Form 16 / W-2)
            </h3>
            <p className="text-xs text-violet-200 mt-0.5">
              Automated multi-tier federal and state tax projection based on your declared exemptions.
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs text-violet-300 uppercase block font-semibold">Projected Net Annual</span>
            <span className="text-2xl font-bold text-white">$87,456</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 text-xs">
          <div className="p-3 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10">
            <span className="text-violet-300 text-[11px] block">Gross Projected CTC</span>
            <span className="text-base font-bold text-white mt-0.5 block">$115,000</span>
          </div>
          <div className="p-3 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10">
            <span className="text-violet-300 text-[11px] block">Standard Deduction</span>
            <span className="text-base font-bold text-emerald-300 mt-0.5 block">-$12,500</span>
          </div>
          <div className="p-3 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10">
            <span className="text-violet-300 text-[11px] block">Taxable Income</span>
            <span className="text-base font-bold text-white mt-0.5 block">$102,500</span>
          </div>
          <div className="p-3 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10">
            <span className="text-violet-300 text-[11px] block">Estimated Total Tax</span>
            <span className="text-base font-bold text-amber-300 mt-0.5 block">$17,400</span>
          </div>
        </div>

        {/* Visual Retention Bar */}
        <div className="pt-4 mt-3 border-t border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs text-violet-200">
            <span>Take-Home Retention Rate: <strong className="text-emerald-300">76% Net Payout</strong></span>
            <span>Total Statutory Deductions: <strong className="text-rose-300">24% Withheld</strong></span>
          </div>
          <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden flex">
            <div className="bg-emerald-400 h-full rounded-l-full" style={{ width: '76%' }} title="Net Take Home (76%)" />
            <div className="bg-rose-400 h-full rounded-r-full" style={{ width: '24%' }} title="Statutory Deductions & Taxes (24%)" />
          </div>
        </div>
      </div>

      {/* 4. Monthly Pay Statements Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Monthly Paycheck Statements</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Review breakdowns, deductions, and download verifiable pay stubs.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
            {payslips.length} Statements on File
          </span>
        </div>

        {payslips.length === 0 ? (
          <EmployeeEmptyState
            icon={FileText}
            heading="No Salary Slips Generated Yet"
            description="Your payroll cycle records will appear here as soon as HR and Finance process the pay cycle."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50/80 text-xs uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3.5 font-semibold">Month & Period</th>
                  <th className="px-5 py-3.5 font-semibold">Slip Reference</th>
                  <th className="px-5 py-3.5 font-semibold">Disbursement Date</th>
                  <th className="px-5 py-3.5 font-semibold">Gross Earnings</th>
                  <th className="px-5 py-3.5 font-semibold">Deductions</th>
                  <th className="px-5 py-3.5 font-semibold">Net Pay</th>
                  <th className="px-5 py-3.5 font-semibold">Status</th>
                  <th className="px-5 py-3.5 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                {payslips.map((slip) => (
                  <tr key={slip.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-4 font-bold text-slate-900 flex items-center gap-2">
                      <FileText className="h-4 w-4 text-violet-600 shrink-0" />
                      <span>{slip.month}</span>
                    </td>
                    <td className="px-5 py-4 font-mono text-xs text-slate-500 font-semibold">
                      {slip.slipNumber}
                    </td>
                    <td className="px-5 py-4 text-slate-600">{slip.payDate}</td>
                    <td className="px-5 py-4 font-semibold text-slate-800">
                      ${slip.grossEarnings.toLocaleString()}
                    </td>
                    <td className="px-5 py-4 text-rose-600 font-medium">
                      -${slip.totalDeductions.toLocaleString()}
                    </td>
                    <td className="px-5 py-4 font-bold text-emerald-700 text-sm sm:text-base">
                      ${slip.netPay.toLocaleString()}
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={slip.status} size="sm" />
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedSlip(slip)}
                          className="px-3 py-1.5 text-xs font-semibold text-violet-700 bg-violet-50 hover:bg-violet-100 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span>Breakdown</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDownloadPDF(slip)}
                          className="p-1.5 text-slate-500 hover:text-violet-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          title="Download PDF"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 5. Detailed Pay Slip Breakdown Modal */}
      {selectedSlip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-2xl bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-6 bg-gradient-to-r from-violet-700 to-purple-800 text-white flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-violet-200">
                  SecureTenant Enterprise Payroll
                </span>
                <h3 className="text-xl font-bold mt-1">
                  Salary Statement • {selectedSlip.month}
                </h3>
                <p className="text-xs text-violet-100 mt-0.5">
                  Ref: {selectedSlip.slipNumber} • Paid on {selectedSlip.payDate}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSlip(null)}
                className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs sm:text-sm">
              {/* Employee & Bank Summary Box */}
              <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-400 font-bold uppercase text-[10px] block">Employee</span>
                  <p className="font-bold text-slate-900 mt-0.5">{employee.name}</p>
                  <p className="text-slate-500 font-mono text-[11px]">{employee.employeeCode}</p>
                  <p className="text-slate-600 mt-1">{employee.designation} • {employee.department}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-bold uppercase text-[10px] block">Direct Deposit</span>
                  <p className="font-bold text-slate-900 mt-0.5">{selectedSlip.bankName}</p>
                  <p className="text-slate-500 font-mono text-[11px]">{selectedSlip.accountMasked}</p>
                  <p className="text-slate-600 mt-1">PAN: {selectedSlip.panNumber}</p>
                </div>
              </div>

              {/* Earnings & Deductions Tables */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Earnings */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <span className="font-bold text-slate-900 uppercase text-xs">Earnings</span>
                    <span className="text-xs font-semibold text-slate-500">Amount</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Basic Salary</span>
                      <span className="font-semibold text-slate-800">${selectedSlip.earnings.basic.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">House Rent Allowance (HRA)</span>
                      <span className="font-semibold text-slate-800">${selectedSlip.earnings.hra.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Special Allowance</span>
                      <span className="font-semibold text-slate-800">${selectedSlip.earnings.specialAllowance.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Performance Incentive</span>
                      <span className="font-semibold text-emerald-600">+${selectedSlip.earnings.performanceBonus.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-xs text-slate-900">
                    <span>Total Gross Earnings</span>
                    <span>${selectedSlip.grossEarnings.toLocaleString()}</span>
                  </div>
                </div>

                {/* Deductions */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <span className="font-bold text-slate-900 uppercase text-xs">Deductions</span>
                    <span className="text-xs font-semibold text-slate-500">Amount</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Provident Fund (401k)</span>
                      <span className="font-semibold text-rose-600">-${selectedSlip.deductions.providentFund.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Health Care Insurance</span>
                      <span className="font-semibold text-rose-600">-${selectedSlip.deductions.healthInsurance.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Tax Withholding (TDS)</span>
                      <span className="font-semibold text-rose-600">-${selectedSlip.deductions.taxDeducted.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Professional Tax</span>
                      <span className="font-semibold text-rose-600">-${selectedSlip.deductions.professionalTax.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-xs text-slate-900">
                    <span>Total Deductions</span>
                    <span className="text-rose-600">-${selectedSlip.totalDeductions.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Net Pay Highlight Banner */}
              <div className="p-4 rounded-xl bg-violet-50 border border-violet-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-violet-700 block tracking-wider">
                    Net Take-Home Pay
                  </span>
                  <p className="text-2xl font-bold text-violet-900">
                    ${selectedSlip.netPay.toLocaleString()}
                  </p>
                  <p className="text-xs text-violet-700 mt-0.5">Credited via ACH Direct Deposit</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleDownloadPDF(selectedSlip)}
                    className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Download Slip</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedSlip(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 cursor-pointer"
              >
                Close Statement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

