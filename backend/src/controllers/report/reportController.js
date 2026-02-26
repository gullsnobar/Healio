const HealthReport = require('../../models/HealthReport');
const { generateHealthReport } = require('../../services/report/reportGenerator');

exports.generateReport = async (req, res, next) => {
  try {
    const { type, startDate, endDate } = req.body;
    const report = await generateHealthReport(req.userId, type, new Date(startDate), new Date(endDate));
    res.status(201).json({ success: true, data: report });
  } catch (error) { next(error); }
};

exports.getReports = async (req, res, next) => {
  try {
    const { type, page = 1, limit = 10 } = req.query;
    const filter = { user: req.userId };
    if (type) filter.type = type;
    const reports = await HealthReport.find(filter).sort({ generatedAt: -1 }).skip((page - 1) * limit).limit(Number(limit));
    const total = await HealthReport.countDocuments(filter);
    res.json({ success: true, data: { reports, pagination: { page: Number(page), limit: Number(limit), total } } });
  } catch (error) { next(error); }
};

exports.getReport = async (req, res, next) => {
  try {
    const report = await HealthReport.findOne({ _id: req.params.id, user: req.userId });
    if (!report) return res.status(404).json({ success: false, message: 'Report not found' });
    res.json({ success: true, data: report });
  } catch (error) { next(error); }
};

exports.downloadReport = async (req, res, next) => {
  try {
    const report = await HealthReport.findOne({ _id: req.params.id, user: req.userId });
    if (!report) return res.status(404).json({ success: false, message: 'Report not found' });
    if (report.fileUrl) return res.redirect(report.fileUrl);
    res.json({ success: true, data: report });
  } catch (error) { next(error); }
};
