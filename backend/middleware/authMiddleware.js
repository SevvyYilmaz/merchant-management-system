import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

// 🧠 Optional: Simulated token blacklist (replace with Redis or DB in production)
const blacklistedTokens = new Set();

// ✅ Middleware: Auth + Verify Token
export const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access Denied: No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  // ⛔ Optional: Simulate token blacklist check
  if (blacklistedTokens.has(token)) {
    return res.status(401).json({ message: 'Session expired. Please login again.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // 🛑 Block inactive users
    if (user.status === 'inactive') {
      return res.status(403).json({ message: 'Account is inactive. Contact support.' });
    }

    // 🌐 Attach user info + request metadata
    req.user = user;
    req.user.ip = req.ip;
    req.token = token; // if needed for logout
    next();
  } catch (err) {
    console.error('❌ JWT Verification Failed:', err.message);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// ✅ Middleware: Role-based Access Control
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Required role(s): ${allowedRoles.join(', ')}`
      });
    }
    next();
  };
};

// 🚀 Optional: Logout Helper to blacklist a token
export const logoutUser = (req, res) => {
  const token = req.token || req.headers.authorization?.split(' ')[1];
  if (token) {
    blacklistedTokens.add(token);
    return res.status(200).json({ message: 'Logged out successfully' });
  }
  return res.status(400).json({ message: 'No token to blacklist' });
};
