/**
 * Performance Review Model
 */
const PerformanceReviewModel = {
  tableName: 'performance_reviews',
  fields: {
    id: { type: 'string', primaryKey: true },
    tenantId: { type: 'string', required: true },
    employeeId: { type: 'string', required: true },
    reviewerId: { type: 'string', required: true },
    cycle: { type: 'string', default: 'Annual Review 2025-2026' },
    rating: { type: 'number', default: 4.5 },
    selfAppraisal: { type: 'text', default: '' },
    managerFeedback: { type: 'text', default: '' },
    goalsAchieved: { type: 'jsonb', default: [] },
    status: { type: 'string', enum: ['Submitted', 'Under Review', 'Completed'], default: 'Completed' },
    completedDate: { type: 'date', default: 'now()' },
    createdAt: { type: 'timestamp', default: 'now()' },
    updatedAt: { type: 'timestamp', default: 'now()' },
  },
};

module.exports = PerformanceReviewModel;

