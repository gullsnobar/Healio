const router = require('express').Router();
const {
  getHealthInsights,
  getDailySummary,
  getWeeklyFeedback,
  getMedicationAlerts,
} = require('../controllers/ai/aiInsightsController');
const { authenticate } = require('../middleware/authentication');

router.use(authenticate);

// Primary endpoint — full AI health analysis
router.get('/health-insights', getHealthInsights);

// Light-weight sub-endpoints
router.get('/daily-summary', getDailySummary);
router.get('/weekly-feedback', getWeeklyFeedback);
router.get('/medication-alerts', getMedicationAlerts);

module.exports = router;
