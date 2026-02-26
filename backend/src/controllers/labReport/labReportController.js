const LabReport = require('../../models/LabReport');

exports.getAllReports = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, type } = req.query;
    const filter = { user: req.userId };
    if (type) filter.testType = type;
    const reports = await LabReport.find(filter).sort({ date: -1 }).skip((page - 1) * limit).limit(Number(limit));
    const total = await LabReport.countDocuments(filter);
    res.json({ success: true, data: { reports, pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) } } });
  } catch (error) { next(error); }
};

exports.getReport = async (req, res, next) => {
  try {
    const report = await LabReport.findOne({ _id: req.params.id, user: req.userId });
    if (!report) return res.status(404).json({ success: false, message: 'Report not found' });
    res.json({ success: true, data: report });
  } catch (error) { next(error); }
};

exports.createReport = async (req, res, next) => {
  try {
    const reportData = { ...req.body, user: req.userId };
    if (req.file) { reportData.fileUrl = req.file.path; reportData.fileType = req.file.mimetype.includes('pdf') ? 'pdf' : 'image'; }
    const report = await LabReport.create(reportData);
    res.status(201).json({ success: true, data: report });
  } catch (error) { next(error); }
};

exports.updateReport = async (req, res, next) => {
  try {
    const report = await LabReport.findOneAndUpdate({ _id: req.params.id, user: req.userId }, req.body, { new: true, runValidators: true });
    if (!report) return res.status(404).json({ success: false, message: 'Report not found' });
    res.json({ success: true, data: report });
  } catch (error) { next(error); }
};

exports.deleteReport = async (req, res, next) => {
  try {
    const report = await LabReport.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!report) return res.status(404).json({ success: false, message: 'Report not found' });
    res.json({ success: true, message: 'Report deleted' });
  } catch (error) { next(error); }
};
