const router = require('express').Router();
const {
  createReminder,
  getReminders,
  getUpcomingReminders,
  getReminderById,
  updateReminder,
  deleteReminder,
  completeReminder,
  snoozeReminder,
} = require('../controllers/reminder/reminderController');
const { authenticate } = require('../middleware/authentication');

router.use(authenticate);

router.route('/').get(getReminders).post(createReminder);
router.get('/upcoming', getUpcomingReminders);
router.route('/:id').get(getReminderById).put(updateReminder).delete(deleteReminder);
router.patch('/:id/complete', completeReminder);
router.patch('/:id/snooze', snoozeReminder);

module.exports = router;
