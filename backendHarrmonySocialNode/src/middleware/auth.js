const jwt = require('jsonwebtoken');
const repo = require('../repositories/userRepository');

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

module.exports = async function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) return res.status(401).json({ detail: 'Authentication credentials were not provided.' });
  const token = header.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await repo.getById(payload.sub);
    if (!user) return res.status(401).json({ detail: 'Invalid token user' });
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ detail: 'Invalid or expired token' });
  }
};
