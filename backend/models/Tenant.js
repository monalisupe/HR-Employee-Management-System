/**
 * Tenant & Organization Model
 */
const TenantModel = {
  tableName: 'tenants',
  fields: {
    id: { type: 'string', primaryKey: true }, // e.g. TENANT-ST-2026-X
    name: { type: 'string', required: true },
    legalName: { type: 'string', required: true },
    industry: { type: 'string', default: 'Enterprise Solutions' },
    status: { type: 'string', enum: ['Active', 'Suspended', 'Pending'], default: 'Active' },
    plan: { type: 'string', default: 'Enterprise Tier' },
    departments: { type: 'jsonb', default: [] },
    designations: { type: 'jsonb', default: [] },
    recruiters: { type: 'jsonb', default: [] },
    settings: { type: 'jsonb', default: {} },
    createdAt: { type: 'timestamp', default: 'now()' },
    updatedAt: { type: 'timestamp', default: 'now()' },
  },
};

module.exports = TenantModel;
