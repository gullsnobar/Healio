const Admin = require('../models/Admin');

const authorize = (...roles) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ success: false, message: 'Not authenticated' });
  if (!roles.includes(req.user.role || 'user')) return res.status(403).json({ success: false, message: 'Not authorized for this action' });
  next();
};

const adminAuth = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.userId);
    if (!admin || !admin.isActive) return res.status(403).json({ success: false, message: 'Admin access required' });
    req.admin = admin;
    next();
  } catch { return res.status(500).json({ success: false, message: 'Authorization failed' }); }
};

const checkOwnership = (model) => async (req, res, next) => {
  try {
    const resource = await model.findById(req.params.id);
    if (!resource) return res.status(404).json({ success: false, message: 'Resource not found' });
    if (resource.user.toString() !== req.userId.toString()) return res.status(403).json({ success: false, message: 'Not authorized' });
    req.resource = resource;
    next();
  } catch { return res.status(500).json({ success: false, message: 'Authorization check failed' }); }
};

module.exports = { authorize, adminAuth, checkOwnership };
