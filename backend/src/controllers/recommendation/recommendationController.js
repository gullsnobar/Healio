const Recommendation = require('../../models/Recommendation');

exports.getRecommendations = async (req, res, next) => {
  try {
    const { type, page = 1, limit = 20 } = req.query;
    const filter = { user: req.userId, isDismissed: false };
    if (type) filter.type = type;
    const recs = await Recommendation.find(filter).sort({ priority: -1, createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit));
    const total = await Recommendation.countDocuments(filter);
    res.json({ success: true, data: { recommendations: recs, pagination: { page: Number(page), limit: Number(limit), total } } });
  } catch (error) { next(error); }
};

exports.getRecommendation = async (req, res, next) => {
  try {
    const rec = await Recommendation.findOne({ _id: req.params.id, user: req.userId });
    if (!rec) return res.status(404).json({ success: false, message: 'Recommendation not found' });
    res.json({ success: true, data: rec });
  } catch (error) { next(error); }
};

exports.dismissRecommendation = async (req, res, next) => {
  try {
    const rec = await Recommendation.findOneAndUpdate({ _id: req.params.id, user: req.userId }, { isDismissed: true }, { new: true });
    if (!rec) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, message: 'Recommendation dismissed' });
  } catch (error) { next(error); }
};

exports.markAsRead = async (req, res, next) => {
  try {
    await Recommendation.findOneAndUpdate({ _id: req.params.id, user: req.userId }, { isRead: true });
    res.json({ success: true, message: 'Marked as read' });
  } catch (error) { next(error); }
};

exports.submitFeedback = async (req, res, next) => {
  try {
    const rec = await Recommendation.findOneAndUpdate({ _id: req.params.id, user: req.userId }, { feedback: req.body }, { new: true });
    if (!rec) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: rec.feedback });
  } catch (error) { next(error); }
};
