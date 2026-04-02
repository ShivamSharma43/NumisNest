const nodemailer = require('nodemailer');

/**
 * IMPORTANT: MAIL_PASS must be a Gmail App Password (16 chars, no spaces)
 * Regular Gmail password will NOT work — Google blocks it.
 *
 * How to get one:
 * 1. myaccount.google.com → Security → 2-Step Verification (enable it)
 * 2. myaccount.google.com → Security → App Passwords
 * 3. Select "Mail" + "Windows Computer" → Generate
 * 4. Copy the 16-char code → paste as MAIL_PASS in .env (no spaces)
 */

const sendOTP = async (toEmail, otp) => {
  if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
    throw new Error('MAIL_USER or MAIL_PASS not set in .env');
  }

  if (process.env.MAIL_PASS === 'your_gmail_app_password_here') {
    throw new Error(
      'MAIL_PASS is still the placeholder value. Set it to a real Gmail App Password in .env.\n' +
      'Get one from: myaccount.google.com → Security → App Passwords'
    );
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS.replace(/\s/g, ''), // strip any spaces in App Password
    },
    tls: { rejectUnauthorized: false },
  });

  await transporter.sendMail({
    from: `"NumisNest" <${process.env.MAIL_USER}>`,
    to: toEmail,
    subject: 'NumisNest — Your Password Reset OTP',
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px;border:1px solid #e5e7eb;border-radius:12px;">
        <h2 style="color:#92400e;">NumisNest Password Reset</h2>
        <p style="color:#6b7280;">Use the OTP below — expires in <strong>10 minutes</strong>.</p>
        <div style="background:#fef3c7;border:1px solid #fcd34d;border-radius:8px;padding:24px;text-align:center;margin:24px 0;">
          <span style="font-size:36px;font-weight:700;letter-spacing:12px;color:#92400e;">${otp}</span>
        </div>
        <p style="color:#9ca3af;font-size:13px;">If you didn't request this, ignore this email.</p>
      </div>
    `,
  });
};

module.exports = { sendOTP };
