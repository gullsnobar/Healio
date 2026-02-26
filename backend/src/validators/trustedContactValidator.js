const { body } = require('express-validator');
exports.addContactValidation = [
  body('name').trim().notEmpty().withMessage('Name required'),
  body('email').isEmail().withMessage('Valid email required'),
  body('relationship').isIn(['family', 'friend', 'doctor', 'caregiver', 'other']).withMessage('Invalid relationship'),
];
