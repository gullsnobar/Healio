const router = require('express').Router();
const { connectGoogleFitHandler, getFitnessData, syncGoogleFit, addManualEntry, getWeeklyStats, getMonthlyStats, logExercise, updateFitnessGoals, getWeeklyChartData } = require('../controllers/fitness/fitnessController');
const { getWaterIntake, addWaterEntry, updateWaterGoal } = require('../controllers/fitness/waterController');
const { getDietLogs, addDietEntry, getMealHistory, deleteMealEntry } = require('../controllers/fitness/dietController');
const { authenticate } = require('../middleware/authentication');

router.use(authenticate);
router.post('/googleFit/connect', connectGoogleFitHandler);
router.get('/', getFitnessData);
router.post('/sync', syncGoogleFit);
router.post('/manual', addManualEntry);
router.get('/stats/weekly', getWeeklyStats);
router.get('/stats/monthly', getMonthlyStats);
router.get('/stats/weekly-chart', getWeeklyChartData);
router.post('/exercise', logExercise);
router.put('/goals', updateFitnessGoals);
router.get('/water', getWaterIntake);
router.post('/water', addWaterEntry);
router.put('/water/goal', updateWaterGoal);
router.get('/diet', getDietLogs);
router.post('/diet', addDietEntry);
router.get('/diet/history', getMealHistory);
router.delete('/diet/:mealId', deleteMealEntry);

module.exports = router;
