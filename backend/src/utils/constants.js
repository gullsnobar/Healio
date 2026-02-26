module.exports = {
  ROLES: { USER: 'user', ADMIN: 'admin', SUPER_ADMIN: 'super_admin' },
  MEDICATION_FREQUENCY: ['once_daily', 'twice_daily', 'three_daily', 'four_daily', 'weekly', 'as_needed', 'custom'],
  APPOINTMENT_STATUS: ['upcoming', 'completed', 'cancelled', 'rescheduled', 'no_show'],
  NOTIFICATION_TYPES: ['medication', 'appointment', 'fitness', 'lab_report', 'recommendation', 'system', 'emergency', 'refill'],
  BLOOD_GROUPS: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
  MAX_FILE_SIZE: 10 * 1024 * 1024,
  PAGINATION: { DEFAULT_PAGE: 1, DEFAULT_LIMIT: 20, MAX_LIMIT: 100 },
};
