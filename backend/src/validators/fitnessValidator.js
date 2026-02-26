const { body } = require('express-validator');
exports.manualEntryValidation = [
  body('steps.count').optional().isInt({ min: 0 }).withMessage('Steps must be positive'),
  body('sleep.duration').optional().isFloat({ min: 0, max: 24 }).withMessage('Sleep 0-24 hours'),
  body('weight.value').optional().isFloat({ min: 20, max: 300 }).withMessage('Weight 20-300 kg'),
];
