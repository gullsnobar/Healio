const jwt = require('jsonwebtoken');
const User = require('../../models/User');

exports.verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    res.json({ success: true, data: { valid: !!user, user } });
  } catch {
    res.json({ success: true, data: { valid: false } });
  }
};
