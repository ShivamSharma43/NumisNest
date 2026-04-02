/**
 * One-time script to fix/reset the admin user in MongoDB.
 * Run with:  node scripts/resetAdmin.js
 *
 * This will:
 *  1. Delete any existing user with ADMIN_EMAIL
 *  2. Re-create them fresh with role:'admin' and the correct password
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

async function resetAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.error('  ADMIN_EMAIL or ADMIN_PASSWORD not set in .env');
    process.exit(1);
  }

  console.log('Connecting to MongoDB...');
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected.');

  // Delete old admin if exists
  const deleted = await User.deleteOne({ email });
  if (deleted.deletedCount) {
    console.log(`  Deleted old user: ${email}`);
  }

  // Create fresh with correct role
  const admin = await User.create({
    name: 'Admin',
    email,
    password,   // pre-save hook will hash this
    role: 'admin',
  });

  console.log(`  Admin created successfully!`);
  console.log(`    Email : ${admin.email}`);
  console.log(`    Role  : ${admin.role}`);
  console.log(`    ID    : ${admin._id}`);

  await mongoose.disconnect();
  process.exit(0);
}

resetAdmin().catch(err => {
  console.error('  Error:', err.message);
  process.exit(1);
});
