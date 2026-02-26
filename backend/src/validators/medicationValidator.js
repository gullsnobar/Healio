const { body } = require('express-validator');
exports.createMedicationValidation = [
  body('name').trim().notEmpty().withMessage('Medication name required'),
  body('dosage').notEmpty().withMessage('Dosage required'),
  body('frequency').isIn(['once_daily', 'twice_daily', 'three_daily', 'four_daily', 'weekly', 'as_needed', 'custom']).withMessage('Invalid frequency'),
  body('startDate').isISO8601().withMessage('Valid start date required'),
  body('endDate').optional().isISO8601().withMessage('Valid end date required'),
];
