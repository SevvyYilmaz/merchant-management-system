import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const user = new User({
      username,
      email: email.toLowerCase().trim(),
      password,
      role: role || 'user'
    });

    await user.save();
    console.log("✅ Registered new user:", user.username);

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error("❌ Error registering user:", error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email or username already exists' });
    }
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};

export const login = async (req, res) => {
  console.log("📥 Login attempt:", req.body);

  try {
    const { email, password } = req.body;

    console.log("🔍 Extracted email:", email);
    console.log("🔍 Extracted password:", password);

    if (!email || !password) {
      console.warn("⚠️ Missing email or password");
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      console.warn("❌ User not found:", email);
      return res.status(400).json({ message: 'User not found' });
    }

    console.log("🔐 Found user:", user.email);
    console.log("🧠 Incoming password:", password);
    console.log("🧠 Stored hash:", user.password);

    const isMatch = await user.comparePassword(password);

    console.log("🔐 Password match result:", isMatch);

    if (!isMatch) {
      console.warn("❌ Incorrect password for:", email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '8h' }
    );

    console.log("✅ Logged in:", user.email);

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};

export const forgotPassword = (req, res) => {
  res.send("🔧 Forgot Password - Coming Soon");
};
