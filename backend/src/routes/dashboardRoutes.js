const router = require('express').Router();
const { getDashboardData, getHealthScore, getQuickStats } = require('../controllers/dashboard/dashboardController');
const { authenticate } = require('../middleware/authentication');

router.use(authenticate);
router.get('/', getDashboardData);
router.get('/health-score', getHealthScore);
router.get('/quick-stats', getQuickStats);

module.exports = router;
