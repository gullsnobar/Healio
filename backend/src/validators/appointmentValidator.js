const { body } = require('express-validator');
exports.createAppointmentValidation = [
  body('doctorName').trim().notEmpty().withMessage('Doctor name required'),
  body('date').isISO8601().withMessage('Valid date required'),
  body('time').notEmpty().withMessage('Time required'),
  body('type').optional().isIn(['in_person', 'video', 'phone']),
];
