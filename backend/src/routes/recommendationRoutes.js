const router = require('express').Router();
const { getRecommendations, getRecommendation, dismissRecommendation, markAsRead, submitFeedback } = require('../controllers/recommendation/recommendationController');
const { authenticate } = require('../middleware/authentication');

router.use(authenticate);
router.get('/', getRecommendations);
router.get('/:id', getRecommendation);
router.patch('/:id/dismiss', dismissRecommendation);
router.patch('/:id/read', markAsRead);
router.post('/:id/feedback', submitFeedback);

module.exports = router;
