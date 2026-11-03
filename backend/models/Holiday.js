/**
 * Holiday Model
 */
const HolidayModel = {
  tableName: 'holidays',
  fields: {
    id: { type: 'string', primaryKey: true }, // e.g. hol-101
    tenantId: { type: 'string', required: true },
    title: { type: 'string', required: true },
    date: { type: 'date', required: true },
    day: { type: 'string', default: '' },
    type: { type: 'string', default: 'National' }, // 'National' | 'Mandatory' | 'Optional'
    year: { type: 'number', default: 2026 },
    createdAt: { type: 'timestamp', default: 'now()' },
    updatedAt: { type: 'timestamp', default: 'now()' },
  },
};

module.exports = HolidayModel;

