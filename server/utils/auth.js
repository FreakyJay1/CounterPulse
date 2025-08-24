const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

module.exports = (roles = []) => async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    if (roles.includes('admin') && decoded.role === 'admin') return next();
    if (roles.includes('self') && decoded.id == req.params.id) return next();
    if (roles.includes(decoded.role)) return next();
    return res.status(403).json({ error: 'Forbidden' });
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
