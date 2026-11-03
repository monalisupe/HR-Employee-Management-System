/**
 * Leave Request Model
 */
const LeaveRequestModel = {
  tableName: 'leave_requests',
  fields: {
    id: { type: 'string', primaryKey: true }, // e.g. lv-101
    tenantId: { type: 'string', required: true },
    employeeId: { type: 'string', required: true },
    employeeName: { type: 'string', required: true },
    leaveType: {
      type: 'string',
      enum: ['Casual Leave', 'Sick Leave', 'Earned Leave', 'Unpaid Leave'],
      required: true,
    },
    startDate: { type: 'date', required: true },
    endDate: { type: 'date', required: true },
    totalDays: { type: 'number', required: true },
    reason: { type: 'text', required: true },
    status: { type: 'string', enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
    appliedDate: { type: 'date', default: 'now()' },
    reviewedBy: { type: 'string', default: null },
    reviewComments: { type: 'text', default: '' },
    createdAt: { type: 'timestamp', default: 'now()' },
    updatedAt: { type: 'timestamp', default: 'now()' },
  },
};

module.exports = LeaveRequestModel;

