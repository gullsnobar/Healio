const router = require('express').Router();
const { getAllAppointments, getAppointment, createAppointment, updateAppointment, deleteAppointment, getUpcomingAppointments } = require('../controllers/appointment/appointmentController');
const { authenticate } = require('../middleware/authentication');

router.use(authenticate);
router.route('/').get(getAllAppointments).post(createAppointment);
router.get('/upcoming', getUpcomingAppointments);
router.route('/:id').get(getAppointment).put(updateAppointment).delete(deleteAppointment);

module.exports = router;
