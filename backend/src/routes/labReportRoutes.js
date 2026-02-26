const router = require('express').Router();
const { getAllReports, getReport, createReport, updateReport, deleteReport } = require('../controllers/labReport/labReportController');
const { analyzeReport } = require('../controllers/labReport/analysisController');
const { uploadSingle } = require('../middleware/fileUpload');
const { authenticate } = require('../middleware/authentication');

router.use(authenticate);
router.route('/').get(getAllReports).post(uploadSingle('reportFile'), createReport);
router.route('/:id').get(getReport).put(updateReport).delete(deleteReport);
router.post('/:id/analyze', analyzeReport);

module.exports = router;
