const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  // Support both custom 'token' header and standard 'Authorization: Bearer <token>'
  let token = req.headers.token || (
    req.headers.authorization && req.headers.authorization.startsWith('Bearer ')
      ? req.headers.authorization.split(' ')[1]
      : null
  );

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not Authorised. Login again'
    });
  }

  try {
    const token_decode = jwt.verify(token, process.env.JWT_SECRET);

    // BUG FIX: Populate req.user from DB (previously only req.userId was set,
    // but all controllers expect req.user to be the full user object)
    const user = await User.findById(token_decode.id).select('-password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found. Login again' });
    }

    req.user = user;
    req.userId = token_decode.id;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = { protect };