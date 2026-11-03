/**
 * System-Wide Constants & Enums
 * Aligned directly with HireFlow frontend models and application context.
 */

const ROLES = {
  HR_ADMIN: 'hr',
  CANDIDATE: 'candidate',
  EMPLOYEE: 'employee',
};

const APPLICANT_STAGES = {
  APPLIED: 'Applied',
  SCREENING: 'Under Review',
  SHORTLISTED: 'Shortlisted',
  INTERVIEW_SCHEDULED: 'Interview Scheduled',
  SELECTED: 'Selected',
  REJECTED: 'Rejected',
};

const JOB_STATUSES = {
  DRAFT: 'Draft',
  PUBLISHED: 'Published',
  CLOSED: 'Closed',
};

const LEAVE_STATUSES = {
  PENDING: 'Pending',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
};

const LEAVE_TYPES = {
  CASUAL: 'Casual Leave',
  SICK: 'Sick Leave',
  EARNED: 'Earned Leave',
  UNPAID: 'Unpaid Leave',
};

const DOCUMENT_STATUSES = {
  PENDING: 'Pending',
  VERIFIED: 'Verified',
  REJECTED: 'Rejected',
};

const ATTENDANCE_STATUSES = {
  PRESENT: 'Present',
  ABSENT: 'Absent',
  HALF_DAY: 'Half-Day',
  ON_LEAVE: 'On Leave',
};

const DATE_FILTERS = {
  TODAY: 'today',
  WEEK: 'week',
  MONTH: 'month',
  ALL: 'all',
};

module.exports = {
  ROLES,
  APPLICANT_STAGES,
  JOB_STATUSES,
  LEAVE_STATUSES,
  LEAVE_TYPES,
  DOCUMENT_STATUSES,
  ATTENDANCE_STATUSES,
  DATE_FILTERS,
};
