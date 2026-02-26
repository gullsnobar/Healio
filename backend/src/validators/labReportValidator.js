const { body } = require('express-validator');
exports.createLabReportValidation = [
  body('title').trim().notEmpty().withMessage('Title required'),
  body('testType').notEmpty().withMessage('Test type required'),
  body('date').isISO8601().withMessage('Valid date required'),
];
