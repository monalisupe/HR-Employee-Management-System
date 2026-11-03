/**
 * Attendance Log Model
 */
const AttendanceModel = {
  tableName: 'attendance_logs',
  fields: {
    id: { type: 'string', primaryKey: true },
    tenantId: { type: 'string', required: true },
    employeeId: { type: 'string', required: true },
    date: { type: 'date', required: true },
    clockIn: { type: 'string', default: '09:00 AM' },
    clockOut: { type: 'string', default: '06:00 PM' },
    workHours: { type: 'string', default: '8h 00m' },
    status: { type: 'string', enum: ['Present', 'Absent', 'Half-Day', 'On Leave'], default: 'Present' },
    location: { type: 'string', default: 'Office' },
    createdAt: { type: 'timestamp', default: 'now()' },
    updatedAt: { type: 'timestamp', default: 'now()' },
  },
};

module.exports = AttendanceModel;
