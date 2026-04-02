const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware: verify token AND require admin role
const adminProtect = async (req, res, next) => {
  let token = req.headers.token || (
    req.headers.authorization && req.headers.authorization.startsWith('Bearer ')
      ? req.headers.authorization.split(' ')[1]
      : null
  );

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not Authorised. Login again' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) return res.status(401).json({ success: false, message: 'User not found' });
    if (user.role !== 'admin') return res.status(403).json({ success: false, message: 'Admin access required' });

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: error.message });
  }
};

module.exports = { adminProtect };
