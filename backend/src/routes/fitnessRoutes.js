const router = require('express').Router();
const { getFitnessData, syncGoogleFit, addManualEntry, getWeeklyStats, getMonthlyStats } = require('../controllers/fitness/fitnessController');
const { getWaterIntake, addWaterEntry, updateWaterGoal } = require('../controllers/fitness/waterController');
const { getDietLogs, addDietEntry } = require('../controllers/fitness/dietController');
const { authenticate } = require('../middleware/authentication');

router.use(authenticate);
router.get('/', getFitnessData);
router.post('/sync', syncGoogleFit);
router.post('/manual', addManualEntry);
router.get('/stats/weekly', getWeeklyStats);
router.get('/stats/monthly', getMonthlyStats);
router.get('/water', getWaterIntake);
router.post('/water', addWaterEntry);
router.put('/water/goal', updateWaterGoal);
router.get('/diet', getDietLogs);
router.post('/diet', addDietEntry);

module.exports = router;
