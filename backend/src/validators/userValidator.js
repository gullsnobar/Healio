const { body } = require('express-validator');
exports.updateProfileValidation = [
  body('name').optional().trim().isLength({ min: 1, max: 50 }),
  body('phone').optional().isMobilePhone(),
  body('gender').optional().isIn(['male', 'female', 'other']),
  body('bloodGroup').optional().isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
  body('preferredLanguage').optional().isIn(['en', 'ur']),
];
