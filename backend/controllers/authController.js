const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  // BUG FIX: Added fallback '7d' in case JWT_EXPIRE is not set in .env
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });
};

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ name, email, password });
    const token = generateToken(user._id);

    res.status(201).json({
      user: { _id: user._id, name: user.name, email: user.email, role: user.role, wishlist: user.wishlist, createdAt: user.createdAt },
      token
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user._id);
    res.json({
      user: { _id: user._id, name: user.name, email: user.email, role: user.role, wishlist: user.wishlist, createdAt: user.createdAt },
      token
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProfile = async (req, res) => {
  // BUG FIX: req.user is now populated by the auth middleware (was undefined before)
  res.json(req.user);
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, avatar },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    if (!(await user.comparePassword(currentPassword))) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.verifyToken = async (req, res) => {
  res.json({ valid: true, user: req.user });
};



// ── OTP Password Reset ────────────────────────────────────────────────────────

const OTP = require('../models/OTP');
const { sendOTP } = require('../config/mailer');

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.json({ message: 'If that email exists, an OTP has been sent.' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await OTP.deleteMany({ email: email.toLowerCase() });
    await OTP.create({ email: email.toLowerCase(), otp });

    try {
      await sendOTP(email, otp);
      res.json({ message: 'OTP sent to your email address.' });
    } catch (mailError) {
      // Delete OTP if email failed so user can retry
      await OTP.deleteMany({ email: email.toLowerCase() });
      console.error('Mail send error:', mailError.message);
      res.status(500).json({
        message: 'Failed to send email. Check MAIL_PASS in .env — it must be a Gmail App Password, not your regular password. Get it from: myaccount.google.com → Security → App Passwords'
      });
    }
  } catch (error) {
    console.error('forgotPassword error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

exports.verifyOTPAndResetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: 'Email, OTP and new password are required' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const record = await OTP.findOne({ email: email.toLowerCase(), otp });
    if (!record) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.password = newPassword;
    await user.save(); // bcrypt pre-save hook hashes it

    // Delete used OTP
    await OTP.deleteMany({ email: email.toLowerCase() });

    res.json({ message: 'Password reset successfully. You can now log in.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
