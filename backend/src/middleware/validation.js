const { validationResult } = require('express-validator');

const validate = (validations) => async (req, res, next) => {
  for (const validation of validations) { await validation.run(req); }
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();
  const errorList = errors.array().map(e => ({ field: e.path, message: e.msg }));
  const friendlyMessage = errorList.map(e => e.message).join('. ');
  return res.status(400).json({ success: false, message: friendlyMessage, errors: errorList });
};

module.exports = { validate };
