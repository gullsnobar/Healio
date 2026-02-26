const router = require('express').Router();
const { generateReport, getReports, getReport, downloadReport } = require('../controllers/report/reportController');
const { authenticate } = require('../middleware/authentication');

router.use(authenticate);
router.post('/generate', generateReport);
router.get('/', getReports);
router.get('/:id', getReport);
router.get('/:id/download', downloadReport);

module.exports = router;
