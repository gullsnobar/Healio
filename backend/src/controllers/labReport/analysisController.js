const LabReport = require('../../models/LabReport');
const axios = require('axios');
const { aiEngineUrl } = require('../../config/environment');

exports.analyzeReport = async (req, res, next) => {
  try {
    const report = await LabReport.findOne({ _id: req.params.id, user: req.userId });
    if (!report) return res.status(404).json({ success: false, message: 'Report not found' });
    const aiResponse = await axios.post(aiEngineUrl + '/api/analyze-lab-report', { results: report.results, testType: report.testType });
    report.aiAnalysis = { ...aiResponse.data, analyzedAt: new Date() };
    await report.save();
    res.json({ success: true, data: report.aiAnalysis });
  } catch (error) { next(error); }
};
