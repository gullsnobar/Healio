const appConfig = {
  name: 'HEALIO',
  version: '1.0.0',
  description: 'All-in-One Health Management App',

  // JWT token expiry in minutes
  tokenExpiryMinutes: 30,

  // Notification settings
  notifications: {
    appointmentReminder24h: true,
    appointmentReminder1h: true,
    medicationReminder: true,
    missedDoseAlert: true,
  },

  // Fitness defaults
  fitness: {
    dailyStepGoal: 10000,
    dailyWaterGoalMl: 2500,
    dailySleepGoalHours: 8,
    dailyCalorieGoal: 2000,
  },

  // Pagination
  pagination: {
    defaultPageSize: 20,
    maxPageSize: 100,
  },

  // File upload
  upload: {
    maxFileSizeMB: 10,
    allowedImageTypes: ['image/jpeg', 'image/png'],
    allowedDocTypes: ['application/pdf'],
  },

  // Supported languages
  languages: ['en', 'ur'],
  defaultLanguage: 'en',
};

export default appConfig;
