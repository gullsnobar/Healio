const router = require('express').Router();
const { getAllMedications, getMedication, createMedication, updateMedication, deleteMedication, markAsTaken } = require('../controllers/medication/medicationController');
const { recordAdherence, getAdherenceHistory, getAdherenceStats } = require('../controllers/medication/adherenceController');
const { setRefillReminder, getRefillReminders } = require('../controllers/medication/refillController');
const { authenticate } = require('../middleware/authentication');

router.use(authenticate);
router.route('/').get(getAllMedications).post(createMedication);
router.get('/stats/adherence', getAdherenceStats);
router.get('/reminders/refill', getRefillReminders);
router.route('/:id').get(getMedication).put(updateMedication).delete(deleteMedication);
router.post('/:id/take', markAsTaken);
router.post('/:id/adherence', recordAdherence);
router.get('/:id/adherence/history', getAdherenceHistory);
router.post('/:id/refill', setRefillReminder);

module.exports = router;
