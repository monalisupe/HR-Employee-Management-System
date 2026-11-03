/**
 * Employee Model
 */
const EmployeeModel = {
  tableName: 'employees',
  fields: {
    id: { type: 'string', primaryKey: true }, // e.g. EMP-101
    tenantId: { type: 'string', required: true },
    userId: { type: 'uuid', default: null },
    firstName: { type: 'string', required: true },
    lastName: { type: 'string', required: true },
    email: { type: 'string', required: true },
    phone: { type: 'string', default: '' },
    department: { type: 'string', required: true },
    designation: { type: 'string', required: true },
    joiningDate: { type: 'date', required: true },
    status: { type: 'string', enum: ['Active', 'Onboarding', 'Leave', 'Terminated'], default: 'Active' },
    employmentType: { type: 'string', default: 'Full-time' },
    managerId: { type: 'string', default: null },
    location: { type: 'string', default: 'Dallas, TX' },
    salary: { type: 'string', default: '' },
    leaveBalances: {
      type: 'jsonb',
      default: {
        annual: 15,
        earned: 15,
        sick: 10,
        casual: 7,
        unpaid: 0,
      },
    },
    emergencyContact: { type: 'jsonb', default: {} },
    assignedAssets: { type: 'jsonb', default: [] },
    createdAt: { type: 'timestamp', default: 'now()' },
    updatedAt: { type: 'timestamp', default: 'now()' },
  },
};

module.exports = EmployeeModel;

