const router = require('express').Router();
const { getNotifications, markAsRead, markAllAsRead, deleteNotification, updatePreferences } = require('../controllers/notification/notificationController');
const { authenticate } = require('../middleware/authentication');

router.use(authenticate);
router.get('/', getNotifications);
router.patch('/:id/read', markAsRead);
router.patch('/read-all', markAllAsRead);
router.delete('/:id', deleteNotification);
router.put('/preferences', updatePreferences);

module.exports = router;
