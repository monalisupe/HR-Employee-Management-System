/**
 * Job Position / Requisition Model
 */
const JobPositionModel = {
  tableName: 'job_positions',
  fields: {
    id: { type: 'string', primaryKey: true }, // e.g. pos-101
    tenantId: { type: 'string', required: true },
    title: { type: 'string', required: true },
    department: { type: 'string', required: true },
    designation: { type: 'string', required: true },
    location: { type: 'string', default: 'Remote' },
    employmentType: { type: 'string', default: 'Full-time' },
    description: { type: 'text', required: true },
    qualifications: { type: 'text', default: '' },
    skills: { type: 'jsonb', default: [] },
    experience: { type: 'string', default: '2+ years' },
    recruiter: { type: 'string', default: '' },
    salaryRange: { type: 'string', default: '' },
    status: { type: 'string', enum: ['Published', 'Draft', 'Closed'], default: 'Published' },
    postedDate: { type: 'date', default: 'now()' },
    createdAt: { type: 'timestamp', default: 'now()' },
    updatedAt: { type: 'timestamp', default: 'now()' },
  },
};

module.exports = JobPositionModel;

