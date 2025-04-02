// backend/services/emailService.js

import nodemailer from 'nodemailer';

const { MAIL_USER, MAIL_PASS } = process.env;

export const sendResetEmail = async (toEmail, resetLink) => {
  if (!MAIL_USER || !MAIL_PASS) {
    console.log('⚠️ MAIL_USER or MAIL_PASS missing from .env');
    console.log('📧 Password reset requested for:', toEmail);
    console.log('🔗 Reset link (DEV fallback):', resetLink);
    return;
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: MAIL_USER,
      pass: MAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"MerchantApp" <${MAIL_USER}>`,
    to: toEmail,
    subject: '🔑 Reset Your MerchantApp Password',
    html: `
      <p>Hello,</p>
      <p>You requested to reset your password. Click the link below:</p>
      <p><a href="${resetLink}">${resetLink}</a></p>
      <p>If you did not request this, please ignore this email.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Reset email sent to: ${toEmail}`);
  } catch (err) {
    console.error('❌ Failed to send reset email:', err.message);
  }
};
