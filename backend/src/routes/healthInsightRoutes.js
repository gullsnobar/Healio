const router = require('express').Router();
const {
  getInsights,
  generateInsights,
  getSummary,
  markAsRead,
  dismissInsight,
  completeAction,
} = require('../controllers/healthInsight/healthInsightController');
const { authenticate } = require('../middleware/authentication');

router.use(authenticate);

router.get('/', getInsights);
router.post('/generate', generateInsights);
router.get('/summary', getSummary);
router.patch('/:id/read', markAsRead);
router.patch('/:id/dismiss', dismissInsight);
router.patch('/:id/action/:actionIndex', completeAction);

module.exports = router;
