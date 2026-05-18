const { Reminder, MedicationReminder, AppointmentReminder, LabReminder } = require('../../models/Reminder');
const logger = require('../../utils/logger');

// Map discriminator type → model for type-scoped queries
const MODEL_MAP = {
  medication: MedicationReminder,
  appointment: AppointmentReminder,
  lab: LabReminder,
};

/**
 * Create a reminder (auto-selects discriminator by reminderType)
 */
exports.createReminder = async (userId, data) => {
  const Model = MODEL_MAP[data.reminderType];
  if (!Model) throw Object.assign(new Error('Invalid reminder type'), { statusCode: 400 });

  const reminder = await Model.create({ ...data, user: userId });
  logger.info(`Reminder created: ${reminder.reminderType} – ${reminder.title}`, { userId, reminderId: reminder._id });
  return reminder;
};

/**
 * Get all reminders (optionally filtered by type)
 */
exports.getReminders = async (userId, { type, active, page = 1, limit = 20 } = {}) => {
  const Model = type && MODEL_MAP[type] ? MODEL_MAP[type] : Reminder;
  const filter = { user: userId };
  if (active !== undefined) filter.isActive = active === 'true' || active === true;

  const total = await Model.countDocuments(filter);
  const reminders = await Model.find(filter)
    .sort({ date: 1, time: 1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  return {
    reminders,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

/**
 * Get a single reminder by ID
 */
exports.getReminderById = async (userId, reminderId) => {
  const reminder = await Reminder.findOne({ _id: reminderId, user: userId });
  if (!reminder) throw Object.assign(new Error('Reminder not found'), { statusCode: 404 });
  return reminder;
};

/**
 * Update a reminder
 */
exports.updateReminder = async (userId, reminderId, data) => {
  const reminder = await Reminder.findOneAndUpdate(
    { _id: reminderId, user: userId },
    data,
    { new: true, runValidators: true }
  );
  if (!reminder) throw Object.assign(new Error('Reminder not found'), { statusCode: 404 });
  return reminder;
};

/**
 * Delete a reminder
 */
exports.deleteReminder = async (userId, reminderId) => {
  const reminder = await Reminder.findOneAndDelete({ _id: reminderId, user: userId });
  if (!reminder) throw Object.assign(new Error('Reminder not found'), { statusCode: 404 });
  return reminder;
};

/**
 * Mark a reminder as completed
 */
exports.completeReminder = async (userId, reminderId) => {
  const reminder = await Reminder.findOne({ _id: reminderId, user: userId });
  if (!reminder) throw Object.assign(new Error('Reminder not found'), { statusCode: 404 });
  return reminder.markCompleted();
};

/**
 * Snooze a reminder
 */
exports.snoozeReminder = async (userId, reminderId, minutes = 15) => {
  const reminder = await Reminder.findOne({ _id: reminderId, user: userId });
  if (!reminder) throw Object.assign(new Error('Reminder not found'), { statusCode: 404 });
  return reminder.snooze(minutes);
};

/**
 * Get upcoming reminders (next 24h, for dashboard widgets)
 */
exports.getUpcomingReminders = async (userId, hours = 24) => {
  const now = new Date();
  const future = new Date(now.getTime() + hours * 60 * 60 * 1000);
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  return Reminder.find({
    user: userId,
    isActive: true,
    isCompleted: false,
    date: { $gte: startOfToday, $lte: future },
  })
    .sort({ date: 1, time: 1 })
    .limit(20);
};

/**
 * Get reminders due for notification (used by cron jobs)
 */
exports.getDueReminders = async () => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const toHHMM = (d) => {
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    return `${hh}:${mm}`;
  };

  const slots = new Set([toHHMM(now)]);
  for (let i = 1; i <= 2; i++) {
    const d = new Date(now.getTime() - i * 60 * 1000);
    slots.add(toHHMM(d));
  }
  const timeSlots = Array.from(slots);

  return Reminder.find({
    isActive: true,
    isCompleted: false,
    notificationSent: false,
    date: { $gte: today, $lt: new Date(today.getTime() + 86400000) },
    time: { $in: timeSlots },
    $or: [
      { snoozedUntil: null },
      { snoozedUntil: { $lte: now } },
    ],
  }).populate('user');
};
