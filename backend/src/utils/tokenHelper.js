const jwt = require('jsonwebtoken');
exports.generateAccessToken = (userId) => jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '30m' });
exports.generateRefreshToken = (userId) => jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d' });
exports.verifyAccessToken = (token) => jwt.verify(token, process.env.JWT_SECRET);
exports.verifyRefreshToken = (token) => jwt.verify(token, process.env.JWT_REFRESH_SECRET);
