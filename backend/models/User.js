/**
 * User Model & Schema Definition
 */
const UserModel = {
  tableName: 'users',
  fields: {
    id: { type: 'uuid', primaryKey: true },
    tenantId: { type: 'string', required: true },
    email: { type: 'string', required: true, unique: true },
    passwordHash: { type: 'string', required: true },
    fullName: { type: 'string', required: true },
    role: { type: 'string', enum: ['hr', 'candidate', 'employee'], default: 'candidate' },
    avatarUrl: { type: 'string', default: null },
    isActive: { type: 'boolean', default: true },
    createdAt: { type: 'timestamp', default: 'now()' },
    updatedAt: { type: 'timestamp', default: 'now()' },
  },
};

module.exports = UserModel;

