/**
 * Onboarding Document Model
 */
const OnboardingDocumentModel = {
  tableName: 'onboarding_documents',
  fields: {
    id: { type: 'string', primaryKey: true }, // e.g. doc-101
    tenantId: { type: 'string', required: true },
    employeeId: { type: 'string', required: true },
    employeeName: { type: 'string', required: true },
    documentType: {
      type: 'string',
      enum: ['Government ID', 'Address Proof', 'Educational Degree', 'Experience Certificate', 'Signed Offer Letter', 'Tax Declaration'],
      required: true,
    },
    fileName: { type: 'string', required: true },
    fileUrl: { type: 'string', required: true },
    fileSize: { type: 'string', default: '1.2 MB' },
    uploadedDate: { type: 'date', default: 'now()' },
    verificationStatus: {
      type: 'string',
      enum: ['Pending', 'Verified', 'Rejected'],
      default: 'Pending',
    },
    rejectionReason: { type: 'text', default: '' },
    verifiedBy: { type: 'string', default: null },
    createdAt: { type: 'timestamp', default: 'now()' },
    updatedAt: { type: 'timestamp', default: 'now()' },
  },
};

module.exports = OnboardingDocumentModel;
