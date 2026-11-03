/**
 * Payslip Model
 */
const PayslipModel = {
  tableName: 'payslips',
  fields: {
    id: { type: 'string', primaryKey: true },
    tenantId: { type: 'string', required: true },
    employeeId: { type: 'string', required: true },
    month: { type: 'string', required: true }, // e.g. "February 2026"
    payPeriod: { type: 'string', default: '01 Feb 2026 - 28 Feb 2026' },
    basicSalary: { type: 'number', required: true },
    hra: { type: 'number', default: 0 },
    specialAllowance: { type: 'number', default: 0 },
    grossEarnings: { type: 'number', required: true },
    providentFund: { type: 'number', default: 0 },
    taxDeduction: { type: 'number', default: 0 },
    totalDeductions: { type: 'number', default: 0 },
    netPay: { type: 'number', required: true },
    status: { type: 'string', enum: ['Paid', 'Processing', 'Hold'], default: 'Paid' },
    payoutDate: { type: 'date', default: 'now()' },
    createdAt: { type: 'timestamp', default: 'now()' },
    updatedAt: { type: 'timestamp', default: 'now()' },
  },
};

module.exports = PayslipModel;
