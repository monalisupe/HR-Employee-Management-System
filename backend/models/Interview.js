/**
 * Interview Model
 */
const InterviewModel = {
  tableName: 'interviews',
  fields: {
    id: { type: 'string', primaryKey: true }, // e.g. int-101
    tenantId: { type: 'string', required: true },
    applicantId: { type: 'string', required: true },
    candidateName: { type: 'string', required: true },
    jobTitle: { type: 'string', required: true },
    round: { type: 'string', default: 'Technical Assessment' },
    interviewDate: { type: 'date', required: true },
    interviewTime: { type: 'string', default: '10:00 AM' },
    interviewer: { type: 'string', required: true },
    meetingLink: { type: 'string', default: '' },
    result: { type: 'string', enum: ['Scheduled', 'Completed', 'Cancelled', 'Passed', 'Failed'], default: 'Scheduled' },
    score: { type: 'number', default: null },
    feedback: { type: 'text', default: '' },
    createdAt: { type: 'timestamp', default: 'now()' },
    updatedAt: { type: 'timestamp', default: 'now()' },
  },
};

module.exports = InterviewModel;
