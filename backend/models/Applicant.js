/**
 * Applicant / Candidate Application Model
 */
const ApplicantModel = {
  tableName: 'applicants',
  fields: {
    id: { type: 'string', primaryKey: true }, // e.g. app-101
    tenantId: { type: 'string', required: true },
    positionId: { type: 'string', required: true },
    jobTitle: { type: 'string', required: true },
    candidateName: { type: 'string', required: true },
    email: { type: 'string', required: true },
    phone: { type: 'string', default: '' },
    appliedDate: { type: 'date', default: 'now()' },
    status: {
      type: 'string',
      enum: ['Applied', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Selected', 'Rejected'],
      default: 'Applied',
    },
    experience: { type: 'string', default: '' },
    skills: { type: 'jsonb', default: [] },
    resumeUrl: { type: 'string', default: '' },
    coverLetter: { type: 'text', default: '' },
    recruiterNotes: { type: 'text', default: '' },
    interviewScore: { type: 'number', default: null },
    createdAt: { type: 'timestamp', default: 'now()' },
    updatedAt: { type: 'timestamp', default: 'now()' },
  },
};

module.exports = ApplicantModel;

