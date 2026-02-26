const { body } = require('express-validator');
exports.generateReportValidation = [
  body('type').isIn(['weekly', 'monthly', 'quarterly', 'yearly', 'custom']).withMessage('Invalid report type'),
  body('startDate').isISO8601().withMessage('Valid start date required'),
  body('endDate').isISO8601().withMessage('Valid end date required'),
];
