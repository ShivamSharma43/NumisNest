const User = require('../models/User');

const seedAdmin = async () => {
  try {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
      return;
    }

    // Check if ANY admin already exists
    const adminExists = await User.findOne({ role: 'admin' });

    if (adminExists) {
      // Do nothing → only one admin allowed
      return;
    }

    // Check if user with this email already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      // ❌ DO NOT promote (security)
      return;
    }

    // Create admin only if no admin exists
    await User.create({
      name: 'Admin',
      email,
      password,
      role: 'admin',
    });

  } catch (err) {
    // Optional: keep silent or minimal logging
  }
};

module.exports = seedAdmin;