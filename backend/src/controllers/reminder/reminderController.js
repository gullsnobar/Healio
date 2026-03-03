const reminderService = require('../../services/reminder/reminderService');
const logger = require('../../utils/logger');

/**
 * @desc   Create a new reminder
 * @route  POST /api/reminders
 */
exports.createReminder = async (req, res) => {
  try {
    const reminder = await reminderService.createReminder(req.user.id, req.body);
    res.status(201).json({ success: true, data: reminder });
  } catch (err) {
    logger.error('Create reminder failed', { error: err.message, userId: req.user.id });
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

/**
 * @desc   Get all reminders (with optional ?type= filter)
 * @route  GET /api/reminders
 */
exports.getReminders = async (req, res) => {
  try {
    const { type, active, page, limit } = req.query;
    const result = await reminderService.getReminders(req.user.id, { type, active, page, limit });
    res.json({ success: true, ...result });
  } catch (err) {
    logger.error('Get reminders failed', { error: err.message, userId: req.user.id });
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

/**
 * @desc   Get upcoming reminders (dashboard widget)
 * @route  GET /api/reminders/upcoming
 */
exports.getUpcomingReminders = async (req, res) => {
  try {
    const hours = req.query.hours || 24;
    const reminders = await reminderService.getUpcomingReminders(req.user.id, hours);
    res.json({ success: true, data: reminders });
  } catch (err) {
    logger.error('Get upcoming reminders failed', { error: err.message, userId: req.user.id });
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

/**
 * @desc   Get a single reminder
 * @route  GET /api/reminders/:id
 */
exports.getReminderById = async (req, res) => {
  try {
    const reminder = await reminderService.getReminderById(req.user.id, req.params.id);
    res.json({ success: true, data: reminder });
  } catch (err) {
    logger.error('Get reminder by ID failed', { error: err.message, userId: req.user.id });
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

/**
 * @desc   Update a reminder
 * @route  PUT /api/reminders/:id
 */
exports.updateReminder = async (req, res) => {
  try {
    const reminder = await reminderService.updateReminder(req.user.id, req.params.id, req.body);
    res.json({ success: true, data: reminder });
  } catch (err) {
    logger.error('Update reminder failed', { error: err.message, userId: req.user.id });
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

/**
 * @desc   Delete a reminder
 * @route  DELETE /api/reminders/:id
 */
exports.deleteReminder = async (req, res) => {
  try {
    await reminderService.deleteReminder(req.user.id, req.params.id);
    res.json({ success: true, message: 'Reminder deleted successfully' });
  } catch (err) {
    logger.error('Delete reminder failed', { error: err.message, userId: req.user.id });
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

/**
 * @desc   Mark a reminder as completed
 * @route  PATCH /api/reminders/:id/complete
 */
exports.completeReminder = async (req, res) => {
  try {
    const reminder = await reminderService.completeReminder(req.user.id, req.params.id);
    res.json({ success: true, data: reminder });
  } catch (err) {
    logger.error('Complete reminder failed', { error: err.message, userId: req.user.id });
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

/**
 * @desc   Snooze a reminder
 * @route  PATCH /api/reminders/:id/snooze
 */
exports.snoozeReminder = async (req, res) => {
  try {
    const minutes = req.body.minutes || 15;
    const reminder = await reminderService.snoozeReminder(req.user.id, req.params.id, minutes);
    res.json({ success: true, data: reminder });
  } catch (err) {
    logger.error('Snooze reminder failed', { error: err.message, userId: req.user.id });
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};
